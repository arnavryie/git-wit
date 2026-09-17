// GitWit Live — Standalone Authentic GitHub Profile & Repository Hub
// 100% Real Live GitHub REST API Data — Zero Fake / Mock Values

const GITHUB_API = "https://api.github.com";

// Standard GitHub Language Colors
const LANG_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  PHP: "#4F5D95",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Ruby: "#701516",
  Go: "#00ADD8",
  Rust: "#dea584",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Dart: "#00B4AB",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Jupyter: "#DA5B0B",
  "Jupyter Notebook": "#DA5B0B",
  Lua: "#000080",
  R: "#198CE7",
  Scala: "#c22d40",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Zig: "#ec915c",
  Nix: "#7e7eff"
};

function getLanguageColor(lang) {
  if (!lang) return "#8b949e";
  return LANG_COLORS[lang] || "#8b949e";
}

function timeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

// State
let currentUsername = "";
let allRepos = [];
let allEvents = [];
let userPAT = localStorage.getItem("gitwit_pat") || "";

// DOM Elements
const usernameForm = document.getElementById("usernameForm");
const usernameInput = document.getElementById("usernameInput");
const patInput = document.getElementById("patInput");
const submitBtn = document.getElementById("submitBtn");
const loginSpinner = document.getElementById("loginSpinner");
const rateLimitBadge = document.getElementById("rateLimitBadge");
const rateLimitText = document.getElementById("rateLimitText");
const errorBanner = document.getElementById("errorBanner");
const errorTitle = document.getElementById("errorTitle");
const errorMessage = document.getElementById("errorMessage");
const closeErrorBtn = document.getElementById("closeErrorBtn");
const loginCard = document.getElementById("loginCard");
const openLoginBtn = document.getElementById("openLoginBtn");

const profileSection = document.getElementById("profileSection");
const userAvatar = document.getElementById("userAvatar");
const userName = document.getElementById("userName");
const userLogin = document.getElementById("userLogin");
const userBio = document.getElementById("userBio");
const hireableBadge = document.getElementById("hireableBadge");
const userLocation = document.getElementById("userLocation");
const userCompany = document.getElementById("userCompany");
const userBlog = document.getElementById("userBlog");
const userJoined = document.getElementById("userJoined");
const ghProfileLink = document.getElementById("ghProfileLink");

const statRepos = document.getElementById("statRepos");
const statFollowers = document.getElementById("statFollowers");
const statFollowing = document.getElementById("statFollowing");
const statStars = document.getElementById("statStars");

const languageBar = document.getElementById("languageBar");
const languageLegend = document.getElementById("languageLegend");
const langCountLabel = document.getElementById("langCountLabel");

const tabReposBtn = document.getElementById("tabReposBtn");
const tabActivityBtn = document.getElementById("tabActivityBtn");
const tabReposContent = document.getElementById("tabReposContent");
const tabActivityContent = document.getElementById("tabActivityContent");
const repoTabCount = document.getElementById("repoTabCount");
const activityTabCount = document.getElementById("activityTabCount");

const repoSearchInput = document.getElementById("repoSearchInput");
const langFilterSelect = document.getElementById("langFilterSelect");
const sortSelect = document.getElementById("sortSelect");
const reposGrid = document.getElementById("reposGrid");
const noReposMatch = document.getElementById("noReposMatch");
const activityTimeline = document.getElementById("activityTimeline");

// API Request Wrapper
async function fetchFromGitHub(endpoint) {
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GitWit-Live"
  };

  if (userPAT) {
    headers["Authorization"] = `Bearer ${userPAT}`;
  }

  const response = await fetch(`${GITHUB_API}${endpoint}`, { headers });
  
  // Track rate limit headers
  const remaining = response.headers.get("x-ratelimit-remaining");
  const limit = response.headers.get("x-ratelimit-limit");
  if (remaining !== null && limit !== null) {
    updateRateLimitUI(remaining, limit);
  }

  if (response.status === 403 || response.status === 429) {
    throw new Error("GitHub API rate limit exceeded (60 req/hr for unauthenticated requests). Consider adding a PAT token below to unlock 5,000 req/hr.");
  }
  if (response.status === 404) {
    throw new Error("User or resource not found on GitHub.");
  }
  if (!response.ok) {
    throw new Error(`GitHub API error (${response.status}): ${response.statusText}`);
  }

  return response.json();
}

function updateRateLimitUI(remaining, limit) {
  rateLimitText.textContent = `API: ${remaining}/${limit} left`;
  const dot = rateLimitBadge.querySelector(".pulse-dot");
  if (Number(remaining) < 5) {
    dot.style.backgroundColor = "var(--color-red)";
    dot.style.boxShadow = "0 0 8px var(--color-red)";
  } else if (Number(remaining) < 15) {
    dot.style.backgroundColor = "var(--color-orange)";
    dot.style.boxShadow = "0 0 8px var(--color-orange)";
  } else {
    dot.style.backgroundColor = "var(--color-green)";
    dot.style.boxShadow = "0 0 8px var(--color-green)";
  }
}

async function checkInitialRateLimit() {
  try {
    const data = await fetchFromGitHub("/rate_limit");
    if (data?.rate) {
      updateRateLimitUI(data.rate.remaining, data.rate.limit);
    }
  } catch (e) {
    console.warn("Could not check rate limit directly", e);
  }
}

// Error Banner Handlers
function showError(title, msg) {
  errorTitle.textContent = title;
  errorMessage.textContent = msg;
  errorBanner.classList.remove("hidden");
}

function hideError() {
  errorBanner.classList.add("hidden");
}

closeErrorBtn.addEventListener("click", hideError);

// Fetch Full User Profile + Repos + Activity
async function loadGitHubUser(username) {
  if (!username) return;
  username = username.trim().replace(/^@/, "");
  hideError();

  submitBtn.disabled = true;
  loginSpinner.classList.remove("hidden");
  submitBtn.querySelector(".btn-text").textContent = "Connecting...";

  try {
    // 1. Fetch User details
    const userData = await fetchFromGitHub(`/users/${username}`);
    
    // 2. Fetch Repositories (up to 100 public repos)
    const reposData = await fetchFromGitHub(`/users/${username}/repos?sort=updated&per_page=100`);

    // 3. Fetch Recent Events (public activity)
    let eventsData = [];
    try {
      eventsData = await fetchFromGitHub(`/users/${username}/events/public?per_page=20`);
    } catch (err) {
      console.warn("Could not fetch user events", err);
    }

    currentUsername = username;
    allRepos = reposData;
    allEvents = eventsData;

    // Render components
    renderUserProfile(userData);
    renderStats(userData, reposData);
    renderLanguageDistribution(reposData);
    populateLanguageFilter(reposData);
    renderReposGrid();
    renderActivityTimeline();

    // Update UI state
    profileSection.classList.remove("hidden");
    loginCard.classList.add("hidden"); // Collapse login card after successful fetch
    
    // Update URL query string
    const url = new URL(window.location);
    url.searchParams.set("u", username);
    window.history.replaceState({}, "", url);

    // Save in localStorage
    localStorage.setItem("gitwit_last_user", username);

  } catch (err) {
    showError(`Error loading @${username}`, err.message || "Failed to communicate with GitHub API.");
  } finally {
    submitBtn.disabled = false;
    loginSpinner.classList.add("hidden");
    submitBtn.querySelector(".btn-text").textContent = "Fetch Profile";
  }
}

// Render Profile Header Card
function renderUserProfile(user) {
  userAvatar.src = user.avatar_url;
  userName.textContent = user.name || user.login;
  userLogin.textContent = `@${user.login}`;
  
  if (user.hireable) {
    hireableBadge.classList.remove("hidden");
  } else {
    hireableBadge.classList.add("hidden");
  }

  userBio.textContent = user.bio || "No bio published on GitHub.";
  
  // Location
  if (user.location) {
    userLocation.querySelector(".chip-text").textContent = user.location;
    userLocation.classList.remove("hidden");
  } else {
    userLocation.classList.add("hidden");
  }

  // Company
  if (user.company) {
    userCompany.querySelector(".chip-text").textContent = user.company;
    userCompany.classList.remove("hidden");
  } else {
    userCompany.classList.add("hidden");
  }

  // Blog / Website
  if (user.blog) {
    let blogHref = user.blog;
    if (!blogHref.startsWith("http")) blogHref = `https://${blogHref}`;
    userBlog.href = blogHref;
    userBlog.querySelector(".chip-text").textContent = user.blog.replace(/^https?:\/\//, "");
    userBlog.classList.remove("hidden");
  } else {
    userBlog.classList.add("hidden");
  }

  // Joined Date
  if (user.created_at) {
    const joined = new Date(user.created_at);
    const monthYear = joined.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    userJoined.querySelector(".chip-text").textContent = `Joined ${monthYear}`;
  }

  // External GitHub Profile link
  ghProfileLink.href = user.html_url;
}

// Render 4 Stat Boxes
function renderStats(user, repos) {
  statRepos.textContent = (user.public_repos ?? repos.length).toLocaleString();
  statFollowers.textContent = (user.followers ?? 0).toLocaleString();
  statFollowing.textContent = (user.following ?? 0).toLocaleString();

  // Calculate real total stars across all fetched public repositories
  const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
  statStars.textContent = totalStars.toLocaleString();

  repoTabCount.textContent = repos.length;
}

// Render Dynamic Language Distribution Bar
function renderLanguageDistribution(repos) {
  languageBar.innerHTML = "";
  languageLegend.innerHTML = "";

  const langCounts = {};
  let totalWithLang = 0;

  repos.forEach(repo => {
    if (repo.language) {
      langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
      totalWithLang++;
    }
  });

  const sortedLangs = Object.entries(langCounts).sort((a, b) => b[1] - a[1]);
  langCountLabel.textContent = `${sortedLangs.length} language${sortedLangs.length === 1 ? "" : "s"} across ${totalWithLang} repos`;

  if (sortedLangs.length === 0) {
    languageBar.innerHTML = `<div class="lang-segment" style="width: 100%; background: #30363d;"></div>`;
    languageLegend.innerHTML = `<span class="text-secondary text-sm">No programming languages detected in public repositories.</span>`;
    return;
  }

  sortedLangs.slice(0, 6).forEach(([lang, count]) => {
    const pct = ((count / totalWithLang) * 100).toFixed(1);
    const color = getLanguageColor(lang);

    // Bar segment
    const segment = document.createElement("div");
    segment.className = "lang-segment";
    segment.style.width = `${pct}%`;
    segment.style.backgroundColor = color;
    segment.title = `${lang}: ${count} repos (${pct}%)`;
    languageBar.appendChild(segment);

    // Legend item
    const legendItem = document.createElement("div");
    legendItem.className = "legend-item";
    legendItem.innerHTML = `
      <span class="legend-dot" style="background-color: ${color};"></span>
      <span class="legend-name">${lang}</span>
      <span class="legend-pct">${pct}%</span>
    `;
    languageLegend.appendChild(legendItem);
  });
}

// Populate Language Filter Dropdown
function populateLanguageFilter(repos) {
  const currentVal = langFilterSelect.value;
  langFilterSelect.innerHTML = `<option value="ALL">All Languages</option>`;
  
  const langs = new Set();
  repos.forEach(r => {
    if (r.language) langs.add(r.language);
  });

  Array.from(langs).sort().forEach(lang => {
    const opt = document.createElement("option");
    opt.value = lang;
    opt.textContent = lang;
    langFilterSelect.appendChild(opt);
  });

  if (langs.has(currentVal)) {
    langFilterSelect.value = currentVal;
  }
}

// Filter and Sort Repositories
function getFilteredRepos() {
  const query = repoSearchInput.value.toLowerCase().trim();
  const selectedLang = langFilterSelect.value;
  const sortBy = sortSelect.value;

  let filtered = allRepos.filter(repo => {
    const matchesSearch = !query || 
      repo.name.toLowerCase().includes(query) || 
      (repo.description && repo.description.toLowerCase().includes(query));
    
    const matchesLang = selectedLang === "ALL" || repo.language === selectedLang;
    
    return matchesSearch && matchesLang;
  });

  // Sort
  if (sortBy === "stars") {
    filtered.sort((a, b) => b.stargazers_count - a.stargazers_count);
  } else if (sortBy === "forks") {
    filtered.sort((a, b) => b.forks_count - a.forks_count);
  } else if (sortBy === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // Recently updated (default)
    filtered.sort((a, b) => new Date(b.pushed_at || b.updated_at) - new Date(a.pushed_at || a.updated_at));
  }

  return filtered;
}

// Render Repositories Grid
function renderReposGrid() {
  const repos = getFilteredRepos();
  reposGrid.innerHTML = "";

  if (repos.length === 0) {
    noReposMatch.classList.remove("hidden");
    return;
  } else {
    noReposMatch.classList.add("hidden");
  }

  repos.forEach(repo => {
    const card = document.createElement("div");
    card.className = "repo-card";

    const lang = repo.language || null;
    const langColor = getLanguageColor(lang);
    const updatedTime = timeAgo(repo.pushed_at || repo.updated_at);
    const topics = repo.topics || [];

    card.innerHTML = `
      <div class="repo-card-top">
        <div class="repo-title-row">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name-link">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            ${repo.name}
          </a>
          <span class="badge-visibility">${repo.private ? "Private" : "Public"}</span>
        </div>
        <p class="repo-desc">${repo.description || "No description provided."}</p>
        
        ${topics.length > 0 ? `
          <div class="repo-topics">
            ${topics.slice(0, 4).map(t => `<span class="topic-pill">${t}</span>`).join("")}
          </div>
        ` : ""}
      </div>

      <div class="repo-card-bottom">
        <div class="repo-metrics">
          ${lang ? `
            <span class="metric-item">
              <span class="lang-dot" style="background-color: ${langColor};"></span>
              <span>${lang}</span>
            </span>
          ` : ""}
          <span class="metric-item" title="Stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" color="#d29922"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span>${repo.stargazers_count}</span>
          </span>
          <span class="metric-item" title="Forks">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>
            <span>${repo.forks_count}</span>
          </span>
        </div>
        <span class="repo-updated">Updated ${updatedTime}</span>
      </div>
    `;

    reposGrid.appendChild(card);
  });
}

// Render Real Live Activity Feed (Events)
function renderActivityTimeline() {
  activityTimeline.innerHTML = "";
  activityTabCount.textContent = allEvents.length;

  if (allEvents.length === 0) {
    activityTimeline.innerHTML = `
      <div class="empty-state">
        <p>No recent public events or commits found in the last 90 days.</p>
      </div>
    `;
    return;
  }

  allEvents.forEach(event => {
    const item = document.createElement("div");
    item.className = "activity-item";

    let iconSvg = "";
    let titleText = "";
    let extraDetails = "";

    const repoName = event.repo?.name || "repository";
    const repoUrl = `https://github.com/${repoName}`;
    const time = timeAgo(event.created_at);

    switch (event.type) {
      case "PushEvent":
        iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>`;
        const commits = event.payload?.commits || [];
        titleText = `Pushed <strong>${commits.length} commit${commits.length === 1 ? "" : "s"}</strong> to`;
        if (commits.length > 0) {
          extraDetails = `
            <div class="activity-commits-list">
              ${commits.slice(0, 3).map(c => `
                <div class="commit-row">
                  <span class="commit-sha">${c.sha.substring(0, 7)}</span>
                  <span class="commit-msg">${c.message}</span>
                </div>
              `).join("")}
            </div>
          `;
        }
        break;

      case "CreateEvent":
        iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
        titleText = `Created ${event.payload?.ref_type || "branch/repository"} in`;
        break;

      case "WatchEvent":
        iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" color="#d29922"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
        titleText = `Starred`;
        break;

      case "ForkEvent":
        iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>`;
        titleText = `Forked`;
        break;

      default:
        iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>`;
        titleText = `Activity on`;
    }

    item.innerHTML = `
      <div class="activity-icon-badge">${iconSvg}</div>
      <div class="activity-body">
        <div class="activity-header-line">
          <span class="activity-title">${titleText} <a href="${repoUrl}" target="_blank" rel="noopener noreferrer" class="activity-repo">${repoName}</a></span>
          <span class="activity-time">${time}</span>
        </div>
        ${extraDetails}
      </div>
    `;

    activityTimeline.appendChild(item);
  });
}

// Event Listeners
usernameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const pat = patInput.value.trim();
  if (pat) {
    userPAT = pat;
    localStorage.setItem("gitwit_pat", pat);
  }
  loadGitHubUser(usernameInput.value);
});

// Quick tags
document.querySelectorAll(".quick-tag").forEach(tag => {
  tag.addEventListener("click", () => {
    usernameInput.value = tag.getAttribute("data-user");
    loadGitHubUser(usernameInput.value);
  });
});

// Open login form / Switch user
openLoginBtn.addEventListener("click", () => {
  loginCard.classList.toggle("hidden");
  if (!loginCard.classList.contains("hidden")) {
    usernameInput.focus();
    usernameInput.select();
  }
});

// Tab switching
tabReposBtn.addEventListener("click", () => {
  tabReposBtn.classList.add("active");
  tabActivityBtn.classList.remove("active");
  tabReposContent.classList.add("active");
  tabActivityContent.classList.remove("active");
});

tabActivityBtn.addEventListener("click", () => {
  tabActivityBtn.classList.add("active");
  tabReposBtn.classList.remove("active");
  tabActivityContent.classList.add("active");
  tabReposContent.classList.remove("active");
});

// Filter & Search listeners
repoSearchInput.addEventListener("input", renderReposGrid);
langFilterSelect.addEventListener("change", renderReposGrid);
sortSelect.addEventListener("change", renderReposGrid);

// Initial Load Handler
window.addEventListener("DOMContentLoaded", () => {
  if (userPAT) {
    patInput.value = userPAT;
  }
  checkInitialRateLimit();

  // Check URL param first, then localStorage, then default to arnavryie
  const params = new URLSearchParams(window.location.search);
  const initialUser = params.get("u") || localStorage.getItem("gitwit_last_user") || "arnavryie";
  
  usernameInput.value = initialUser;
  loadGitHubUser(initialUser);
});

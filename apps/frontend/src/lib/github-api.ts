const GITHUB_API = "https://api.github.com"

class RateLimitError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "RateLimitError"
  }
}

async function githubFetch(url: string, token?: string, revalidate = 1800) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "project-ronin",
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  } else if (process.env.GITHUB_PAT) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_PAT}`
  }

  const res = await fetch(url, { headers, next: { revalidate } })

  // Detect rate limiting (primary 403 + secondary 429)
  if (res.status === 403 || res.status === 429) {
    const remaining = res.headers.get("x-ratelimit-remaining")
    const reset = res.headers.get("x-ratelimit-reset")
    if (remaining === "0" && reset) {
      const resetTime = new Date(Number(reset) * 1000).toISOString()
      console.warn(`[github] rate limit hit. Resets at ${resetTime}`)
    } else {
      console.warn(`[github] request blocked (${res.status})`)
    }
    throw new RateLimitError("GitHub rate limit exceeded")
  }

  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  return res.json()
}

export const FALLBACK_TRENDING_REPOS = [
  {
    id: "1",
    owner: "vercel",
    name: "next.js",
    fullName: "vercel/next.js",
    description: "The React Framework for the Web. Used by the world's leading web applications.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 128450,
    forks: 26800,
    forkVelocity: 245,
    topics: ["react", "nextjs", "typescript", "framework", "ssr"],
    updatedAt: "15 minutes ago",
    avatarUrl: "https://github.com/vercel.png",
    htmlUrl: "https://github.com/vercel/next.js",
    trending: true,
  },
  {
    id: "2",
    owner: "ollama",
    name: "ollama",
    fullName: "ollama/ollama",
    description: "Get up and running with Llama 3.3, Mistral, Qwen 2.5, and other large language models locally.",
    language: "Go",
    languageColor: "#00ADD8",
    stars: 114200,
    forks: 9400,
    forkVelocity: 310,
    topics: ["llm", "ai", "machine-learning", "local-ai", "go"],
    updatedAt: "32 minutes ago",
    avatarUrl: "https://github.com/ollama.png",
    htmlUrl: "https://github.com/ollama/ollama",
    trending: true,
  },
  {
    id: "3",
    owner: "astral-sh",
    name: "uv",
    fullName: "astral-sh/uv",
    description: "An extremely fast Python package and project manager, written in Rust.",
    language: "Rust",
    languageColor: "#dea584",
    stars: 48900,
    forks: 1650,
    forkVelocity: 215,
    topics: ["python", "rust", "pip", "performance", "package-manager"],
    updatedAt: "1 hour ago",
    avatarUrl: "https://github.com/astral-sh.png",
    htmlUrl: "https://github.com/astral-sh/uv",
    trending: true,
  },
  {
    id: "4",
    owner: "langchain-ai",
    name: "langchain",
    fullName: "langchain-ai/langchain",
    description: "Build context-aware reasoning applications. Flexible abstractions and AI tooling.",
    language: "Python",
    languageColor: "#3572A5",
    stars: 98500,
    forks: 15900,
    forkVelocity: 180,
    topics: ["ai", "agents", "llm", "python", "rag"],
    updatedAt: "2 hours ago",
    avatarUrl: "https://github.com/langchain-ai.png",
    htmlUrl: "https://github.com/langchain-ai/langchain",
    trending: true,
  },
  {
    id: "5",
    owner: "shadcn-ui",
    name: "ui",
    fullName: "shadcn-ui/ui",
    description: "A set of beautifully-designed, accessible, and customizable components that you can copy and paste into your apps.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 76800,
    forks: 6400,
    forkVelocity: 195,
    topics: ["react", "tailwind", "radix-ui", "components", "design-system"],
    updatedAt: "3 hours ago",
    avatarUrl: "https://github.com/shadcn-ui.png",
    htmlUrl: "https://github.com/shadcn-ui/ui",
    trending: true,
  },
  {
    id: "6",
    owner: "supabase",
    name: "supabase",
    fullName: "supabase/supabase",
    description: "The open source Firebase alternative. Build production-grade backends with Postgres.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 77200,
    forks: 6200,
    forkVelocity: 140,
    topics: ["postgres", "database", "auth", "realtime", "storage"],
    updatedAt: "4 hours ago",
    avatarUrl: "https://github.com/supabase.png",
    htmlUrl: "https://github.com/supabase/supabase",
    trending: true,
  },
  {
    id: "7",
    owner: "tiangolo",
    name: "fastapi",
    fullName: "tiangolo/fastapi",
    description: "FastAPI framework, high performance, easy to learn, fast to code, ready for production.",
    language: "Python",
    languageColor: "#3572A5",
    stars: 82100,
    forks: 6900,
    forkVelocity: 120,
    topics: ["fastapi", "python", "async", "api", "rest"],
    updatedAt: "5 hours ago",
    avatarUrl: "https://github.com/tiangolo.png",
    htmlUrl: "https://github.com/tiangolo/fastapi",
    trending: true,
  }
]

export async function getTrendingRepos(language?: string, period: "daily" | "weekly" | "monthly" = "weekly") {
  const date = new Date()
  const daysBack = period === "daily" ? 1 : period === "weekly" ? 7 : 30
  date.setDate(date.getDate() - daysBack)
  const dateStr = date.toISOString().split("T")[0]

  let query = `created:>${dateStr} stars:>10`
  if (language) query += ` language:${language}`

  const url = `${GITHUB_API}/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=20`
  
  try {
    const data = await githubFetch(url)
    if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
      return data.items.map((repo: any) => ({
        id: repo.id.toString(),
        owner: repo.owner.login,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || "",
        language: repo.language || "Unknown",
        languageColor: getLanguageColor(repo.language),
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        forkVelocity: Math.floor(repo.forks_count / Math.max(1, daysBack)),
        topics: repo.topics || [],
        updatedAt: timeAgo(repo.pushed_at),
        avatarUrl: repo.owner.avatar_url,
        htmlUrl: repo.html_url,
        trending: true,
      }))
    }
  } catch (err) {
    console.warn(`[github-api] Using fallback trending dataset: ${err}`)
  }

  // Filter fallback by language if requested
  if (language && language !== "All") {
    const matched = FALLBACK_TRENDING_REPOS.filter(
      r => r.language.toLowerCase() === language.toLowerCase()
    )
    if (matched.length > 0) return matched
  }
  return FALLBACK_TRENDING_REPOS
}


export async function getReposByTopic(topic: string, page = 1) {
  const url = `${GITHUB_API}/search/repositories?q=topic:${topic}&sort=stars&order=desc&per_page=20&page=${page}`
  const data = await githubFetch(url, undefined, 1800)
  return data.items.map((repo: any) => ({
    id: repo.id.toString(),
    owner: repo.owner.login,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || "",
    language: repo.language || "Unknown",
    languageColor: getLanguageColor(repo.language),
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    forkVelocity: 0,
    topics: repo.topics || [],
    updatedAt: timeAgo(repo.updated_at),
    avatarUrl: repo.owner.avatar_url,
    htmlUrl: repo.html_url,
    trending: false,
  }))
}

export async function getGitHubUser(username: string, token?: string) {
  const data = await githubFetch(`${GITHUB_API}/users/${username}`, token, 900)
  return {
    username: data.login,
    displayName: data.name || data.login,
    avatar: data.avatar_url,
    bio: data.bio || "",
    location: data.location || "",
    website: data.blog || "",
    followers: data.followers,
    following: data.following,
    publicRepos: data.public_repos,
    twitterUsername: data.twitter_username || "",
    createdAt: data.created_at,
  }
}

export async function getUserRepos(username: string, token?: string) {
  const data = await githubFetch(
    `${GITHUB_API}/users/${username}/repos?sort=stars&per_page=6`,
    token
  )
  return data.map((repo: any) => ({
    id: repo.id.toString(),
    name: repo.name,
    owner: repo.owner.login,
    fullName: repo.full_name,
    description: repo.description || "",
    language: repo.language || "Unknown",
    languageColor: getLanguageColor(repo.language),
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    forkVelocity: 0,
    topics: repo.topics || [],
    isPrivate: repo.private,
    htmlUrl: repo.html_url,
    updatedAt: timeAgo(repo.pushed_at),
    avatarUrl: repo.owner.avatar_url,
    trending: false,
  }))
}

export async function getRepoDetail(owner: string, name: string, token?: string) {
  const [repo, issues] = await Promise.all([
    githubFetch(`${GITHUB_API}/repos/${owner}/${name}`, token),
    githubFetch(`${GITHUB_API}/repos/${owner}/${name}/issues?state=open&per_page=10`, token),
  ])
  return {
    id: repo.id.toString(),
    owner: repo.owner.login,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || "",
    language: repo.language || "Unknown",
    languageColor: getLanguageColor(repo.language),
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    forkVelocity: 0,
    watchers: repo.watchers_count,
    openIssues: repo.open_issues_count,
    topics: repo.topics || [],
    license: repo.license?.spdx_id || null,
    htmlUrl: repo.html_url,
    updatedAt: timeAgo(repo.pushed_at),
    avatarUrl: repo.owner.avatar_url,
    trending: false,
    issues: issues
      .filter((issue: any) => !issue.pull_request)
      .map((issue: any) => ({
        id: issue.number,
        title: issue.title,
        labels: issue.labels.map((l: any) => l.name),
        comments: issue.comments,
        openedBy: issue.user.login,
        openedAt: timeAgo(issue.created_at),
        htmlUrl: issue.html_url,
        impactScore: 50,
        impactLevel: 'Med',
        skillMatch: 0,
      })),
  }
}

export async function searchRepos(query: string) {
  const url = `${GITHUB_API}/search/repositories?q=${encodeURIComponent(query)}&sort=stars&per_page=10`
  const data = await githubFetch(url)
  return data.items.map((repo: any) => ({
    id: repo.id.toString(),
    owner: repo.owner.login,
    name: repo.name,
    description: repo.description || "",
    stars: repo.stargazers_count,
    language: repo.language || "Unknown",
    avatarUrl: repo.owner.avatar_url,
  }))
}

export function timeAgo(dateStr: string): string {
  if (!dateStr) return "recently"
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays < 30) return `${diffDays} days ago`
  return date.toLocaleDateString()
}

export function getLanguageColor(lang: string): string {
  const colors: Record<string, string> = {
    Python: "#3572A5", TypeScript: "#3178c6", JavaScript: "#f1e05a",
    Rust: "#dea584", Go: "#00ADD8", Java: "#b07219", "C++": "#f34b7d",
    Ruby: "#701516", Swift: "#fa7343", Kotlin: "#A97BFF", Shell: "#89e051",
    CSS: "#563d7c", HTML: "#e34c26", Vue: "#41b883", Dart: "#00B4AB",
    "C#": "#178600", PHP: "#4F5D95", Scala: "#c22d40", Elixir: "#6e4a7e",
  }
  return colors[lang] || "#8b949e"
}

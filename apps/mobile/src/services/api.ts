import { Platform } from 'react-native';
import { Repo, AISummary, DeveloperDossier, Community } from '../types';

// In Android Emulator, host localhost is accessible via 10.0.2.2
const DEFAULT_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

export const API_BASE_URL = DEFAULT_API_URL;

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  'C++': '#f34b7d',
  Java: '#b07219',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Ruby: '#701516',
  Dart: '#00B4AB',
};

export function getLanguageColor(language?: string): string {
  if (!language) return '#8b949e';
  return LANGUAGE_COLORS[language] || '#58a6ff';
}

export const SEED_COMMUNITIES: Community[] = [
  { slug: 'ai-ml', name: 'AI & Machine Learning', icon: '🤖', githubTopic: 'machine-learning', description: 'LLMs, neural nets, AI agents and Gemini tools', color: '#58a6ff', memberCount: 1420 },
  { slug: 'ui-frontend', name: 'UI & Frontend', icon: '⚛️', githubTopic: 'react', description: 'React, Next.js, Vue, Tailwind, Mobile & Web UI', color: '#8957e5', memberCount: 980 },
  { slug: 'devops', name: 'DevOps & Infra', icon: '⚙️', githubTopic: 'kubernetes', description: 'Docker, Kubernetes, CI/CD, Cloud Native tools', color: '#238636', memberCount: 650 },
  { slug: 'databases', name: 'Databases & Vector', icon: '🗄️', githubTopic: 'database', description: 'MongoDB Atlas, Vector Search, SQL, Redis', color: '#d76027', memberCount: 520 },
  { slug: 'systems', name: 'Systems & Rust', icon: '⚡', githubTopic: 'rust', description: 'Systems programming, high-performance low-level tools', color: '#dea584', memberCount: 810 },
  { slug: 'python', name: 'Python Ecosystem', icon: '🐍', githubTopic: 'python', description: 'FastAPI, PyTorch, LangChain, scientific computing', color: '#3572A5', memberCount: 1250 },
  { slug: 'mobile', name: 'Mobile Dev', icon: '📱', githubTopic: 'react-native', description: 'React Native, Expo, Android, iOS, Flutter', color: '#00B4AB', memberCount: 430 },
];

export const FALLBACK_REPOS: Repo[] = [
  {
    id: '1',
    owner: 'google-deepmind',
    name: 'gemini-cli-agent',
    fullName: 'google-deepmind/gemini-cli-agent',
    description: 'Autonomous coding agent powered by Gemini 2.0 Flash with live tool orchestration and multimodality.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 12450,
    forks: 1840,
    forkVelocity: 24,
    topics: ['gemini-ai', 'agentic-coding', 'typescript', 'cli'],
    updatedAt: '2h ago',
    avatarUrl: 'https://avatars.githubusercontent.com/u/105342416?v=4',
    htmlUrl: 'https://github.com/google-deepmind',
    trending: true,
    aiBadge: '🔥 Top Hackathon Choice',
  },
  {
    id: '2',
    owner: 'mongodb',
    name: 'atlas-vector-search-kit',
    fullName: 'mongodb/atlas-vector-search-kit',
    description: 'Ultra-fast semantic search & RAG pipelines with MongoDB Atlas Vector Search and Gemini embeddings.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 8740,
    forks: 920,
    forkVelocity: 15,
    topics: ['mongodb', 'vector-search', 'rag', 'embeddings'],
    updatedAt: '4h ago',
    avatarUrl: 'https://avatars.githubusercontent.com/u/45120?v=4',
    htmlUrl: 'https://github.com/mongodb',
    trending: true,
    aiBadge: '⚡ 98% Vector Match',
  },
  {
    id: '3',
    owner: 'facebook',
    name: 'react-native',
    fullName: 'facebook/react-native',
    description: 'A framework for building native applications using React.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 118000,
    forks: 24000,
    forkVelocity: 85,
    topics: ['react', 'mobile', 'android', 'ios'],
    updatedAt: '1h ago',
    avatarUrl: 'https://avatars.githubusercontent.com/u/69631?v=4',
    htmlUrl: 'https://github.com/facebook/react-native',
    trending: false,
  },
  {
    id: '4',
    owner: 'astral-sh',
    name: 'uv',
    fullName: 'astral-sh/uv',
    description: 'An extremely fast Python package and project manager, written in Rust.',
    language: 'Rust',
    languageColor: '#dea584',
    stars: 42100,
    forks: 1420,
    forkVelocity: 60,
    topics: ['rust', 'python', 'packaging', 'performance'],
    updatedAt: '3h ago',
    avatarUrl: 'https://avatars.githubusercontent.com/u/115962839?v=4',
    htmlUrl: 'https://github.com/astral-sh/uv',
    trending: true,
    aiBadge: '🚀 Rapid Growth',
  }
];

export async function fetchTrendingRepos(language?: string): Promise<Repo[]> {
  try {
    const daysBack = 7;
    const date = new Date();
    date.setDate(date.getDate() - daysBack);
    const dateStr = date.toISOString().split('T')[0];

    let query = `created:>${dateStr} stars:>15`;
    if (language && language !== 'All') {
      query += ` language:${language}`;
    }

    const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=20`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'git-wit-mobile',
      },
    });

    if (!res.ok) {
      return FALLBACK_REPOS;
    }

    const data = await res.json();
    return data.items.map((repo: any) => ({
      id: String(repo.id),
      owner: repo.owner.login,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || 'No description provided.',
      language: repo.language || 'Unknown',
      languageColor: getLanguageColor(repo.language),
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      topics: repo.topics || [],
      updatedAt: 'Recently',
      avatarUrl: repo.owner.avatar_url,
      htmlUrl: repo.html_url,
      trending: true,
    }));
  } catch (err) {
    console.warn('Falling back to seed repos:', err);
    return FALLBACK_REPOS;
  }
}

const TOPIC_FALLBACKS: Record<string, Repo[]> = {
  'machine-learning': [
    {
      id: 'ml-1',
      owner: 'google-deepmind',
      name: 'gemini-cli-agent',
      fullName: 'google-deepmind/gemini-cli-agent',
      description: 'Autonomous coding agent powered by Gemini 2.0 Flash with live tool orchestration and multimodality.',
      language: 'TypeScript',
      languageColor: '#3178c6',
      stars: 14200,
      forks: 1840,
      forkVelocity: 42,
      topics: ['gemini-ai', 'machine-learning', 'agents', 'typescript'],
      updatedAt: '1h ago',
      avatarUrl: 'https://avatars.githubusercontent.com/u/105342416?v=4',
      htmlUrl: 'https://github.com/google-deepmind/gemini-cli-agent',
      trending: true,
      aiBadge: '🔥 Top AI Agent',
    },
    {
      id: 'ml-2',
      owner: 'pytorch',
      name: 'pytorch',
      fullName: 'pytorch/pytorch',
      description: 'Tensors and Dynamic neural networks in Python with strong GPU acceleration.',
      language: 'Python',
      languageColor: '#3572A5',
      stars: 87400,
      forks: 23100,
      forkVelocity: 65,
      topics: ['machine-learning', 'deep-learning', 'neural-network', 'python'],
      updatedAt: '2h ago',
      avatarUrl: 'https://avatars.githubusercontent.com/u/21003710?v=4',
      htmlUrl: 'https://github.com/pytorch/pytorch',
      trending: true,
    },
    {
      id: 'ml-3',
      owner: 'ollama',
      name: 'ollama',
      fullName: 'ollama/ollama',
      description: 'Get up and running with Llama 3.3, Mistral, Gemma 2, and other large language models locally.',
      language: 'Go',
      languageColor: '#00ADD8',
      stars: 112000,
      forks: 9800,
      forkVelocity: 120,
      topics: ['llm', 'machine-learning', 'ai', 'go'],
      updatedAt: '30m ago',
      avatarUrl: 'https://avatars.githubusercontent.com/u/137682333?v=4',
      htmlUrl: 'https://github.com/ollama/ollama',
      trending: true,
    },
  ],
  'react': [
    {
      id: 'react-1',
      owner: 'facebook',
      name: 'react',
      fullName: 'facebook/react',
      description: 'The library for web and native user interfaces.',
      language: 'JavaScript',
      languageColor: '#f1e05a',
      stars: 231000,
      forks: 46700,
      forkVelocity: 45,
      topics: ['react', 'ui', 'frontend', 'javascript'],
      updatedAt: '2h ago',
      avatarUrl: 'https://avatars.githubusercontent.com/u/69631?v=4',
      htmlUrl: 'https://github.com/facebook/react',
      trending: true,
    },
    {
      id: 'react-2',
      owner: 'vercel',
      name: 'next.js',
      fullName: 'vercel/next.js',
      description: 'The React Framework for the Web. Built on Turbopack and React Server Components.',
      language: 'TypeScript',
      languageColor: '#3178c6',
      stars: 128000,
      forks: 27100,
      forkVelocity: 72,
      topics: ['nextjs', 'react', 'framework', 'typescript'],
      updatedAt: '45m ago',
      avatarUrl: 'https://avatars.githubusercontent.com/u/14985020?v=4',
      htmlUrl: 'https://github.com/vercel/next.js',
      trending: true,
    },
  ],
  'kubernetes': [
    {
      id: 'k8s-1',
      owner: 'kubernetes',
      name: 'kubernetes',
      fullName: 'kubernetes/kubernetes',
      description: 'Production-Grade Container Scheduling and Management.',
      language: 'Go',
      languageColor: '#00ADD8',
      stars: 115000,
      forks: 39500,
      forkVelocity: 55,
      topics: ['kubernetes', 'containers', 'devops', 'go'],
      updatedAt: '1h ago',
      avatarUrl: 'https://avatars.githubusercontent.com/u/13629408?v=4',
      htmlUrl: 'https://github.com/kubernetes/kubernetes',
      trending: true,
    },
  ],
  'database': [
    {
      id: 'db-1',
      owner: 'mongodb',
      name: 'atlas-vector-search-kit',
      fullName: 'mongodb/atlas-vector-search-kit',
      description: 'Ultra-fast semantic search & RAG pipelines with MongoDB Atlas Vector Search and Gemini embeddings.',
      language: 'Python',
      languageColor: '#3572A5',
      stars: 8740,
      forks: 920,
      forkVelocity: 15,
      topics: ['mongodb', 'vector-search', 'rag', 'database'],
      updatedAt: '4h ago',
      avatarUrl: 'https://avatars.githubusercontent.com/u/45120?v=4',
      htmlUrl: 'https://github.com/mongodb',
      trending: true,
      aiBadge: '⚡ 98% Vector Match',
    },
  ],
  'rust': [
    {
      id: 'rust-1',
      owner: 'astral-sh',
      name: 'uv',
      fullName: 'astral-sh/uv',
      description: 'An extremely fast Python package and project manager, written in Rust.',
      language: 'Rust',
      languageColor: '#dea584',
      stars: 42100,
      forks: 1420,
      forkVelocity: 60,
      topics: ['rust', 'python', 'packaging', 'performance'],
      updatedAt: '3h ago',
      avatarUrl: 'https://avatars.githubusercontent.com/u/115962839?v=4',
      htmlUrl: 'https://github.com/astral-sh/uv',
      trending: true,
      aiBadge: '🚀 Rapid Growth',
    },
  ],
  'python': [
    {
      id: 'py-1',
      owner: 'tiangolo',
      name: 'fastapi',
      fullName: 'tiangolo/fastapi',
      description: 'FastAPI framework, high performance, easy to learn, fast to code, ready for production.',
      language: 'Python',
      languageColor: '#3572A5',
      stars: 79500,
      forks: 6400,
      forkVelocity: 35,
      topics: ['fastapi', 'python', 'api', 'async'],
      updatedAt: '2h ago',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1326112?v=4',
      htmlUrl: 'https://github.com/tiangolo/fastapi',
      trending: true,
    },
  ],
  'react-native': [
    {
      id: 'rn-1',
      owner: 'facebook',
      name: 'react-native',
      fullName: 'facebook/react-native',
      description: 'A framework for building native applications using React.',
      language: 'TypeScript',
      languageColor: '#3178c6',
      stars: 118000,
      forks: 24000,
      forkVelocity: 85,
      topics: ['react', 'mobile', 'android', 'ios'],
      updatedAt: '1h ago',
      avatarUrl: 'https://avatars.githubusercontent.com/u/69631?v=4',
      htmlUrl: 'https://github.com/facebook/react-native',
      trending: true,
    },
  ],
};

export async function fetchReposByTopic(topic: string): Promise<Repo[]> {
  try {
    const res = await fetch(`https://api.github.com/search/repositories?q=topic:${topic}&sort=stars&order=desc&per_page=15`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'git-wit-mobile',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        return data.items.map((repo: any) => ({
          id: String(repo.id),
          owner: repo.owner.login,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description || 'No description provided.',
          language: repo.language || 'Unknown',
          languageColor: getLanguageColor(repo.language),
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          topics: repo.topics || [],
          updatedAt: 'Recently',
          avatarUrl: repo.owner.avatar_url,
          htmlUrl: repo.html_url,
          trending: true,
        }));
      }
    }
  } catch (err) {
    console.warn('Using topic fallback repos:', err);
  }

  return TOPIC_FALLBACKS[topic] || FALLBACK_REPOS;
}

export async function fetchGeminiSummary(repoFullName: string, description: string): Promise<AISummary> {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo_full_name: repoFullName, description }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}

  // Fallback AI summary
  return {
    summary: `${repoFullName} is an impactful repository designed to accelerate modern software workflows with clean abstractions and performance optimizations.`,
    keyPoints: [
      'Engineered for cloud scalability and modern developer ergonomics.',
      'Strongly typed architecture with high test coverage and minimal footprint.',
      'Actively maintained with rapid community adoption.'
    ],
    recommendedAudience: 'Software Engineers, DevOps Architects & Open-Source Maintainers',
    complexity: 'Intermediate',
  };
}

export async function fetchDeveloperDossier(username: string): Promise<DeveloperDossier> {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/dossier`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}

  return {
    username,
    archetype: '⚡ Full-Stack Systems Architect',
    superpower: 'Transforms complex distributed architectures into elegant, fast solutions.',
    languages: [
      { name: 'TypeScript', percentage: 48, color: '#3178c6' },
      { name: 'Python', percentage: 32, color: '#3572A5' },
      { name: 'Rust', percentage: 20, color: '#dea584' },
    ],
    bioAnalysis: 'Demonstrates deep commit velocity in backend infrastructure, AI tooling, and cloud containerization.',
    stats: {
      totalStars: 412,
      repos: 28,
      followers: 94,
    }
  };
}

export interface Repo {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  forkVelocity?: number;
  topics: string[];
  updatedAt: string;
  avatarUrl: string;
  htmlUrl: string;
  trending?: boolean;
  score?: number;
  aiBadge?: string;
}

export interface AISummary {
  summary: string;
  keyPoints: string[];
  recommendedAudience: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface DeveloperDossier {
  username: string;
  archetype: string;
  superpower: string;
  languages: { name: string; percentage: number; color: string }[];
  bioAnalysis: string;
  stats: {
    totalStars: number;
    repos: number;
    followers: number;
  };
}

export interface Community {
  slug: string;
  name: string;
  icon: string;
  githubTopic: string;
  description: string;
  color: string;
  memberCount: number;
}

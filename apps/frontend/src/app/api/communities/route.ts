import { NextResponse } from "next/server";

export const SEED_COMMUNITIES = [
  {"slug": "ai-ml", "name": "AI & Machine Learning", "icon": "🤖", "github_topic": "machine-learning", "description": "LLMs, neural networks, AI tools and frameworks", "color": "#58a6ff", "member_count": 1420},
  {"slug": "ui-frontend", "name": "UI & Frontend", "icon": "⚛️", "github_topic": "react", "description": "React, Vue, Svelte, CSS frameworks, design systems", "color": "#8957e5", "member_count": 2890},
  {"slug": "devops", "name": "DevOps & Infrastructure", "icon": "⚙️", "github_topic": "kubernetes", "description": "Docker, Kubernetes, CI/CD, cloud-native tools", "color": "#238636", "member_count": 940},
  {"slug": "databases", "name": "Databases", "icon": "🗄️", "github_topic": "database", "description": "SQL, NoSQL, vector databases, ORMs", "color": "#d76027", "member_count": 760},
  {"slug": "systems", "name": "Systems & Rust", "icon": "⚡", "github_topic": "rust", "description": "Systems programming, performance engineering", "color": "#dea584", "member_count": 1820},
  {"slug": "python", "name": "Python", "icon": "🐍", "github_topic": "python", "description": "Python libraries, frameworks, and tools", "color": "#3572A5", "member_count": 3150},
  {"slug": "web3", "name": "Web3 & Blockchain", "icon": "⛓️", "github_topic": "blockchain", "description": "DeFi, smart contracts, crypto protocols", "color": "#f1e05a", "member_count": 640},
  {"slug": "mobile", "name": "Mobile Dev", "icon": "📱", "github_topic": "flutter", "description": "iOS, Android, Flutter, React Native", "color": "#00B4AB", "member_count": 1120}
];

export async function GET() {
  return NextResponse.json(SEED_COMMUNITIES);
}

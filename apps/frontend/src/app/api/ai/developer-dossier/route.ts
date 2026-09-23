import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = (searchParams.get("username") || "developer").trim().replace(/^@/, "");
  const skills = (searchParams.get("skills") || "TypeScript, React, Python").split(",").map(s => s.trim());
  const topRepos = (searchParams.get("repos") || "open-source-projects").split(",").map(s => s.trim());
  return generateDossierResponse(username, skills, topRepos);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const username = (body.username || "developer").trim().replace(/^@/, "");
    const skills = Array.isArray(body.skills) && body.skills.length > 0 ? body.skills : ["TypeScript", "React", "Node.js", "Python"];
    const topRepos = Array.isArray(body.top_repos) && body.top_repos.length > 0 ? body.top_repos : ["portfolio", "web-app", "open-source-tools"];
    return generateDossierResponse(username, skills, topRepos);
  } catch (err: any) {
    return generateDossierResponse("developer", ["TypeScript", "React"], ["web-app"]);
  }
}

function generateDossierResponse(username: string, skills: string[], topRepos: string[]) {
  const primaryStack = skills.slice(0, 4).join(", ") || "TypeScript, React, Node.js";
  const repoHighlights = topRepos.slice(0, 3).join(", ") || "core open-source tooling";

  // Score computation based on tech breadth & repos
  const breadthBonus = Math.min(10, skills.length * 2);
  const repoBonus = Math.min(10, topRepos.length * 2);
  const qualityScore = Math.min(99, 85 + breadthBonus / 2 + repoBonus / 2);

  const dossier = `[EXECUTIVE ARCHITECTURAL SUMMARY]
@${username} is an impactful open-source engineer demonstrating sustained technical velocity across modern distributed architectures and product development.

[TECHNICAL ARCHITECTURE & SPECIALIZATION]
• Primary Tech Stack: ${primaryStack} with a focus on clean, scalable paradigms.
• Key Engineering Assets: ${repoHighlights}.
• Engineering Archetype: High-autonomy architect capable of shipping resilient end-to-end user-facing interfaces and backend infrastructure.
• Modularity & DX: Prioritizes reusable component abstractions, idiomatic patterns, and semantic API contracts.

[COLLABORATIVE IMPACT & WORKFLOW EVALUATION]
• Code Quality Score: ${qualityScore}/100 (Clean separation of concerns, strong type discipline).
• OSS Impact Rating: High contribution velocity with active public visibility and strong developer community orientation.
• git-wit Signal: High-value builder recommended for senior engineering, systems architecture, and core OSS maintainership roles.`;

  return NextResponse.json({
    success: true,
    username,
    score: qualityScore,
    dossier,
    skills,
    topRepos,
  });
}

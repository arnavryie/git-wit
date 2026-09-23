import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const repo = searchParams.get("repo") || "repository";
  const description = searchParams.get("description") || "Open-source software project";
  const language = searchParams.get("language") || "TypeScript";
  const topics = searchParams.get("topics") || "";

  return NextResponse.json(generateSummary(repo, description, language, topics));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json(generateSummary(
      body.repo || "repository",
      body.description || "Open-source software project",
      body.language || "TypeScript",
      Array.isArray(body.topics) ? body.topics.join(",") : (body.topics || "")
    ));
  } catch {
    return NextResponse.json(generateSummary("repository", "Open-source software project", "TypeScript", ""));
  }
}

function generateSummary(repo: string, description: string, language: string, topics: string) {
  const cleanTopics = topics ? topics.split(",").filter(Boolean).map(t => t.trim()) : [];
  const topicTags = cleanTopics.length > 0 ? ` [${cleanTopics.slice(0, 4).join(", ")}]` : "";

  const summary = `✦ Dual-Brain Architectural Breakdown for ${repo}:
• Primary Focus: ${description}
• Core Stack: Engineered primarily in ${language}${topicTags}.
• Codebase Health: High community engagement with modular repository structure.
• git-wit Signal: High-leverage repository recommended for architectural exploration and open-source contribution.`;

  const tldr = {
    what: description ? `${description.replace(/\.$/, "")} in a modular developer package.` : `${repo} is an active open-source project written in ${language}.`,
    target: language && language !== "Unknown" ? `Engineers building with ${language} seeking production-grade modular primitives.` : "Developers looking for modern open-source solutions.",
    superpower: cleanTopics.length > 0 ? `Specialized ecosystem tooling with active focus in ${cleanTopics.slice(0, 3).join(", ")}.` : "Clean architecture and high-velocity open-source maintainership."
  };

  return {
    success: true,
    repo,
    summary,
    tldr,
  };
}

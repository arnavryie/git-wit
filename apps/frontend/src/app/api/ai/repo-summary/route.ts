import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const repo = searchParams.get("repo") || "repository";
  const description = searchParams.get("description") || "Open-source software project";
  const language = searchParams.get("language") || "TypeScript";
  const topics = searchParams.get("topics") || "";

  const summary = `✦ Dual-Brain Architectural Breakdown for ${repo}:
• Primary Focus: ${description}
• Core Stack: Engineered primarily in ${language} ${topics ? `with active tags in [${topics}]` : ""}.
• Codebase Health: High community engagement with modular repository structure.
• Ronin Signal: Strong candidate for architectural exploration and open-source contribution.`;

  return NextResponse.json({ summary });
}

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("issue") || searchParams.get("issue_title") || "Bug fix or feature request";
  const repo = searchParams.get("repo") || "repository";
  return NextResponse.json(scoreIssue(repo, title));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const title = body.issue || body.issue_title || body.title || "Bug fix or feature request";
    const repo = body.repo || "repository";
    return NextResponse.json(scoreIssue(repo, title));
  } catch {
    return NextResponse.json(scoreIssue("repository", "Bug fix or feature request"));
  }
}

function scoreIssue(repo: string, title: string) {
  let score = 75;
  const lower = title.toLowerCase();
  if (lower.includes("security") || lower.includes("vulnerability") || lower.includes("crash") || lower.includes("memory leak")) {
    score = 96;
  } else if (lower.includes("perf") || lower.includes("speed") || lower.includes("architect") || lower.includes("refactor")) {
    score = 88;
  } else if (lower.includes("feature") || lower.includes("support") || lower.includes("add")) {
    score = 82;
  } else if (lower.includes("doc") || lower.includes("typo") || lower.includes("readme")) {
    score = 45;
  } else {
    score = 70 + (title.length % 20);
  }

  const level = score >= 85 ? "High" : score >= 60 ? "Med" : "Low";
  const reason = score >= 85
    ? "Critical architectural impact affecting reliability and developer DX."
    : score >= 60
    ? "Meaningful feature enhancement or functional stability improvement."
    : "Documentation, cleanup, or low-risk cosmetic improvement.";

  return {
    repo,
    title,
    score,
    level,
    reason,
  };
}

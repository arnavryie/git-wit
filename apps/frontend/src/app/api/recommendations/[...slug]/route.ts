import { NextResponse } from "next/server";
import { FALLBACK_TRENDING_REPOS } from "@/lib/github-api";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const username = slug[0] || "guest";

  const repos = FALLBACK_TRENDING_REPOS.slice(0, 3).map((r, i) => ({
    ...r,
    full_name: `${r.owner}/${r.name}`,
    score: 0.94 - i * 0.05,
  }));

  return NextResponse.json({
    user: username,
    repos,
  });
}

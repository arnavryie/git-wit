import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const username = slug[0] || "guest";
  // Return default starter following list if none
  return NextResponse.json({
    follower: username,
    following: ["torvalds", "shadcn", "gaearon"]
  });
}

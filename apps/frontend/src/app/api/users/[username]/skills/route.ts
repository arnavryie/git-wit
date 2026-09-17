import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  return NextResponse.json({
    username,
    skills: ["TypeScript", "Python", "React", "Next.js", "Rust", "Go"],
  });
}

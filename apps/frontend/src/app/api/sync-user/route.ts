import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const username = body.username || "arnavryie";
    return NextResponse.json({
      success: true,
      username,
      skills: ["TypeScript", "Next.js", "Python", "React", "Rust", "Tailwind CSS"],
    });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

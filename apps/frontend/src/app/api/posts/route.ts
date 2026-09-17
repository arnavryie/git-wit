import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    posts: [
      {
        id: "post-1",
        user_id: "u1",
        username: "@shadcn",
        content: "Just experimented with new animation primitives for UI design systems. The speed and feel of Next.js 15 is incredible.",
        repo_full_name: "shadcn-ui/ui",
        created_at: new Date(Date.now() - 3600000).toISOString(),
        avatar_url: "https://github.com/shadcn.png",
        likes: 42,
      },
      {
        id: "post-2",
        user_id: "u2",
        username: "@torvalds",
        content: "Working on low-level Git plumbing optimizations for huge trees. Clean code always beats clever tricks.",
        repo_full_name: "git/git",
        created_at: new Date(Date.now() - 7200000).toISOString(),
        avatar_url: "https://github.com/torvalds.png",
        likes: 128,
      },
      {
        id: "post-3",
        user_id: "u3",
        username: "@gaearon",
        content: "The next era of front-end is all about seamless server-client blurring. What stacks are you building with this year?",
        repo_full_name: "facebook/react",
        created_at: new Date(Date.now() - 14400000).toISOString(),
        avatar_url: "https://github.com/gaearon.png",
        likes: 95,
      }
    ],
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newPost = {
      id: "post-" + Date.now(),
      user_id: body.user_id || "guest",
      username: body.username?.startsWith("@") ? body.username : `@${body.username || "guest"}`,
      content: body.content || "",
      repo_full_name: body.repo_full_name || null,
      created_at: new Date().toISOString(),
      avatar_url: body.avatar || `https://github.com/${(body.username || "arnavryie").replace(/^@/, "")}.png`,
      likes: 1,
    };
    return NextResponse.json({ success: true, post: newPost });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }
}

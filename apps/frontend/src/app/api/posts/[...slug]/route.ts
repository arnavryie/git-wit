import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const postId = slug[0];
  const action = slug[1] || "like";

  return NextResponse.json({
    success: true,
    postId,
    action,
    message: action === "like" ? "Post liked" : "Post unliked",
  });
}

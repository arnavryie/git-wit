import { NextResponse } from "next/server";

// Shared in-memory store for serverless instance lifetime
const inMemoryBookmarks = new Map<string, any[]>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = body.user_id || "anonymous";
    const current = inMemoryBookmarks.get(userId) || [];
    const exists = current.some((b: any) => b.repo_full_name === body.repo_full_name);
    if (!exists) {
      current.unshift(body);
      inMemoryBookmarks.set(userId, current);
    }
    return NextResponse.json({ success: true, count: current.length });
  } catch (err: any) {
    return NextResponse.json({ success: true });
  }
}

import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const userId = slug[0] || "anonymous";
  // Return empty array if not found - client combines with localStorage
  return NextResponse.json([]);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  return NextResponse.json({ success: true });
}

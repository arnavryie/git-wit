import { NextResponse } from "next/server";

interface UserTldrPayload {
  username?: string;
  name?: string;
  bio?: string;
  skills?: string[];
  public_repos?: number;
  followers?: number;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = (searchParams.get("username") || "developer").trim().replace(/^@/, "");
  const bio = searchParams.get("bio") || "";
  const skillsStr = searchParams.get("skills") || "";
  const skills = skillsStr ? skillsStr.split(",").map(s => s.trim()) : [];
  
  return generateTldrResponse({ username, bio, skills });
}

export async function POST(req: Request) {
  try {
    const body: UserTldrPayload = await req.json();
    const username = (body.username || "developer").trim().replace(/^@/, "");
    return generateTldrResponse({ ...body, username });
  } catch {
    return generateTldrResponse({ username: "developer" });
  }
}

function generateTldrResponse(data: {
  username: string;
  name?: string;
  bio?: string;
  skills?: string[];
  public_repos?: number;
  followers?: number;
}) {
  const { username, bio, skills = [] } = data;
  const cleanUser = username.replace(/^@/, "");
  const topStack = skills.length > 0 ? skills.slice(0, 3).join(", ") : "TypeScript, Modern Web & Distributed Systems";

  // Deterministic intelligent profile archetype heuristics
  const lowerUser = cleanUser.toLowerCase();
  const lowerBio = (bio || "").toLowerCase();

  let archetype = "High-Velocity Full-Stack Engineer";
  let superpower = "Shipping resilient, end-to-end open-source tooling with strong community DX.";
  let summary = `@${cleanUser} is an impactful builder specializing in ${topStack}. They focus on architecting scalable modern applications with clean modular structure.`;

  if (lowerUser.includes("torvalds") || lowerBio.includes("kernel") || lowerBio.includes("linux")) {
    archetype = "Foundational Systems Architect & OSS Legend";
    superpower = "Low-level systems reliability, kernel architecture, and massive-scale collaborative VCS.";
    summary = `@${cleanUser} is a foundational open-source pioneer known for architecting the Linux kernel and Git. Specializes in maximum system throughput and zero-cost abstractions.`;
  } else if (lowerUser.includes("shadcn") || lowerBio.includes("ui") || lowerBio.includes("design") || skills.includes("CSS")) {
    archetype = "Design Systems & Frontend Architect";
    superpower = "Crafting world-class, accessible UI components and delightful developer ergonomics.";
    summary = `@${cleanUser} is a leading UI/UX engineer shaping modern design systems. Renowned for accessible, copy-pasteable component primitives and razor-sharp web polish.`;
  } else if (lowerUser.includes("karpathy") || lowerBio.includes("ai") || lowerBio.includes("llm") || lowerBio.includes("deep learning")) {
    archetype = "AI Research & Deep Learning Pioneer";
    superpower = "Demystifying complex neural network architectures and training foundation models.";
    summary = `@${cleanUser} is a visionary AI researcher and educator specializing in deep learning, transformer architectures, and scalable autonomous neural agents.`;
  } else if (lowerBio.includes("rust") || skills.includes("Rust") || lowerBio.includes("systems")) {
    archetype = "Systems & Performance Engineer";
    superpower = "Memory-safe systems programming and high-concurrency low-latency services.";
    summary = `@${cleanUser} delivers blazingly fast systems in ${topStack}, prioritizing memory safety, compile-time correctness, and robust distributed resilience.`;
  } else if (bio) {
    summary = `@${cleanUser} is an active open-source creator (${bio}). Specializes in ${topStack} with a focus on scalable modular architecture.`;
  }

  return NextResponse.json({
    success: true,
    username: cleanUser,
    archetype,
    superpower,
    summary,
    stack: topStack,
  });
}

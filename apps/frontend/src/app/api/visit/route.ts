import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "visit_responses.json");

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    ensureDataFile();

    const currentData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    const newEntry = {
      id: "entry_" + Date.now(),
      ...body,
      submittedAt: new Date().toISOString(),
    };

    currentData.push(newEntry);
    fs.writeFileSync(DATA_FILE, JSON.stringify(currentData, null, 2));

    return NextResponse.json({ success: true, entry: newEntry });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    ensureDataFile();
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    const { searchParams } = new URL(req.url);

    // Format as CSV if ?format=csv is requested
    if (searchParams.get("format") === "csv") {
      if (data.length === 0) {
        return new NextResponse("No responses yet", { status: 200 });
      }
      const headers = [
        "Submitted At",
        "Full Name",
        "Email",
        "Phone",
        "Education Level",
        "Institution Name",
        "Department",
        "GitHub Username",
        "Coding Experience",
        "Interests",
        "Rating",
        "Favorite Features",
        "Next Steps",
        "Feedback",
      ];
      const rows = data.map((r: any) => [
        `"${r.submittedAt || ""}"`,
        `"${(r.fullName || "").replace(/"/g, '""')}"`,
        `"${(r.email || "").replace(/"/g, '""')}"`,
        `"${(r.phone || "").replace(/"/g, '""')}"`,
        `"${(r.institutionType || "").replace(/"/g, '""')}"`,
        `"${(r.institutionName || "").replace(/"/g, '""')}"`,
        `"${(r.department || "").replace(/"/g, '""')}"`,
        `"${(r.githubUsername || "").replace(/"/g, '""')}"`,
        `"${(r.experience || "").replace(/"/g, '""')}"`,
        `"${(Array.isArray(r.interests) ? r.interests.join(", ") : "").replace(/"/g, '""')}"`,
        `"${r.rating || ""}"`,
        `"${(Array.isArray(r.favoriteFeatures) ? r.favoriteFeatures.join(", ") : "").replace(/"/g, '""')}"`,
        `"${(Array.isArray(r.nextSteps) ? r.nextSteps.join(", ") : "").replace(/"/g, '""')}"`,
        `"${(r.feedback || "").replace(/"/g, '""')}"`,
      ]);

      const csvContent = [headers.join(","), ...rows.map((row: any) => row.join(","))].join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="gitwit_visit_responses.csv"',
        },
      });
    }

    return NextResponse.json({ count: data.length, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

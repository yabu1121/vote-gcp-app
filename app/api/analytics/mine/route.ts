
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDoc, SHEET_QUESTIONNAIRES, SHEET_RESPONSES } from "@/lib/sheets";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const doc = await getDoc();
    await doc.loadInfo();

    const qSheet = doc.sheetsByTitle[SHEET_QUESTIONNAIRES];
    const rSheet = doc.sheetsByTitle[SHEET_RESPONSES];

    if (!qSheet || !rSheet) {
      return NextResponse.json({ daily: [], total: 0, today: 0, week: 0, month: 0 });
    }

    // 1. Get My Polls
    const qRows = await qSheet.getRows();
    const myPollIds = qRows
      .filter((row) => row.get("owner_email") === session.user?.email)
      .map((row) => row.get("id"));

    if (myPollIds.length === 0) {
      return NextResponse.json({ daily: [], total: 0, today: 0, week: 0, month: 0 });
    }

    // 2. Get Responses for My Polls
    const rRows = await rSheet.getRows();
    const myResponses = rRows.filter((row) => myPollIds.includes(row.get("questionnaire_id")));

    // 3. Analyze Data
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let total = 0;
    let today = 0;
    let week = 0;
    let month = 0;

    const dailyCounts: Record<string, number> = {};

    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split('T')[0]; // YYYY-MM-DD
      dailyCounts[key] = 0;
    }

    myResponses.forEach((row) => {
      const submittedAtStr = row.get("submitted_at");
      if (!submittedAtStr) return;

      const submittedAt = new Date(submittedAtStr).getTime();
      const dateKey = new Date(submittedAt).toISOString().split('T')[0];

      total++;

      if (submittedAt >= todayStart) today++;
      if (submittedAt >= weekStart) week++;
      if (submittedAt >= monthStart) month++;

      if (dailyCounts[dateKey] !== undefined) {
        dailyCounts[dateKey]++;
      }
    });

    // Format for Recharts
    const dailyData = Object.keys(dailyCounts).sort().map(date => ({
      name: date.slice(5), // MM-DD
      total: dailyCounts[date]
    }));

    return NextResponse.json({
      dailyStats: dailyData,
      totalVotes: total,
      today,
      week,
      month
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Failed to analyze data" }, { status: 500 });
  }
}


import { NextResponse } from "next/server";
import { updateLike } from "@/lib/sheets";

export async function POST(req: Request) {
  try {
    const { questionnaire_id, increment } = await req.json();

    if (!questionnaire_id) {
      return NextResponse.json({ error: "Missing questionnaire_id" }, { status: 400 });
    }

    const newLikes = await updateLike(questionnaire_id, increment);

    if (newLikes === null) {
      return NextResponse.json({ error: "Failed to update like" }, { status: 500 });
    }

    return NextResponse.json({ likes: newLikes });
  } catch (error) {
    console.error("Like Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

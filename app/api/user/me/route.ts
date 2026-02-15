
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUser } from "@/lib/sheets";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await getUser(session.user.email);

    if (user) {
      return NextResponse.json(user);
    } else {
      // Return session data if no custom profile exists
      return NextResponse.json({
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      });
    }
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

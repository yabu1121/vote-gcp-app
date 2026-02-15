
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateUser } from "@/lib/sheets";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, image } = await req.json();

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    await updateUser({
      email: session.user.email,
      name: name.trim(),
      image: (typeof image === 'string' ? image.trim() : "") || "",
    });

    return NextResponse.json({ message: "Profile updated" });

  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

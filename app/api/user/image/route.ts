
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateUser } from '@/lib/sheets';
import { uploadImage } from '@/lib/drive';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { image } = body; // Base64 encoded image string

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Check size roughly (optional but good practice)
    if (image.length > 50000) {
      return NextResponse.json({ error: "Image too large for spreadsheet storage" }, { status: 400 });
    }

    await updateUser({
      email: session.user.email,
      name: session.user.name || "Unknown",
      image: image
    });

    return NextResponse.json({ imageUrl: image });
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

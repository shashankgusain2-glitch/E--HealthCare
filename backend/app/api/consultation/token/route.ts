import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { generateToken04 } from "@/lib/zego";

const TOKEN_LIFETIME_SECONDS = 2 * 60 * 60;

// Issues a video-call token for the signed-in user. The frontend wraps it with
// ZegoUIKitPrebuilt.generateKitTokenForProduction to join a consultation room.
export async function GET() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const appID = Number(process.env.ZEGO_APP_ID);
  const serverSecret = process.env.ZEGO_SERVER_SECRET;
  if (!appID || !serverSecret) {
    console.error("ZEGO_APP_ID and ZEGO_SERVER_SECRET must be set to issue video call tokens");
    return NextResponse.json({ message: "Video calls are not configured" }, { status: 500 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true },
    });

    const userID: string = session.user.id;
    const userName = user?.name || user?.email?.split("@")[0] || "User";
    const token = generateToken04(appID, userID, serverSecret, TOKEN_LIFETIME_SECONDS);

    return NextResponse.json({ appID, token, userID, userName });
  } catch (error) {
    console.error("Error creating video call token:", error);
    return NextResponse.json({ message: "Failed to create video call token" }, { status: 500 });
  }
}

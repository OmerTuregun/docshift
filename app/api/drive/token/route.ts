import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getGoogleAccessToken } from "@/lib/drive";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = await getGoogleAccessToken(session.user.id);

  if (!accessToken) {
    return NextResponse.json(
      {
        error:
          "Google erişim token'ı bulunamadı. Tekrar giriş yapın.",
      },
      { status: 401 },
    );
  }

  return NextResponse.json({ accessToken });
}

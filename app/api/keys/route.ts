import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  countActiveApiKeys,
  generateApiKey,
  getUserApiKeys,
} from "@/lib/db/apiKeys";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const keys = await getUserApiKeys(session.user.id);
    return NextResponse.json(keys);
  } catch (error) {
    console.error("[api/keys GET]", error);

    return NextResponse.json(
      {
        error:
          "API anahtarları yüklenemedi. Veritabanı migration'ını çalıştırın: npm run migrate",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { name?: string };
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!name) {
      return NextResponse.json(
        { error: "Key adı gerekli" },
        { status: 400 },
      );
    }

    if (name.length > 50) {
      return NextResponse.json(
        { error: "Key adı en fazla 50 karakter olabilir" },
        { status: 400 },
      );
    }

    const activeCount = await countActiveApiKeys(session.user.id);

    if (activeCount >= 5) {
      return NextResponse.json(
        { error: "Maksimum 5 aktif API key oluşturabilirsiniz" },
        { status: 400 },
      );
    }

    const { key, record } = await generateApiKey(session.user.id, name);

    return NextResponse.json(
      { key, record },
      {
        headers: {
          "X-Key-Display": "once",
        },
      },
    );
  } catch (error) {
    console.error("[api/keys POST]", error);

    return NextResponse.json(
      {
        error:
          "API key oluşturulamadı. Veritabanı migration'ını çalıştırın: npm run migrate",
      },
      { status: 500 },
    );
  }
}

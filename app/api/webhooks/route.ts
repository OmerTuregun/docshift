import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  deleteWebhook,
  getUserWebhook,
  upsertWebhook,
} from "@/lib/webhook";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const webhook = await getUserWebhook(session.user.id);
  return NextResponse.json(webhook);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { url?: string };
  const url = typeof body.url === "string" ? body.url.trim() : "";

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Geçersiz URL formatı" }, { status: 400 });
  }

  if (!url.startsWith("https://")) {
    return NextResponse.json(
      { error: "Webhook URL HTTPS olmalıdır" },
      { status: 400 },
    );
  }

  const webhook = await upsertWebhook(session.user.id, url);
  return NextResponse.json(webhook);
}

export async function DELETE() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await deleteWebhook(session.user.id);
  return NextResponse.json({ success: true });
}

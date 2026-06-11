import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserWebhook, getWebhookDeliveries } from "@/lib/webhook";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const webhook = await getUserWebhook(session.user.id);

  if (!webhook) {
    return NextResponse.json([]);
  }

  const deliveries = await getWebhookDeliveries(webhook.id);
  return NextResponse.json(deliveries);
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserWebhook, triggerWebhook, type WebhookPayload } from "@/lib/webhook";

export const runtime = "nodejs";

export async function POST() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const webhook = await getUserWebhook(session.user.id);

  if (!webhook) {
    return NextResponse.json({ error: "Webhook bulunamadı" }, { status: 404 });
  }

  const testPayload: WebhookPayload = {
    event: "conversion.completed",
    timestamp: new Date().toISOString(),
    data: {
      file_name: "test_file.xlsx",
      file_type: "excel",
      output_format: "json",
      converted_result: '{"test": true}',
      user_id: session.user.id,
    },
  };

  await triggerWebhook(session.user.id, testPayload);

  return NextResponse.json({
    success: true,
    message: "Test webhook gönderildi",
  });
}

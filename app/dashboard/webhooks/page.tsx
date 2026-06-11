import { redirect } from "next/navigation";
import { auth } from "@/auth";
import WebhookClient from "@/components/WebhookClient";

export default async function WebhooksPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard/webhooks");
  }

  return <WebhookClient userId={session.user.id} />;
}

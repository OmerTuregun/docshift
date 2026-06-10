import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteApiKey } from "@/lib/db/apiKeys";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  await deleteApiKey(id, session.user.id);

  return NextResponse.json({ success: true });
}

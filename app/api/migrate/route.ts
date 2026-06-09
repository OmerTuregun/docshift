import { NextResponse } from "next/server";
import { runMigrations } from "@/lib/db/migrate";

export const runtime = "nodejs";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { success: false, error: "Migrations are only available in development" },
      { status: 403 },
    );
  }

  try {
    await runMigrations();
    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Migration failed";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

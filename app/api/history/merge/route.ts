import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { bulkInsertHistory } from "@/lib/db/history";

export const runtime = "nodejs";

interface AnonRecord {
  id: string;
  file_name: string;
  file_type: string;
  output_format: string;
  converted_result: string;
  created_at: string;
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json()) as { records?: AnonRecord[] };
    const records = Array.isArray(body.records) ? body.records : [];
    const merged = await bulkInsertHistory(session.user.id, records);

    return NextResponse.json({ merged });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to merge history";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

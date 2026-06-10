import { NextResponse } from "next/server";
import { getConversionCount } from "@/lib/db/stats";

export const runtime = "nodejs";
export const revalidate = 30;

export async function GET() {
  try {
    const totalConversions = await getConversionCount();

    return NextResponse.json({ totalConversions });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch stats";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

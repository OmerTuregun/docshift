import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { FILE_SIZE_LIMIT_BYTES } from "@/lib/constants";
import { detectFileType } from "@/lib/detectFileType";
import { DriveApiError, downloadDriveFile, getGoogleAccessToken } from "@/lib/drive";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("fileId");
  const fileNameParam = searchParams.get("fileName");

  if (!fileId) {
    return NextResponse.json({ error: "fileId gerekli" }, { status: 400 });
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

  try {
    const { buffer, mimeType, fileName: driveFileName } =
      await downloadDriveFile(fileId, accessToken);

    const fileName = fileNameParam ?? driveFileName;
    const fileType = detectFileType(fileName, mimeType);

    if (!fileType) {
      return NextResponse.json(
        { error: "Desteklenmeyen dosya türü" },
        { status: 415 },
      );
    }

    if (buffer.length > FILE_SIZE_LIMIT_BYTES) {
      return NextResponse.json(
        { error: "Dosya 10MB limitini aşıyor" },
        { status: 413 },
      );
    }

    return NextResponse.json({
      success: true,
      fileName,
      fileType,
      fileSize: buffer.length,
      data: buffer.toString("base64"),
      mimeType,
    });
  } catch (error) {
    if (error instanceof DriveApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: "Dosya indirilemedi" },
      { status: 500 },
    );
  }
}

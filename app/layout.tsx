import type { Metadata } from "next";
import { auth } from "@/auth";
import NavBar from "@/components/NavBar";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocShift – Document Converter",
  description: "Convert Excel, Word, PDF, and PowerPoint files to JSON, XML, Markdown, or plain text.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="tr" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <Providers session={session}>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}

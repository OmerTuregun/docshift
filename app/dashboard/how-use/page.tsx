import { redirect } from "next/navigation";
import { auth } from "@/auth";
import HowUseClient from "@/components/HowUseClient";
import { getUserApiKeys, type ApiKey } from "@/lib/db/apiKeys";
import { HOW_USE_PATH } from "@/lib/siteNav";

export default async function HowUsePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/auth/login?callbackUrl=${HOW_USE_PATH}`);
  }

  let initialKeys: ApiKey[] = [];

  try {
    initialKeys = await getUserApiKeys(session.user.id);
  } catch (error) {
    console.error("[dashboard/how-use]", error);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="mb-6 text-xs text-gray-400">Dashboard / Nasıl Kullanırım?</p>

      <h1 className="text-2xl font-medium text-[#1D3461]">Nasıl Kullanırım?</h1>
      <p className="mt-1 text-sm text-gray-400">
        API key oluşturun ve DocShift&apos;i REST veya TypeScript SDK ile
        entegre edin.
      </p>

      <div className="mt-8">
        <HowUseClient initialKeys={initialKeys} />
      </div>
    </main>
  );
}

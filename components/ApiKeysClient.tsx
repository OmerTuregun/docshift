"use client";

import { useState } from "react";
import {
  TbCheck,
  TbCopy,
  TbKey,
  TbPlus,
  TbShieldCheck,
  TbX,
} from "react-icons/tb";
import ApiKeyRow from "@/components/ApiKeyRow";
import type { ApiKey } from "@/lib/db/apiKeys";

interface ApiKeysClientProps {
  initialKeys: ApiKey[];
  onShowGuide?: (tab: "rest" | "sdk") => void;
}

async function parseJsonResponse<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  return (await response.json()) as T;
}

export default function ApiKeysClient({
  initialKeys,
  onShowGuide,
}: ApiKeysClientProps) {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
  const [newKeyName, setNewKeyName] = useState("");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [keyCopied, setKeyCopied] = useState(false);
  const [keySavedConfirmed, setKeySavedConfirmed] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newKeyName.trim() || isCreating || keys.length >= 5) return;

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName.trim() }),
      });

      const data = await parseJsonResponse<{ key?: string; error?: string }>(
        response,
      );

      if (!response.ok || !data?.key) {
        setError(data?.error ?? "API key oluşturulamadı");
        return;
      }

      setNewlyCreatedKey(data.key);
      setKeyCopied(false);
      setKeySavedConfirmed(false);
      setNewKeyName("");

      const refresh = await fetch("/api/keys");
      const refreshed = await parseJsonResponse<ApiKey[]>(refresh);

      if (refresh.ok && refreshed) {
        setKeys(refreshed);
      }
    } catch {
      setError("API key oluşturulamadı");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);

    const response = await fetch(`/api/keys/${id}`, { method: "DELETE" });

    if (response.ok) {
      setKeys((prev) => prev.filter((key) => key.id !== id));
      return;
    }

    const data = await parseJsonResponse<{ error?: string }>(response);
    setError(data?.error ?? "API key silinemedi");
  };

  const handleCopyKey = async () => {
    if (!newlyCreatedKey) return;

    await navigator.clipboard.writeText(newlyCreatedKey);
    setKeyCopied(true);
  };

  const handleDismissNewKey = () => {
    if (!keySavedConfirmed) return;

    setNewlyCreatedKey(null);
    setKeyCopied(false);
    setKeySavedConfirmed(false);
  };

  return (
    <>
      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5">
        <h3 className="mb-4 text-sm font-medium text-[#1D3461]">
          Yeni API Key Oluştur
        </h3>

        <div className="flex gap-3">
          <input
            value={newKeyName}
            onChange={(event) => setNewKeyName(event.target.value)}
            placeholder="Key adı (örn: Üretim, Test)"
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition-colors outline-none focus:border-[#1A9BA1]"
            maxLength={50}
          />
          <button
            type="button"
            onClick={() => void handleCreate()}
            disabled={!newKeyName.trim() || isCreating || keys.length >= 5}
            className="flex items-center gap-2 rounded-xl bg-[#1A9BA1] px-5 py-2.5 text-sm text-white transition-colors hover:bg-[#1D3461] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <TbPlus />
            Oluştur
          </button>
        </div>

        {keys.length >= 5 ? (
          <p className="mt-2 text-xs text-amber-500">
            Maksimum 5 aktif key limitine ulaştınız.
          </p>
        ) : null}

        {error ? (
          <p className="mt-2 text-xs text-red-500">{error}</p>
        ) : null}
      </div>

      {newlyCreatedKey ? (
        <div className="mb-6 rounded-2xl border-2 border-amber-300/60 bg-amber-50/80 p-5">
          <div className="flex items-start gap-3">
            <TbShieldCheck className="mt-0.5 shrink-0 text-xl text-amber-600" />
            <div className="flex-1">
              <p className="mb-1 text-sm font-semibold text-[#1D3461]">
                API Key oluşturuldu — şimdi kopyalayıp kaydedin
              </p>
              <p className="mb-3 text-sm leading-relaxed text-amber-900/80">
                Güvenlik nedeniyle bu key yalnızca bir kez gösterilir. Sayfayı
                kapattıktan veya bu kutuyu kapattıktan sonra{" "}
                <strong>aynı key&apos;i tekrar göremezsiniz.</strong> Lütfen
                şimdi kopyalayıp güvenli bir yere kaydedin (ör. parola
                yöneticisi, <code className="text-xs">.env</code> dosyası).
              </p>

              <div className="mb-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-4 py-2.5">
                <code className="flex-1 break-all font-mono text-sm text-[#1D3461]">
                  {newlyCreatedKey}
                </code>
                <button
                  type="button"
                  onClick={() => void handleCopyKey()}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#1A9BA1] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#1D3461]"
                >
                  {keyCopied ? <TbCheck /> : <TbCopy />}
                  {keyCopied ? "Kopyalandı" : "Key'i kopyala"}
                </button>
              </div>

              <label className="mb-4 flex cursor-pointer items-start gap-2.5 rounded-xl border border-amber-200/80 bg-white/70 px-3 py-3">
                <input
                  type="checkbox"
                  checked={keySavedConfirmed}
                  onChange={(event) => setKeySavedConfirmed(event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1A9BA1] focus:ring-[#1A9BA1]"
                />
                <span className="text-xs leading-relaxed text-[#1D3461]">
                  Bu API key&apos;i kopyalayıp güvenli bir yere kaydettim. Tekrar
                  gösterilmeyeceğini anlıyorum.
                </span>
              </label>

              <div className="space-y-3 border-t border-amber-200/60 pt-4">
                <p className="text-xs font-medium text-[#1D3461]">Hızlı başlangıç</p>
                <pre className="overflow-x-auto rounded-xl bg-[#0f172a] p-3 font-mono text-xs text-emerald-400">
                  {`curl -X POST ${typeof window !== "undefined" ? window.location.origin : ""}/api/v1/convert \\
  -H "Authorization: Bearer ${newlyCreatedKey}" \\
  -F "file=@document.xlsx" \\
  -F "outputFormat=json"`}
                </pre>
                <pre className="overflow-x-auto rounded-xl bg-[#0f172a] p-3 font-mono text-xs text-emerald-400">
                  {`import { DocShift } from "@docshift/sdk";

const client = new DocShift({
  apiKey: "${newlyCreatedKey}",
  baseUrl: "${typeof window !== "undefined" ? window.location.origin : ""}",
});

await client.convert({ file: "./document.xlsx", outputFormat: "json" });`}
                </pre>
                {onShowGuide ? (
                  <button
                    type="button"
                    onClick={() => onShowGuide("sdk")}
                    className="text-xs text-[#1A9BA1] hover:underline"
                  >
                    Tüm dokümantasyon →
                  </button>
                ) : null}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleDismissNewKey}
                  disabled={!keySavedConfirmed}
                  className="rounded-xl bg-[#1D3461] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#1A9BA1] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Kaydettim, kapatabilirsin
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDismissNewKey}
              disabled={!keySavedConfirmed}
              className="shrink-0 p-1 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Kapat"
              title={
                keySavedConfirmed
                  ? "Kapat"
                  : "Kapatmak için önce key'i kaydettiğinizi onaylayın"
              }
            >
              <TbX className="text-sm" />
            </button>
          </div>
        </div>
      ) : null}

      {keys.length === 0 ? (
        <div className="py-12 text-center text-gray-300">
          <TbKey className="mx-auto mb-3 block text-4xl" />
          <p className="text-sm text-gray-400">Henüz API key yok</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {keys.map((key) => (
            <ApiKeyRow key={key.id} apiKey={key} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </>
  );
}

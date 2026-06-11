"use client";

import { useCallback, useEffect, useState } from "react";
import { TbSend, TbTrash } from "react-icons/tb";
import WebhookDeliveryRow from "@/components/WebhookDeliveryRow";
import type { Webhook, WebhookDelivery } from "@/lib/webhook";

interface WebhookClientProps {
  userId: string;
}

export default function WebhookClient({ userId }: WebhookClientProps) {
  const [webhook, setWebhook] = useState<Webhook | null>(null);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDeliveries = useCallback(async () => {
    const response = await fetch("/api/webhooks/deliveries");
    if (response.ok) {
      const data = (await response.json()) as WebhookDelivery[];
      setDeliveries(data);
    }
  }, []);

  useEffect(() => {
    async function load() {
      const [webhookRes, deliveriesRes] = await Promise.all([
        fetch("/api/webhooks"),
        fetch("/api/webhooks/deliveries"),
      ]);

      if (webhookRes.ok) {
        const data = (await webhookRes.json()) as Webhook | null;
        setWebhook(data);
        if (data?.url) {
          setUrlInput(data.url);
        }
      }

      if (deliveriesRes.ok) {
        const data = (await deliveriesRes.json()) as WebhookDelivery[];
        setDeliveries(data);
      }
    }

    void load();
  }, [userId]);

  const handleSave = async () => {
    if (!urlInput.trim() || isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const data = (await response.json()) as Webhook & { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Webhook kaydedilemedi");
        return;
      }

      setWebhook(data);
      await loadDeliveries();
    } catch {
      setError("Webhook kaydedilemedi");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    if (isTesting) return;

    setIsTesting(true);
    setError(null);

    try {
      const response = await fetch("/api/webhooks/test", { method: "POST" });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Test webhook gönderilemedi");
        return;
      }

      await loadDeliveries();
    } catch {
      setError("Test webhook gönderilemedi");
    } finally {
      setIsTesting(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch("/api/webhooks", { method: "DELETE" });

      if (!response.ok) {
        setError("Webhook silinemedi");
        return;
      }

      setWebhook(null);
      setDeliveries([]);
    } catch {
      setError("Webhook silinemedi");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="mb-6 text-xs text-gray-400">Dashboard / Webhooks</p>

      <h1 className="text-2xl font-medium text-[#1D3461]">Webhook Ayarları</h1>
      <p className="mt-1 text-sm text-gray-400">
        Başarılı dönüşümlerde belirtilen URL&apos;e bildirim gönderilir.
      </p>

      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-5 mb-6">
        <h3 className="mb-4 text-sm font-medium text-[#1D3461]">Webhook URL</h3>
        <div className="flex gap-3">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://yourapp.com/webhook"
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 font-mono text-sm outline-none transition-colors focus:border-[#1A9BA1]"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !urlInput.trim()}
            className="rounded-xl bg-[#1A9BA1] px-5 py-2.5 text-sm text-white transition-colors hover:bg-[#1D3461] disabled:opacity-40"
          >
            {isSaving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Yalnızca HTTPS URL&apos;leri kabul edilir.
        </p>
        {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
      </div>

      {webhook ? (
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            <span className="flex-1 truncate font-mono text-sm text-gray-600">
              {webhook.url}
            </span>
          </div>

          <div className="mb-4 rounded-xl bg-gray-50 px-4 py-3">
            <p className="mb-1 text-[10px] text-gray-400">
              İmza anahtarı (X-DocShift-Signature)
            </p>
            <code className="font-mono text-xs text-gray-600">
              {webhook.secret}
            </code>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm transition hover:border-[#1A9BA1] hover:text-[#1A9BA1]"
            >
              <TbSend className="text-xs" />
              {isTesting ? "Gönderiliyor..." : "Test Et"}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 rounded-xl border border-red-100 px-4 py-2 text-sm text-red-400 transition hover:bg-red-50"
            >
              <TbTrash className="text-xs" />
              Sil
            </button>
          </div>
        </div>
      ) : null}

      {deliveries.length > 0 ? (
        <div>
          <h3 className="mb-3 text-sm font-medium text-[#1D3461]">
            Son Gönderimler
          </h3>
          <div className="flex flex-col gap-2">
            {deliveries.map((d) => (
              <WebhookDeliveryRow key={d.id} delivery={d} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

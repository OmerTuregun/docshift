import { formatRelativeTime } from "@/lib/formatRelativeTime";
import type { WebhookDelivery } from "@/lib/webhook";

interface WebhookDeliveryRowProps {
  delivery: WebhookDelivery;
}

export default function WebhookDeliveryRow({ delivery }: WebhookDeliveryRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3">
      <div
        className={`h-2 w-2 flex-shrink-0 rounded-full ${
          delivery.delivered_at ? "bg-green-400" : "bg-red-400"
        }`}
      />

      <div className="flex-1">
        <span className="text-xs text-gray-500">
          {delivery.delivered_at
            ? `Başarılı · ${delivery.response_status}`
            : `Başarısız · ${delivery.attempt_count} deneme`}
        </span>
      </div>

      <span className="text-[10px] text-gray-300">
        {formatRelativeTime(delivery.created_at)}
      </span>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { TbApi, TbBrandTypescript } from "react-icons/tb";

export type GuideTab = "rest" | "sdk";

const cards = [
  {
    id: "rest" as const,
    icon: TbApi,
    title: "cURL / REST",
    description: "Herhangi bir dil veya araçtan HTTP isteği gönderin.",
    example: 'curl -H "Authorization: Bearer ds_live_..."',
  },
  {
    id: "sdk" as const,
    icon: TbBrandTypescript,
    title: "TypeScript SDK",
    description: "Node veya tarayıcıda import ile kullanın.",
    example: 'import { DocShift } from "@docshift/sdk"',
  },
] as const;

interface ApiGuidePickerProps {
  activeTab: GuideTab | null;
  onSelect: (tab: GuideTab) => void;
}

export default function ApiGuidePicker({
  activeTab,
  onSelect,
}: ApiGuidePickerProps) {
  return (
    <section className="mb-8 grid gap-4 sm:grid-cols-2">
      {cards.map((card) => {
        const isActive = activeTab === card.id;

        return (
          <motion.button
            key={card.id}
            type="button"
            onClick={() => onSelect(card.id)}
            layout
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`group rounded-2xl border p-5 text-left transition-colors duration-300 ${
              isActive
                ? "border-[#1A9BA1] bg-[#f0fafb] shadow-sm shadow-[#1A9BA1]/10"
                : "border-gray-100 bg-white hover:border-[#1A9BA1]/40 hover:bg-[#f8fdfd]"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <card.icon
                className={`text-xl transition-colors ${
                  isActive ? "text-[#1D3461]" : "text-[#1A9BA1]"
                }`}
              />
              <motion.span
                layout
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                  isActive
                    ? "bg-[#1D3461] text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {isActive ? "Seçili" : "Seç"}
              </motion.span>
            </div>
            <h2 className="text-sm font-medium text-[#1D3461]">{card.title}</h2>
            <p className="mt-1 text-xs text-gray-500">{card.description}</p>
            <code className="mt-3 block truncate font-mono text-xs text-[#1A9BA1]/80">
              {card.example}
            </code>
          </motion.button>
        );
      })}
    </section>
  );
}

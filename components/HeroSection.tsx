"use client";

import Image from "next/image";
import { useState } from "react";
import { TbSparkles } from "react-icons/tb";

const FORMAT_PILLS = ["JSON", "XML", "Markdown", "Plain Text"] as const;

export default function HeroSection() {
  const [activePill, setActivePill] = useState<string>("JSON");

  return (
    <section className="w-full bg-gradient-to-b from-brand-teal-bg/40 to-white pt-16 pb-6 text-center sm:pb-10">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-6 flex justify-center">
          <Image
            src="/logos/docshift_logo_full.png"
            alt="DocShift"
            width={280}
            height={84}
            className="h-auto w-auto max-h-16 sm:max-h-20"
            priority
          />
        </div>

        <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand-teal-bg px-3 py-1.5 text-xs font-medium text-brand-navy">
          <TbSparkles size={14} />
          Dosyalarını saniyeler içinde dönüştür
        </span>

        <h1 className="mx-auto mb-4 max-w-lg text-4xl font-semibold tracking-tight text-brand-navy">
          Belgeyi yükle,{" "}
          <span className="text-brand-teal">istediğin formata</span> çevir
        </h1>

        <p className="mx-auto mb-6 max-w-md text-base leading-relaxed text-gray-500">
          Excel, Word, PDF ve PowerPoint dosyalarını JSON, XML, Markdown veya
          düz metne dönüştür.
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {FORMAT_PILLS.map((pill) => {
            const isActive = activePill === pill;

            return (
              <button
                key={pill}
                type="button"
                onClick={() => setActivePill(pill)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  isActive
                    ? "border-brand-teal bg-brand-teal text-white"
                    : "border-gray-200 bg-white text-gray-500 hover:border-brand-teal"
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

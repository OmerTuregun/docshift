"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TbAdjustments, TbDownload, TbUpload } from "react-icons/tb";

const STEPS = [
  {
    number: 1,
    icon: TbAdjustments,
    title: "Format seç",
    description:
      "JSON, XML, Markdown veya düz metin arasından çıktı formatını belirle.",
  },
  {
    number: 2,
    icon: TbUpload,
    title: "Dosyayı yükle",
    description:
      "Excel, Word, PDF veya PowerPoint dosyanı kartlardan birine sürükle ya da tıklayarak seç.",
  },
  {
    number: 3,
    icon: TbDownload,
    title: "İndir veya kopyala",
    description:
      "Dönüştürülen veriyi tek tıkla panoya kopyala veya dosya olarak indir.",
  },
] as const;

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="how"
      ref={ref}
      className="mx-auto max-w-4xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16"
    >
      <motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
      >
        <span className="mb-3 inline-block text-xs font-medium tracking-widest text-[#1A9BA1] uppercase">
          Nasıl çalışır?
        </span>
        <h2 className="mb-3 text-2xl font-medium tracking-tight text-[#1D3461] sm:text-3xl">
          3 adımda dönüştür
        </h2>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-400">
          Teknik bilgiye gerek yok. Formatı seç, dosyayı yükle, indir.
        </p>
      </motion.div>

      <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="absolute top-8 right-[calc(16.66%+1rem)] left-[calc(16.66%+1rem)] z-0 hidden h-px bg-gray-100 sm:block" />

        {STEPS.map(({ number, icon: Icon, title, description }, index) => (
          <motion.div
            key={number}
            className="relative z-10 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#1A9BA1] text-sm font-medium text-white ring-4 ring-white">
              {number}
            </div>

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d0f0f2]">
              <Icon className="text-2xl text-[#1A9BA1]" />
            </div>

            <h3 className="mb-2 text-sm font-medium text-[#1D3461]">{title}</h3>
            <p className="max-w-[180px] text-xs leading-relaxed text-gray-400">
              {description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

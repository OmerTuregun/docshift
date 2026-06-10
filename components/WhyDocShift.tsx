"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  TbBolt,
  TbCode,
  TbDeviceMobile,
  TbFiles,
  TbHistory,
  TbLock,
} from "react-icons/tb";

const FEATURES = [
  {
    icon: TbBolt,
    title: "Anlık dönüşüm",
    description:
      "Sunucu tarafında işleme — büyük dosyalar bile saniyeler içinde hazır.",
  },
  {
    icon: TbFiles,
    title: "Çoklu dosya desteği",
    description:
      "Aynı anda birden fazla dosya yükle, hepsini ayrı ayrı dönüştür.",
  },
  {
    icon: TbHistory,
    title: "Dönüşüm geçmişi",
    description:
      "Üye olarak geçmiş dönüşümlerine istediğin zaman eriş ve yeniden indir.",
  },
  {
    icon: TbLock,
    title: "Gizlilik önce",
    description:
      "Dosyaların işlendikten sonra sunucuda saklanmaz. Verilerin senindir.",
  },
  {
    icon: TbDeviceMobile,
    title: "Mobil uyumlu",
    description:
      "Telefon veya tabletten de sorunsuz çalışır. Her cihazda tam deneyim.",
  },
  {
    icon: TbCode,
    title: "API (yakında)",
    description:
      "Kendi uygulamanıza entegre edin. Developer erken erişim listesine katılın.",
  },
] as const;

export default function WhyDocShift() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="features"
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
          Neden DocShift?
        </span>
        <h2 className="mb-3 text-2xl font-medium tracking-tight text-[#1D3461] sm:text-3xl">
          Basit ama güçlü
        </h2>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-400">
          Developer ve ofis kullanıcısı için tasarlandı.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FEATURES.map(({ icon: Icon, title, description }, index) => (
          <motion.div
            key={title}
            className="group flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-200 hover:border-[#1A9BA1]/30 hover:shadow-sm"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d0f0f2] transition-colors duration-200 group-hover:bg-[#1A9BA1]">
              <Icon className="text-lg text-[#1A9BA1] transition-colors duration-200 group-hover:text-white" />
            </div>

            <div>
              <h3 className="mb-1.5 text-sm font-medium text-[#1D3461]">
                {title}
              </h3>
              <p className="text-xs leading-relaxed text-gray-400">
                {description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

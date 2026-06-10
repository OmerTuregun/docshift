"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import FaqItem from "@/components/FaqItem";
import { faqData } from "@/lib/faqData";

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>("free");
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
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
          SSS
        </span>
        <h2 className="mb-3 text-2xl font-medium tracking-tight text-[#1D3461] sm:text-3xl">
          Sıkça sorulan sorular
        </h2>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-400">
          Aklındaki soruların cevabı burada. Başka sorun varsa bize ulaş.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          {faqData.slice(0, 4).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <FaqItem
                question={item.question}
                answer={item.answer}
                isOpen={openId === item.id}
                onToggle={() => handleToggle(item.id)}
              />
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {faqData.slice(4).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: (index + 4) * 0.08 }}
            >
              <FaqItem
                question={item.question}
                answer={item.answer}
                isOpen={openId === item.id}
                onToggle={() => handleToggle(item.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <p className="text-xs text-gray-400">
          Başka sorun mu var?{" "}
          <a
            href="mailto:info@docshift.app"
            className="text-[#1A9BA1] underline underline-offset-2 transition-colors hover:text-[#1D3461]"
          >
            Bize ulaşın
          </a>
        </p>
      </motion.div>
    </section>
  );
}

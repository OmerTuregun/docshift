"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  TbCheck,
  TbHeart,
  TbLock,
  TbShieldCheck,
  TbSparkles,
  TbUpload,
  TbUserPlus,
} from "react-icons/tb";

const TRUST_ITEMS = [
  { icon: TbLock, text: "Dosyalar saklanmaz" },
  { icon: TbShieldCheck, text: "Güvenli bağlantı" },
  { icon: TbHeart, text: "Tamamen ücretsiz" },
] as const;

export default function CtaBand() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <section ref={ref} className="bg-[#1D3461] px-4 py-16 sm:py-20">
      <motion.div
        className="mx-auto max-w-2xl text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/80">
          <TbSparkles className="text-[#4BBFC4]" aria-hidden="true" />
          Ücretsiz · Kayıt gerekmez
        </div>

        <h2 className="mb-4 text-2xl leading-snug font-medium tracking-tight text-white sm:text-3xl">
          Hemen başla — <span className="text-[#4BBFC4]">ücretsiz</span>
        </h2>

        <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-white/50">
          Kayıt olmadan kullanmaya başla. Geçmişini kaydetmek istediğinde tek
          tıkla üye ol.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              document.getElementById("file-cards")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#1A9BA1] px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#4BBFC4]"
          >
            <TbUpload aria-hidden="true" />
            Dosya Yükle
          </button>

          {!session ? (
            <button
              type="button"
              onClick={() => router.push("/auth/login?callbackUrl=/")}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-6 py-3 text-sm font-medium text-white/80 transition-all duration-200 hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              <TbUserPlus aria-hidden="true" />
              Üye Ol →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-6 py-3 text-sm font-medium text-white/80 transition-all duration-200 hover:bg-white/10"
            >
              <TbCheck aria-hidden="true" />
              Üyesin — başlamaya hazırsın
            </button>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          {TRUST_ITEMS.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-1.5 text-xs text-white/40"
            >
              <Icon className="text-sm text-[#4BBFC4]" aria-hidden="true" />
              {text}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

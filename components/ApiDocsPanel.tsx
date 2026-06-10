"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { GuideTab } from "@/components/ApiGuidePicker";

const FILE_TYPES = ["xlsx", "xls", "docx", "doc", "pdf", "pptx", "ppt"];
const OUTPUT_FORMATS = ["json", "xml", "markdown", "plaintext"];

const ERROR_CODES = [
  { code: "MISSING_AUTH", description: "Authorization header eksik veya hatalı" },
  { code: "INVALID_KEY", description: "API key geçersiz veya devre dışı" },
  { code: "RATE_LIMITED", description: "Saatlik istek limiti aşıldı (100/saat)" },
  { code: "FILE_TOO_LARGE", description: "Dosya 10MB limitini aşıyor" },
  { code: "UNSUPPORTED_FILE", description: "Desteklenmeyen dosya uzantısı" },
];

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-2xl bg-[#0f172a] p-5 font-mono text-sm text-emerald-400">
      {children}
    </pre>
  );
}

function RestContent({ baseUrl }: { baseUrl: string }) {
  return (
  <div className="space-y-4">
    <h2 className="text-lg font-medium text-[#1D3461]">Kimlik Doğrulama</h2>
    <p className="text-sm text-gray-500">
      Her istekte{" "}
      <code className="text-[#1A9BA1]">Authorization: Bearer</code>{" "}
      header&apos;ı gönderin.
    </p>
    <CodeBlock>{`curl -X POST ${baseUrl}/api/v1/convert \\
  -H "Authorization: Bearer ds_live_YOUR_KEY" \\
  -F "file=@document.xlsx" \\
  -F "outputFormat=json"`}</CodeBlock>
  </div>
  );
}

function SdkContent({ baseUrl }: { baseUrl: string }) {
  return (
  <div className="space-y-4">
    <h2 className="text-lg font-medium text-[#1D3461]">Kurulum</h2>
    <p className="text-sm text-gray-500">
      REST yerine <code className="text-[#1A9BA1]">import</code> ile kullanmak
      için ince bir istemci paketi var.
    </p>
    <CodeBlock>{`npm install @docshift/sdk
# yerel geliştirme:
# npm install file:./packages/docshift-sdk`}</CodeBlock>

    <h3 className="pt-2 text-base font-medium text-[#1D3461]">Node.js</h3>
    <CodeBlock>{`import { DocShift } from "@docshift/sdk";

const client = new DocShift({
  apiKey: process.env.DOCSHIFT_API_KEY!,
  baseUrl: "${baseUrl}",
});

const result = await client.convert({
  file: "./rapor.xlsx",
  outputFormat: "json",
});

console.log(result.converted);`}</CodeBlock>

    <h3 className="pt-2 text-base font-medium text-[#1D3461]">Tarayıcı</h3>
    <CodeBlock>{`import { DocShift } from "@docshift/sdk";

const client = new DocShift({
  apiKey: "ds_live_YOUR_KEY",
  baseUrl: window.location.origin,
});

const result = await client.convert({
  file: fileInput.files[0],
  outputFormat: "xml",
});`}</CodeBlock>

    <h3 className="pt-2 text-base font-medium text-[#1D3461]">Hata yakalama</h3>
    <CodeBlock>{`import { DocShift, DocShiftError } from "@docshift/sdk";

try {
  await client.convert({ file, outputFormat: "json" });
} catch (error) {
  if (error instanceof DocShiftError) {
    console.log(error.code, error.status);
  }
}`}</CodeBlock>
  </div>
  );
}

interface ApiDocsPanelProps {
  activeTab: GuideTab | null;
  onTabChange: (tab: GuideTab) => void;
}

export default function ApiDocsPanel({
  activeTab,
  onTabChange,
}: ApiDocsPanelProps) {
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3030";

  return (
    <AnimatePresence initial={false}>
      {activeTab ? (
        <motion.section
          key="guide-panel"
          id="guide"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="mb-10 overflow-hidden scroll-mt-24"
        >
          <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
            <div className="mb-6 flex flex-wrap gap-2">
              {(["rest", "sdk"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onTabChange(tab)}
                  className={`rounded-xl px-4 py-2 text-sm transition-colors duration-200 ${
                    activeTab === tab
                      ? "bg-[#1D3461] text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-[#d0f0f2]"
                  }`}
                >
                  {tab === "rest" ? "cURL / REST" : "TypeScript SDK"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === "rest" ? -12 : 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeTab === "rest" ? 12 : -12 }}
                transition={{ duration: 0.25 }}
              >
                {activeTab === "rest" ? (
                  <RestContent baseUrl={baseUrl} />
                ) : (
                  <SdkContent baseUrl={baseUrl} />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 space-y-8 border-t border-gray-100 pt-8">
              <section className="space-y-4">
                <h2 className="text-lg font-medium text-[#1D3461]">
                  Desteklenen Dosya Türleri
                </h2>
                <p className="text-sm text-gray-600">{FILE_TYPES.join(", ")}</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-medium text-[#1D3461]">
                  Çıktı Formatları
                </h2>
                <p className="text-sm text-gray-600">
                  {OUTPUT_FORMATS.join(", ")}
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-lg font-medium text-[#1D3461]">
                  Hata Kodları
                </h2>
                <div className="overflow-hidden rounded-2xl border border-gray-100">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Kod</th>
                        <th className="px-4 py-3 font-medium">Açıklama</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ERROR_CODES.map((item) => (
                        <tr key={item.code}>
                          <td className="border-t border-gray-100 px-4 py-3 font-mono text-xs text-[#1A9BA1]">
                            {item.code}
                          </td>
                          <td className="border-t border-gray-100 px-4 py-3 text-gray-600">
                            {item.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-medium text-[#1D3461]">Limitler</h2>
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                  <li>API key başına saatte 100 istek</li>
                  <li>Maksimum dosya boyutu: 10MB</li>
                </ul>
              </section>
            </div>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}

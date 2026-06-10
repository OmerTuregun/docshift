import { redirect } from "next/navigation";
import { HOW_USE_PATH } from "@/lib/siteNav";

export default function ApiDocsRedirectPage() {
  redirect(HOW_USE_PATH);
}

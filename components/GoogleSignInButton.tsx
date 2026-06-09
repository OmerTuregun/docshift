"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function GoogleSignInButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#1A9BA1] py-3 text-base font-medium text-white transition-colors hover:bg-[#1D3461]"
    >
      <FcGoogle size={22} />
      Google ile Giriş Yap
    </button>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveToken } from "@/lib/auth";

export default function OAuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      saveToken(token);
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, []);

  return <div>Logging you in...</div>;
}

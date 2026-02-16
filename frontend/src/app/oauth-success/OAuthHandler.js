"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveToken } from "@/lib/auth";

export default function OAuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      saveToken(token);
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router, searchParams]);

  return null;
}

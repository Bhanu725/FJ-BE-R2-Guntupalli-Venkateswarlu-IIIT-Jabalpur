"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import OAuthHandler from "./OAuthHandler";

export default function OAuthSuccessPage() {
  return (
    <Suspense fallback={<div>Logging you in...</div>}>
      <OAuthHandler />
    </Suspense>
  );
}

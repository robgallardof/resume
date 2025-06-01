"use client";

import { useEffect, useState } from "react";
import i18n from "@/app/i18n";

/**
 * Prevents rendering until the i18n language is synchronized,
 * avoiding hydration mismatch between server and client.
 *
 * @param children The content to render after language is ready
 * @returns Wrapped content once the language is confirmed
 */
export default function LanguageGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      setReady(true);
    } else {
      i18n.on("initialized", () => {
        setReady(true);
      });
    }
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}

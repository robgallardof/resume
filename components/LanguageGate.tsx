"use client";

import { useSyncExternalStore } from "react";
import i18n from "@/app/i18n";

function subscribeToInit(onChange: () => void) {
  i18n.on("initialized", onChange);
  return () => i18n.off("initialized", onChange);
}

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
  const ready = useSyncExternalStore(
    subscribeToInit,
    () => i18n.isInitialized,
    () => false
  );

  if (!ready) return null;

  return <>{children}</>;
}

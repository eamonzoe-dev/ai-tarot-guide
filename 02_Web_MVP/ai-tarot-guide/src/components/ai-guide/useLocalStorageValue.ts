"use client";

import { useSyncExternalStore } from "react";

export function useLocalStorageValue(key: string) {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);

      return () => {
        window.removeEventListener("storage", onStoreChange);
      };
    },
    () => localStorage.getItem(key),
    () => undefined,
  );
}

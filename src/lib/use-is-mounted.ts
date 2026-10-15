"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Reads a client-only value (e.g. from `document`, `localStorage`, `matchMedia`)
 * without triggering a cascading render. Returns `getServer()` during SSR and
 * the first hydration render, then `getClient()` once mounted.
 */
export function useClientSnapshot<T>(getClient: () => T, getServer: () => T): T {
  return useSyncExternalStore(emptySubscribe, getClient, getServer);
}

export function useIsMounted(): boolean {
  return useClientSnapshot(
    () => true,
    () => false
  );
}

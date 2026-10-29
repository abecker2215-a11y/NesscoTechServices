"use client";

import { useEffect, useState, useCallback } from "react";
import { Bell, BellOff } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useClientSnapshot } from "@/lib/use-is-mounted";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

/**
 * Bell in the portal header: one tap enables push for ticket updates,
 * credits, and assignments on this device.
 */
export function PushToggle() {
  const supported = useClientSnapshot(
    () =>
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    () => false
  );
  const [enabled, setEnabled] = useState(false);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (!supported) return;
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setEnabled(!!sub))
      .catch(() => {});
  }, [supported]);

  const enable = useCallback(async () => {
    setWorking(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: Uint8Array.from(
          urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string)
        ).buffer as ArrayBuffer,
      });
      const json = sub.toJSON();
      const res = await fetch("/api/portal/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
      });
      if (!res.ok) throw new Error("subscribe failed");
      if (Notification.permission === "default") await Notification.requestPermission();
      setEnabled(true);
      trackEvent("push_enable", {});
    } catch {
      // Permission denied or unsupported — stay silent, bell stays off.
    } finally {
      setWorking(false);
    }
  }, []);

  const disable = useCallback(async () => {
    setWorking(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/portal/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setEnabled(false);
      trackEvent("push_disable", {});
    } catch {
      // ignore
    } finally {
      setWorking(false);
    }
  }, []);

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={enabled ? disable : enable}
      disabled={working}
      className="relative p-2 rounded-full text-muted-foreground hover:text-muted-foreground hover:bg-muted disabled:opacity-50"
      aria-label={enabled ? "Disable push notifications" : "Enable push notifications"}
      aria-pressed={enabled}
      title={enabled ? "Push on — ticket updates come to this device" : "Turn on push for ticket updates"}
    >
      {enabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
      {enabled && (
        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" aria-hidden="true" />
      )}
    </button>
  );
}


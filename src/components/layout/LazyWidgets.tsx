"use client";

import dynamic from "next/dynamic";

const ChatWidget = dynamic(
  () => import("@/components/chat/ChatWidget").then((m) => m.ChatWidget),
  { ssr: false }
);
const ExitIntentPopup = dynamic(
  () => import("@/components/ui/ExitIntentPopup").then((m) => m.ExitIntentPopup),
  { ssr: false }
);
const CallTracker = dynamic(
  () => import("@/components/CallTracker").then((m) => m.CallTracker),
  { ssr: false }
);

export function LazyWidgets() {
  return (
    <>
      <ChatWidget />
      <ExitIntentPopup />
      <CallTracker />
    </>
  );
}
import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileCTABar } from "./MobileCTABar";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ExitIntentPopup } from "@/components/ui/ExitIntentPopup";
import { CallTracker } from "@/components/CallTracker";
import { StickyDesktopCTA } from "./StickyDesktopCTA";

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  skipLink?: boolean;
}

export function PageContainer({ children, skipLink = true, className, ...props }: PageContainerProps) {
  return (
    <div className={cn("flex min-h-screen flex-col pb-16 lg:pb-0", className)} {...props}>
      {skipLink && (
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
      )}
      <Header />
      <main id="main-content" className="flex-1 pt-0" role="main">
        {children}
      </main>
      <Footer />
      <MobileCTABar />
      <ChatWidget />
      <StickyDesktopCTA />
      <ExitIntentPopup />
      <CallTracker />
    </div>
  );
}
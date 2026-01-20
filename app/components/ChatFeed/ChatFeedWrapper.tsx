"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { revalidateMessages } from "./actions";

const POLLING_INTERVAL = 5000;

export default function ChatFeedWrapper({ children }: { children: ReactNode }) {
  const scrollRef = useRef<HTMLElement>(null);

  // Auto-scroll to bottom on mount and when content changes
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollToBottom = () => {
      container.scrollTop = container.scrollHeight;
    };

    scrollToBottom();

    const observer = new MutationObserver(() => {
      scrollToBottom();
    });

    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      revalidateMessages();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={scrollRef}
      role="feed"
      aria-label="Chat messages"
      className="flex flex-1 flex-col items-center bg-chat bg-contain scroll-smooth overflow-y-scroll"
    >
      {children}
    </section>
  );
}

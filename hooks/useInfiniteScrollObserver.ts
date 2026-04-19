"use client";

import { useEffect, useRef } from "react";

export function useInfiniteScrollObserver({
  targetRef,
  enabled,
  onIntersect,
  rootMargin = "300px",
}: {
  targetRef: React.RefObject<Element | null>;
  enabled: boolean;
  onIntersect: () => void;
  rootMargin?: string;
}) {
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const el = targetRef.current;
    if (!el || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        // Reset when leaving viewport
        if (!entry.isIntersecting) {
          hasTriggeredRef.current = false;
          return;
        }

        // Prevent multiple triggers while visible
        if (hasTriggeredRef.current) return;

        hasTriggeredRef.current = true;
        onIntersect();
      },
      { rootMargin }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [enabled, onIntersect, rootMargin, targetRef]);
}
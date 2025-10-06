"use client";

import { useEffect, useState } from "react";

/**
 * useIsMobile
 *
 * A small hook that returns `true` when the viewport width is <= the given breakpoint (in px).
 * - SSR-safe: initial value is based on a fallback (defaults to false) and updated on mount.
 * - Uses matchMedia for accurate results and listens for resize (media query) changes.
 *
 * @param breakpoint - width in pixels; default 1024 (tailwind's lg).
 * @param initial - optional initial value to use during SSR (default false).
 * @returns boolean - true if viewport width <= breakpoint
 */
export function useIsMobile(breakpoint = 1024, initial = false) {
  const [isMobile, setIsMobile] = useState<boolean>(initial);

  useEffect(() => {
    // Guard for environments without window (shouldn't happen in client but keeps safety)
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);

    // Set initial value on mount
    setIsMobile(mq.matches);

    // Handler for changes
    const handler = (ev: MediaQueryListEvent | MediaQueryList) => {
      // MediaQueryListEvent in modern browsers has .matches.
      setIsMobile(Boolean((ev as any).matches));
    };

    // Add listener (modern) or fallback (older browsers)
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", handler as EventListener);
    } else {
      // @ts-ignore legacy
      mq.addListener(handler as (e: MediaQueryListEvent) => void);
    }

    return () => {
      if (typeof mq.removeEventListener === "function") {
        mq.removeEventListener("change", handler as EventListener);
      } else {
        // @ts-ignore legacy
        mq.removeListener(handler as (e: MediaQueryListEvent) => void);
      }
    };
  }, [breakpoint]);

  return isMobile;
}

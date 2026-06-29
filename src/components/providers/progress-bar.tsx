"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function ProgressBar() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPathname = useRef(pathname);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const start = () => {
    clearInterval(intervalRef.current);
    clearTimeout(hideTimerRef.current);
    setWidth(0);
    setVisible(true);
    let w = 0;
    intervalRef.current = setInterval(() => {
      w += Math.random() * 12 + 3;
      if (w > 85) { w = 85; clearInterval(intervalRef.current); }
      setWidth(w);
    }, 150);
  };

  const finish = () => {
    clearInterval(intervalRef.current);
    setWidth(100);
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 350);
  };

  // Start on link click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto")) return;
      start();
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Finish on route change
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      finish();
    }
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 z-[9999] h-[3px] w-full bg-accent pointer-events-none origin-left"
      style={{ transform: `scaleX(${width / 100})`, transition: "transform 0.15s ease" }}
    />
  );
}

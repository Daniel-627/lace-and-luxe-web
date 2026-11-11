"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Re-checks the order every 5s (up to 3 minutes) while payment is pending. */
export default function AutoRefresh({ active }: { active: boolean }) {
  const router = useRouter();
  useEffect(() => {
    if (!active) return;
    let n = 0;
    const t = setInterval(() => { if (++n > 36) clearInterval(t); else router.refresh(); }, 5000);
    return () => clearInterval(t);
  }, [active, router]);
  return null;
}

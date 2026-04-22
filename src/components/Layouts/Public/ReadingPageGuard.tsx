"use client";

import { usePathname } from "next/navigation";

interface ReadingPageGuardProps {
  children: React.ReactNode;
}

export function ReadingPageGuard({ children }: ReadingPageGuardProps) {
  const pathname = usePathname();
  if (pathname?.includes("/chapters/")) return null;
  return <>{children}</>;
}

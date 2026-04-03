import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content - no header, no sidebar, just slot */}
      <main className="flex-1">{children}</main>
    </div>
  );
}







import { Suspense } from "react";
import { getSystemConfig } from "@/lib/api/public/general";
import { getPublicMenus } from "@/lib/api/public/menu";
import { PublicHeader, PublicFooter, PublicLayoutWrapper } from "@/components/Layouts/Public";

/**
 * Async Server Components để fetch data không blocking children
 */
async function AsyncHeaderFooter({ children }: { children: React.ReactNode }) {
  const [systemConfig, menus] = await Promise.all([
    getSystemConfig("general"),
    getPublicMenus()
  ]);

  return (
    <PublicLayoutWrapper
      contactChannels={systemConfig?.contact_channels}
      header={<PublicHeader key="header" systemConfig={systemConfig} initialMenus={menus} />}
      footer={<PublicFooter key="footer" systemConfig={systemConfig} />}
    >
      {children}
    </PublicLayoutWrapper>
  );
}

/**
 * Layout skeleton hiện khi data đang fetch
 */
function LayoutSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header skeleton */}
      <div className="h-20 bg-white border-b border-gray-100 animate-pulse">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="hidden md:flex gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-16 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* Main content - render ngay, không chờ header/footer */}
      <main className="flex-1 min-h-screen pt-20">
        {children}
      </main>
    </div>
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LayoutSkeleton>{children}</LayoutSkeleton>}>
      <AsyncHeaderFooter>{children}</AsyncHeaderFooter>
    </Suspense>
  );
}

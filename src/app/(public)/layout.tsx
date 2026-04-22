import { Suspense } from "react";
import { getSystemConfig } from "@/lib/api/public/general";
import { getPublicMenus } from "@/lib/api/public/menu";
import { PublicHeader, PublicFooter } from "@/components/Layouts/Public";
import FloatingContactChannels from "@/components/Layouts/Public/contact-channels/FloatingContactChannels";
import { BackToTop } from "@/components/UI/Navigation/BackToTop";
import ErrorBoundary from "@/components/UI/Feedback/ErrorBoundary";
import { ReadingPageGuard } from "@/components/Layouts/Public/ReadingPageGuard";

// Async Server Component — fetch header data
async function AsyncHeader() {
  const [systemConfig, menus] = await Promise.all([
    getSystemConfig("general"),
    getPublicMenus(),
  ]);
  return <PublicHeader systemConfig={systemConfig} initialMenus={menus} />;
}

// Async Server Component — fetch footer data (React.cache() deduplicates getSystemConfig)
async function AsyncFooter() {
  const systemConfig = await getSystemConfig("general");
  return <PublicFooter systemConfig={systemConfig} />;
}

// Async Server Component — fetch floating contact channels
async function AsyncFloatingChannels() {
  const systemConfig = await getSystemConfig("general");
  return (
    <FloatingContactChannels
      channels={systemConfig?.contact_channels as Parameters<typeof FloatingContactChannels>[0]["channels"]}
    />
  );
}

// Skeleton cho header khi đang load
function HeaderSkeleton() {
  return (
    <div className="h-20 bg-white border-b border-gray-100 animate-pulse fixed top-0 left-0 right-0 z-50">
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
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header — independent Suspense, không block children */}
      <Suspense fallback={<HeaderSkeleton />}>
        <AsyncHeader />
      </Suspense>

      {/* Main content — render ngay, không chờ header hay footer */}
      <main className="flex-1 min-h-screen pt-20">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>

      {/* Footer + floating channels — ẩn trên trang đọc truyện */}
      <ReadingPageGuard>
        <Suspense fallback={null}>
          <AsyncFooter />
        </Suspense>
        <Suspense fallback={null}>
          <AsyncFloatingChannels />
        </Suspense>
        <BackToTop />
      </ReadingPageGuard>
    </div>
  );
}

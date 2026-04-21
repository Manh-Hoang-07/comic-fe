import { Suspense } from "react";
import { getSystemConfig } from "@/lib/api/public/general";
import { getPublicMenus } from "@/lib/api/public/menu";
import { PublicHeader, PublicFooter, PublicLayoutWrapper } from "@/components/Layouts/Public";
import ErrorBoundary from "@/components/UI/Feedback/ErrorBoundary";

async function AsyncHeaderFooter({ children }: { children: React.ReactNode }) {
  const [systemConfig, menus] = await Promise.all([
    getSystemConfig("general"),
    getPublicMenus(),
  ]);

  return (
    <PublicLayoutWrapper
      contactChannels={systemConfig?.contact_channels ?? {}}
      header={
        <PublicHeader
          key="header"
          systemConfig={systemConfig}
          initialMenus={menus}
        />
      }
      footer={<PublicFooter key="footer" systemConfig={systemConfig} />}
    >
      {children}
    </PublicLayoutWrapper>
  );
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <AsyncHeaderFooter>
        <ErrorBoundary>{children}</ErrorBoundary>
      </AsyncHeaderFooter>
    </Suspense>
  );
}

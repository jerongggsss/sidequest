import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { StudioSidebar, StudioMobileNav } from "@/components/studio/StudioSidebar";

export default async function StudioLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Desktop sidebar */}
      <div className="hidden w-56 shrink-0 md:block">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <StudioSidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <StudioMobileNav />
    </div>
  );
}

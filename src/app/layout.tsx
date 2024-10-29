"use client";

import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb } from "@/components/breadcrumbs";
import { usePathname } from "next/navigation";
import { Metadata } from "@/app/metadata";

function BreadcrumbWrapper() {
  const pathname = usePathname();

  const breadcrumbItems = [{ label: "Home", href: "/" }];

  if (pathname === "/social-media-generator") {
    breadcrumbItems.push({
      label: "Social Media Generator",
      href: "/social-media-generator",
    });
  }

  if (pathname === "/region-code") {
    breadcrumbItems.push({
      label: "Region code",
      href: "/region-code",
    });
  }

  return <Breadcrumb items={breadcrumbItems} />;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <div className="flex w-screen h-screen">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center space-x-2 p-4 border-b">
                <SidebarTrigger />
                <BreadcrumbWrapper />
              </header>
              <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}

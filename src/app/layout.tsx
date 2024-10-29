import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "TMX-CONTENT GENERATOR",
  description: "CREATED BY AURAMEOW",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <AppSidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <header className="flex items-center justify-between p-4 border-b">
              <Breadcrumb
                items={[
                  { label: "Home", href: "/" },
                  { label: "Content Generator", href: "/content-generator" },
                ]}
              />
            </header>
            <main className="flex-1 overflow-auto p-6">{children}</main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}

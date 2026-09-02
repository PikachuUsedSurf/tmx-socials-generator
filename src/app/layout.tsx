import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb } from "@/components/breadcrumbs";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { HeaderBreadcrumb } from "@/components/header-breadcrumb";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SidebarProvider>
            <div className="flex w-screen h-screen">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center gap-2 p-4 border-b">
                  <SidebarTrigger />
                  <HeaderBreadcrumb />
                  <div className="ml-auto">
                    <ThemeToggle />
                  </div>
                </header>
                <main className="flex-1 overflow-auto p-6">{children}</main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

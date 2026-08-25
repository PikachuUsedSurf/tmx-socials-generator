"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumbs";

const TITLES: Record<string, string> = {
  "/social-media-generator": "Copy Pasta",
  "/social-media-poster": "Social Media Poster",
  "/commodity-price": "Commodity Price Generator",
  "/region-code": "Region Codes",
  "/dashboard": "Dashboard",
};

export function HeaderBreadcrumb() {
  const pathname = usePathname();

  const breadcrumbItems = [{ label: "Home", href: "/" }];
  const title = TITLES[pathname];
  if (title) {
    breadcrumbItems.push({ label: title, href: pathname });
  }

  return <Breadcrumb items={breadcrumbItems} />;
}

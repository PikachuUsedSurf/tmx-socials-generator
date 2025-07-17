"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  CircleFadingPlus,
  LayoutGrid,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "tmx",
    email: "generator",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "TMX",
      logo: GalleryVerticalEnd,
      plan: "Generator",
    },
  ],
  navMain: [
    {
      title: "Copy pasta",
      url: "/social-media-generator",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Copy Pasta",
          url: "/social-media-generator",
        },
        {      
          title: "Social Media Poster",
          url: "/social-media-poster",
        },
        {
          title: "Region Codes",
          url: "/region-code",
        },
        {
          title: "Commodity Price Generator",
          url: "#",
        },
      ],
    },
    {
      title: "Manegement",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Locations Manager",
          url: "#",
        },
        {
          title: "Crop Manager",
          url: "#",
        },
      ],
    },
  ],
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">TMX</span>
                  <span className="truncate text-xs">Lazyness is Happiness</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
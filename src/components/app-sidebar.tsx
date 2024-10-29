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
    // {
    //   title: "Home",
    //   url: "/",
    //   icon: LayoutGrid,
    //   isActive: true,
    // },
    {
      title: "Social Media Generator",
      url: "/social-media-generator",
      icon: CircleFadingPlus,
      items: [
        {
          title: "Copy Pasta",
          url: "/social-media-generator",
        },
        {
          title: "Commodity Price Generator",
          url: "/commodity-price-generator",
        },
      ],
    },
    {
      title: "Region Codes",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Region Codes",
          url: "/region-code",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
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

"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Users,
  CalendarPlus,
  BookOpenCheck,
  ClipboardList,
  CalendarClock,
  FileText,
  IndianRupee,
  Clock,
  Video,
  DoorOpen,
  BadgeCheck,
  LayoutDashboard,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";

import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = {
    user: {
      name: "user.branch",
      email: "user.email",
    },
    teams: [
      {
        name: "Ranchi",
        logo: GalleryVerticalEnd,
        plan: "Health Care",
      },
      {
        name: "Patna",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Kolkata",
        logo: Command,
        plan: "Free",
      },
      {
        name: "Gaur City",
        logo: Command,
        plan: "Free",
      },
      {
        name: "Spectrum",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        isActive: true,
        url1: "/",
      },
      {
        title: "Queue Token",
        url1: "",
        icon: ClipboardList,
        isActive: false,
        items: [
          { title: "Manage Token", url: "/queue-token/manage" },
          { title: "Token History", url: "/queue-token/history" },
        ],
      },
      {
        title: "Appointment",
        url1: "",
        icon: CalendarPlus,
        items: [
          { title: "Book Appointment", url: "/appointment/book" },
          { title: "Manage Appointment", url: "/appointment/manage" },
        ],
      },
      {
        title: "Patients",
        url1: "",
        icon: Users,
        items: [{ title: "Manage Patients", url: "/patients/manage" }],
      },
      {
        title: "Next Appointment",
        url1: "",
        icon: CalendarClock,
        items: [
          {
            title: "List of Appointments",
            url: "/next-appointment/list",
          },
        ],
      },
      {
        title: "Lead",
        icon: LayoutDashboard,
        isActive: true,
        url1: "/lead",
      },
      {
        title: "Report",
        url1: "",
        icon: FileText,
        items: [
          { title: "Appointment Report", url: "/report/appointment" },
          { title: "Payment Report", url: "/report/payment" },
        ],
      },
      {
        title: "Holiday",
        url1: "",
        icon: BookOpenCheck,
        items: [{ title: "Manage Holiday", url: "/holiday/manage" }],
      },
      {
        title: "Fee Plan",
        url1: "",
        icon: IndianRupee,
        items: [{ title: "Manage & Add", url: "/fee-plan/manage" }],
      },
      {
        title: "Time Slot",
        url1: "",
        icon: Clock,
        items: [{ title: "Manage & Add", url: "/time-slot/manage" }],
      },
      {
        title: "Video Consultation",
        url1: "",
        icon: Video,
        items: [
          {
            title: "Queue Token",
            url: "/video-consultation/queue-token",
          },
          {
            title: "Appointment",
            url: "/video-consultation/appointment",
          },
          {
            title: "Next Appointment",
            url: "/video-consultation/next-appointment",
          },
          { title: "Report", url: "/video-consultation/report" },
          {
            title: "Fees Plan",
            url: "/video-consultation/fees-plan",
          },
          {
            title: "Time Slot",
            url: "/video-consultation/time-slot",
          },
          {
            title: "Update Appointment",
            url: "/video-consultation/update",
          },
        ],
      },
      {
        title: "Gate Entry",
        url1: "",
        icon: DoorOpen,
        items: [
          { title: "Token List", url: "/gate-entry/tokens" },
          {
            title: "Next Day Appointment",
            url: "/gate-entry/next-appointments",
          },
        ],
      },
      {
        title: "Token Show",
        url1: "",
        icon: BadgeCheck,
        items: [{ title: "List of Patients", url: "/token-show/list" }],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser User={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

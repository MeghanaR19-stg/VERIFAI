// Main navigation for the VERIFAI console.
import type { LucideIcon } from "lucide-react";
import {
  FileStack,
  FolderOpen,
  LayoutDashboard,
  ScrollText,
  Settings,
  ShieldCheck,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    to: "/",
    label: "Overview",
    icon: LayoutDashboard,
    end: true,
    description: "Command Center",
  },
  {
    to: "/tenders",
    label: "Tenders",
    icon: FolderOpen,
    description: "Tender records and requirements",
  },
  {
    to: "/bids",
    label: "Bids",
    icon: FileStack,
    description: "Bidder submissions and documents",
  },
  {
    to: "/verification",
    label: "Verification",
    icon: ShieldCheck,
    description: "Simulated government source checks",
  },
  {
    to: "/audit",
    label: "Audit",
    icon: ScrollText,
    description: "Chronological event trail",
  },
];

export const SETTINGS_ITEM: NavItem = {
  to: "/settings",
  label: "Settings",
  icon: Settings,
  description: "Demo mode and prototype limits",
};

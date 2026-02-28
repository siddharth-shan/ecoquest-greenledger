import type { SustainabilityTag } from "@/types/budget";

export const CERRITOS_POPULATION = 51460;
export const APP_NAME = "EcoQuest GreenLedger";
export const APP_TAGLINE = "Follow the Money, Improve the Environment";

export const SUSTAINABILITY_TAG_CONFIG: Record<
  SustainabilityTag,
  { label: string; color: string; bgColor: string; icon: string }
> = {
  parks: {
    label: "Parks & Greening",
    color: "var(--tag-parks)",
    bgColor: "var(--tag-parks-bg)",
    icon: "TreePine",
  },
  waste: {
    label: "Waste & Recycling",
    color: "var(--tag-waste)",
    bgColor: "var(--tag-waste-bg)",
    icon: "Recycle",
  },
  water: {
    label: "Water Conservation",
    color: "var(--tag-water)",
    bgColor: "var(--tag-water-bg)",
    icon: "Droplets",
  },
  energy: {
    label: "Energy & Facilities",
    color: "var(--tag-energy)",
    bgColor: "var(--tag-energy-bg)",
    icon: "Zap",
  },
  streets: {
    label: "Streets & Transit",
    color: "var(--tag-streets)",
    bgColor: "var(--tag-streets-bg)",
    icon: "Route",
  },
  general: {
    label: "General",
    color: "var(--tag-general)",
    bgColor: "var(--tag-general-bg)",
    icon: "Building2",
  },
};

export const CHART_COLORS = [
  "#34a853",
  "#00a8e1",
  "#f57c00",
  "#fbbc04",
  "#a855f7",
  "#ef4444",
  "#6b7280",
  "#ec4899",
];

export const NAV_ITEMS = [
  { label: "Home", href: "/", icon: "Home" },
  { label: "Challenges", href: "/challenges", icon: "Trophy" },
  { label: "Impact", href: "/impact", icon: "BarChart3" },
  { label: "Cerritos Hub", href: "/hub", icon: "Landmark" },
  { label: "Profile", href: "/profile", icon: "User" },
] as const;

export const HUB_NAV_ITEMS = [
  { label: "Budget Explorer", href: "/hub/budget", icon: "PieChart" },
  { label: "Scorecards", href: "/hub/scorecards", icon: "ClipboardCheck" },
  { label: "Priorities", href: "/hub/priorities", icon: "ListOrdered" },
  { label: "Civic Actions", href: "/hub/civic", icon: "Megaphone" },
  { label: "Sources", href: "/hub/sources", icon: "FileText" },
] as const;

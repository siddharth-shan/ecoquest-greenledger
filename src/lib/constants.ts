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
  "#1a365d",
  "#2b7a78",
  "#c05621",
  "#d69e2e",
  "#6b46c1",
  "#c53030",
  "#4a5568",
  "#b83280",
];

export const NAV_ITEMS = [
  { label: "Home", href: "/", icon: "Home" },
  { label: "Cerritos Hub", href: "/hub", icon: "Landmark" },
  { label: "Report", href: "/report", icon: "FileText" },
] as const;

export const HUB_NAV_GROUPS = [
  {
    label: "Money & Budget",
    icon: "Banknote",
    items: [
      { label: "Budget Overview", href: "/hub/budget", icon: "PieChart", description: "City spending by department with 10-year trends" },
      { label: "Your Tax Dollar", href: "/hub/tax-dollar", icon: "Receipt", description: "See exactly where your tax dollars go" },
      { label: "Simulator", href: "/hub/simulator", icon: "SlidersHorizontal", description: "Drag sliders to reshape the city budget" },
      { label: "Budget Q&A", href: "/hub/ask", icon: "MessageCircleQuestion", description: "Ask AI questions about the Cerritos budget" },
    ],
  },
  {
    label: "Sustainability",
    icon: "Leaf",
    items: [
      { label: "Scorecards", href: "/hub/scorecards", icon: "ClipboardCheck", description: "Track city sustainability metrics" },
      { label: "Water Finance", href: "/hub/water-finance", icon: "Droplets", description: "Recycled water program saving 722M gal/year" },
      { label: "Energy & Solar", href: "/hub/energy-literacy", icon: "Zap", description: "City solar and energy efficiency programs" },
      { label: "Urban Forest", href: "/hub/urban-forest", icon: "TreePine", description: "28,000+ city trees and urban canopy data" },
      { label: "Transit", href: "/hub/transit", icon: "Bus", description: "Transportation mode shift calculator" },
    ],
  },
  {
    label: "Community",
    icon: "Users",
    items: [
      { label: "Priorities", href: "/hub/priorities", icon: "ListOrdered", description: "Rank what matters most to Cerritos" },
      { label: "Strategic Plan", href: "/hub/strategic-plan", icon: "Building2", description: "City goals and progress alignment" },
      { label: "Get Involved", href: "/hub/civic", icon: "Megaphone", description: "Meeting schedule and participation guide" },
    ],
  },
] as const;

export const HUB_SOURCES_LINK = {
  label: "Sources",
  href: "/hub/sources",
  icon: "FileText",
} as const;

export const DEPARTMENT_COLORS: Record<string, string> = {
  "community-safety": "#9B2C2C",
  "public-works": "#2B6CB0",
  "community-cultural-services": "#276749",
  "theater": "#6B46C1",
  "administrative-services": "#B7791F",
  "community-development": "#2C7A7B",
  "legislative-admin": "#4A5568",
};

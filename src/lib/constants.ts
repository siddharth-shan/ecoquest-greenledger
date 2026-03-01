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
  { label: "Challenges", href: "/challenges", icon: "Trophy" },
  { label: "Impact", href: "/impact", icon: "BarChart3" },
  { label: "Cerritos Hub", href: "/hub", icon: "Landmark" },
  { label: "Profile", href: "/profile", icon: "User" },
] as const;

export const HUB_NAV_ITEMS = [
  { label: "Budget Explorer", href: "/hub/budget", icon: "PieChart" },
  { label: "Tax Dollar", href: "/hub/tax-dollar", icon: "Receipt" },
  { label: "Simulator", href: "/hub/simulator", icon: "SlidersHorizontal" },
  { label: "Green Wallet", href: "/hub/green-wallet", icon: "Wallet" },
  { label: "Green Bonds", href: "/hub/green-bonds", icon: "Landmark" },
  { label: "Scorecards", href: "/hub/scorecards", icon: "ClipboardCheck" },
  { label: "Priorities", href: "/hub/priorities", icon: "ListOrdered" },
  { label: "Strategic Plan", href: "/hub/strategic-plan", icon: "Building2" },
  { label: "Water Finance", href: "/hub/water-finance", icon: "Droplets" },
  { label: "Energy Literacy", href: "/hub/energy-literacy", icon: "Zap" },
  { label: "Transit", href: "/hub/transit", icon: "Bus" },
  { label: "Urban Forest", href: "/hub/urban-forest", icon: "TreePine" },
  { label: "Recycling Quiz", href: "/hub/recycling-quiz", icon: "Recycle" },
  { label: "Civic Actions", href: "/hub/civic", icon: "Megaphone" },
  { label: "Sources", href: "/hub/sources", icon: "FileText" },
] as const;

export const DEPARTMENT_COLORS: Record<string, string> = {
  "community-safety": "#9B2C2C",
  "public-works": "#2B6CB0",
  "community-cultural-services": "#276749",
  "theater": "#6B46C1",
  "administrative-services": "#B7791F",
  "community-development": "#2C7A7B",
  "legislative-admin": "#4A5568",
};

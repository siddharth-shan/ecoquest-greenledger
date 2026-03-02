import Link from "next/link";
import {
  Banknote,
  Leaf,
  Users,
  FileText,
  PieChart,
  Receipt,
  SlidersHorizontal,
  MessageCircleQuestion,
  Lightbulb,
  TrendingUp,
  ClipboardCheck,
  Droplets,
  Zap,
  TreePine,
  Bus,
  ListOrdered,
  Building2,
  Megaphone,
} from "lucide-react";
import { HUB_NAV_GROUPS, HUB_SOURCES_LINK } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  Banknote,
  Leaf,
  Users,
  FileText,
  PieChart,
  Receipt,
  SlidersHorizontal,
  MessageCircleQuestion,
  Lightbulb,
  TrendingUp,
  ClipboardCheck,
  Droplets,
  Zap,
  TreePine,
  Bus,
  ListOrdered,
  Building2,
  Megaphone,
};

const groupColors: Record<string, { bg: string; border: string; icon: string }> = {
  "Money & Budget": { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-600" },
  Sustainability: { bg: "bg-emerald-50", border: "border-emerald-200", icon: "text-emerald-600" },
  Community: { bg: "bg-amber-50", border: "border-amber-200", icon: "text-amber-600" },
};

export default function HubPage() {
  return (
    <div className="container-custom section-padding">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Cerritos Hub
        </h1>
        <p className="text-gray-600 mb-8">
          Explore city finances, sustainability programs, and ways to get
          involved in your community.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {HUB_NAV_GROUPS.map((group) => {
            const GroupIcon = iconMap[group.icon];
            const colors = groupColors[group.label];
            return (
              <div
                key={group.label}
                className={`rounded-xl border ${colors.border} ${colors.bg} p-5`}
              >
                <div className="flex items-center gap-2 mb-4">
                  {GroupIcon && (
                    <GroupIcon className={`w-5 h-5 ${colors.icon}`} />
                  )}
                  <h2 className="text-lg font-semibold text-gray-900">
                    {group.label}
                  </h2>
                </div>
                <ul className="space-y-2">
                  {group.items.map((item) => {
                    const ItemIcon = iconMap[item.icon];
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="flex items-start gap-2.5 p-2 -mx-2 rounded-lg hover:bg-white/60 transition-colors group"
                        >
                          {ItemIcon && (
                            <ItemIcon className="w-4 h-4 mt-0.5 text-gray-400 group-hover:text-gray-600 shrink-0" />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.label}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Sources link */}
        <div className="mt-6 text-center">
          <Link
            href={HUB_SOURCES_LINK.href}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            View all data sources and citations
          </Link>
        </div>
      </div>
    </div>
  );
}

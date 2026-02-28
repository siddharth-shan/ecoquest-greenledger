"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PieChart,
  ClipboardCheck,
  ListOrdered,
  Megaphone,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HUB_NAV_ITEMS } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  PieChart,
  ClipboardCheck,
  ListOrdered,
  Megaphone,
  FileText,
};

export default function HubSubNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 md:top-16 z-40">
      <div className="container-custom">
        <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide -mx-4 px-4">
          {HUB_NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0",
                  isActive
                    ? "bg-eco-green text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

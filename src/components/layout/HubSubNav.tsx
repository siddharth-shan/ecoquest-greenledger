"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Banknote,
  Leaf,
  Users,
  FileText,
  PieChart,
  Receipt,
  SlidersHorizontal,
  Wallet,
  Landmark,
  ClipboardCheck,
  Droplets,
  Zap,
  TreePine,
  Bus,
  Recycle,
  ListOrdered,
  Building2,
  Megaphone,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HUB_NAV_GROUPS, HUB_SOURCES_LINK } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  Banknote,
  Leaf,
  Users,
  FileText,
  PieChart,
  Receipt,
  SlidersHorizontal,
  Wallet,
  Landmark,
  ClipboardCheck,
  Droplets,
  Zap,
  TreePine,
  Bus,
  Recycle,
  ListOrdered,
  Building2,
  Megaphone,
};

export default function HubSubNav() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenGroup(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setOpenGroup(null);
  }, [pathname]);

  function isGroupActive(group: (typeof HUB_NAV_GROUPS)[number]) {
    return group.items.some((item) => pathname === item.href);
  }

  return (
    <div
      ref={navRef}
      className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 md:top-16 z-40"
    >
      <div className="container-custom">
        <div className="flex items-center gap-1 py-2">
          {HUB_NAV_GROUPS.map((group) => {
            const GroupIcon = iconMap[group.icon];
            const active = isGroupActive(group);
            const isOpen = openGroup === group.label;

            return (
              <div key={group.label} className="relative">
                <button
                  onClick={() =>
                    setOpenGroup(isOpen ? null : group.label)
                  }
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200",
                    active
                      ? "bg-civic-primary text-white shadow-sm"
                      : isOpen
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {GroupIcon && <GroupIcon className="w-4 h-4" />}
                  {group.label}
                  <ChevronDown
                    className={cn(
                      "w-3 h-3 transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Dropdown panel */}
                {isOpen && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    {group.items.map((item) => {
                      const ItemIcon = iconMap[item.icon];
                      const itemActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-start gap-3 px-4 py-3 transition-colors",
                            itemActive
                              ? "bg-civic-primary-light"
                              : "hover:bg-gray-50"
                          )}
                        >
                          {ItemIcon && (
                            <ItemIcon
                              className={cn(
                                "w-5 h-5 mt-0.5 shrink-0",
                                itemActive
                                  ? "text-civic-primary"
                                  : "text-gray-400"
                              )}
                            />
                          )}
                          <div>
                            <div
                              className={cn(
                                "text-sm font-medium",
                                itemActive
                                  ? "text-civic-primary-dark"
                                  : "text-gray-900"
                              )}
                            >
                              {item.label}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Sources — direct link */}
          {(() => {
            const SourceIcon = iconMap[HUB_SOURCES_LINK.icon];
            const sourceActive = pathname === HUB_SOURCES_LINK.href;
            return (
              <Link
                href={HUB_SOURCES_LINK.href}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200",
                  sourceActive
                    ? "bg-civic-primary text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {SourceIcon && <SourceIcon className="w-4 h-4" />}
                {HUB_SOURCES_LINK.label}
              </Link>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

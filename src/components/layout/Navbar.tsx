"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, BarChart3, Landmark, User, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  Home,
  Trophy,
  BarChart3,
  Landmark,
  User,
};

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:block sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="container-custom flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-eco flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading font-bold text-lg">
            <span className="text-eco-green">Eco</span>
            <span className="text-eco-blue">Quest</span>
            <span className="text-gray-700 ml-1 font-semibold text-sm">
              GreenLedger
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-eco-green-light text-eco-green-dark"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

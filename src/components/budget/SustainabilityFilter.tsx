"use client";

import { cn } from "@/lib/utils";
import type { SustainabilityTag } from "@/types/budget";
import {
  TreePine,
  Recycle,
  Droplets,
  Zap,
  Route,
  LayoutGrid,
} from "lucide-react";

const filterOptions: {
  tag: SustainabilityTag | "all";
  label: string;
  icon: React.ElementType;
  color: string;
  activeColor: string;
}[] = [
  {
    tag: "all",
    label: "All",
    icon: LayoutGrid,
    color: "text-gray-500",
    activeColor: "bg-gray-800 text-white",
  },
  {
    tag: "parks",
    label: "Parks",
    icon: TreePine,
    color: "text-tag-parks",
    activeColor: "bg-tag-parks text-white",
  },
  {
    tag: "waste",
    label: "Waste",
    icon: Recycle,
    color: "text-tag-waste",
    activeColor: "bg-tag-waste text-white",
  },
  {
    tag: "water",
    label: "Water",
    icon: Droplets,
    color: "text-tag-water",
    activeColor: "bg-tag-water text-white",
  },
  {
    tag: "energy",
    label: "Energy",
    icon: Zap,
    color: "text-tag-energy",
    activeColor: "bg-tag-energy text-white",
  },
  {
    tag: "streets",
    label: "Streets",
    icon: Route,
    color: "text-tag-streets",
    activeColor: "bg-tag-streets text-white",
  },
];

interface SustainabilityFilterProps {
  activeFilters: SustainabilityTag[];
  onFilterChange: (filters: SustainabilityTag[]) => void;
}

export default function SustainabilityFilter({
  activeFilters,
  onFilterChange,
}: SustainabilityFilterProps) {
  const handleClick = (tag: SustainabilityTag | "all") => {
    if (tag === "all") {
      onFilterChange([]);
    } else if (activeFilters.includes(tag)) {
      onFilterChange(activeFilters.filter((f) => f !== tag));
    } else {
      onFilterChange([...activeFilters, tag]);
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {filterOptions.map((opt) => {
        const Icon = opt.icon;
        const isActive =
          opt.tag === "all"
            ? activeFilters.length === 0
            : activeFilters.includes(opt.tag as SustainabilityTag);

        return (
          <button
            key={opt.tag}
            onClick={() => handleClick(opt.tag)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer",
              isActive
                ? opt.activeColor + " shadow-sm"
                : "bg-gray-100 " + opt.color + " hover:bg-gray-200"
            )}
          >
            <Icon className="w-4 h-4" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

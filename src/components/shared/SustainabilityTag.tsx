import { cn } from "@/lib/utils";
import type { SustainabilityTag as TagType } from "@/types/budget";

const tagStyles: Record<TagType, string> = {
  parks: "bg-tag-parks-bg text-tag-parks",
  waste: "bg-tag-waste-bg text-tag-waste",
  water: "bg-tag-water-bg text-tag-water",
  energy: "bg-tag-energy-bg text-tag-energy",
  streets: "bg-tag-streets-bg text-tag-streets",
  general: "bg-tag-general-bg text-tag-general",
};

const tagLabels: Record<TagType, string> = {
  parks: "Parks",
  waste: "Waste",
  water: "Water",
  energy: "Energy",
  streets: "Streets",
  general: "General",
};

interface SustainabilityTagProps {
  tag: TagType;
  size?: "sm" | "md";
  className?: string;
}

export default function SustainabilityTag({
  tag,
  size = "sm",
  className,
}: SustainabilityTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        tagStyles[tag],
        className
      )}
    >
      {tagLabels[tag]}
    </span>
  );
}

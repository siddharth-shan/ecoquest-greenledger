import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariantStyles = {
  default: "bg-gray-100 text-gray-700",
  parks: "bg-tag-parks-bg text-tag-parks",
  waste: "bg-tag-waste-bg text-tag-waste",
  water: "bg-tag-water-bg text-tag-water",
  energy: "bg-tag-energy-bg text-tag-energy",
  streets: "bg-tag-streets-bg text-tag-streets",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
} as const;

const badgeSizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
} as const;

export type BadgeVariant = keyof typeof badgeVariantStyles;
export type BadgeSize = keyof typeof badgeSizeStyles;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

function Badge({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full whitespace-nowrap",
        badgeVariantStyles[variant],
        badgeSizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };

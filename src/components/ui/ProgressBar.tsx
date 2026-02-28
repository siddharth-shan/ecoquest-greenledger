import { cn } from "@/lib/utils";

const colorStyles = {
  "eco-green": "bg-eco-green",
  "eco-green-dark": "bg-eco-green-dark",
  "eco-blue": "bg-eco-blue",
  "eco-blue-dark": "bg-eco-blue-dark",
  "eco-yellow": "bg-eco-yellow",
  "eco-orange": "bg-eco-orange",
} as const;

const sizeStyles = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
} as const;

export type ProgressBarColor = keyof typeof colorStyles;
export type ProgressBarSize = keyof typeof sizeStyles;

export interface ProgressBarProps {
  value: number;
  max?: number;
  color?: ProgressBarColor;
  size?: ProgressBarSize;
  showLabel?: boolean;
  className?: string;
}

function ProgressBar({
  value,
  max = 100,
  color = "eco-green",
  size = "md",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-gray-700">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full bg-gray-200 overflow-hidden",
          sizeStyles[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            colorStyles[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export { ProgressBar };

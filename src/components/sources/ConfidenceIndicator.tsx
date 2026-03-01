import { cn } from "@/lib/utils";
import type { ConfidenceLevel } from "@/types/budget";

const styles: Record<ConfidenceLevel, string> = {
  high: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-red-100 text-red-700",
};

const labels: Record<ConfidenceLevel, string> = {
  high: "High Confidence",
  medium: "Medium Confidence",
  low: "Low Confidence",
};

interface ConfidenceIndicatorProps {
  level: ConfidenceLevel;
  className?: string;
}

export default function ConfidenceIndicator({
  level,
  className,
}: ConfidenceIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        styles[level],
        className
      )}
    >
      {labels[level]}
    </span>
  );
}

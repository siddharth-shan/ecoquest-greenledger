import { cn } from "@/lib/utils";

const styles = {
  current: "bg-green-100 text-green-700",
  recent: "bg-yellow-100 text-yellow-700",
  historical: "bg-gray-100 text-gray-500",
};

const labels = {
  current: "Current",
  recent: "Recent",
  historical: "Historical",
};

interface FreshnessLabelProps {
  level: "current" | "recent" | "historical";
  className?: string;
}

export default function FreshnessLabel({
  level,
  className,
}: FreshnessLabelProps) {
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

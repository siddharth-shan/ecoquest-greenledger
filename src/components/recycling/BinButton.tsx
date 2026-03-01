"use client";

import { Recycle, Leaf, Trash2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Recycle,
  Leaf,
  Trash2,
};

interface BinButtonProps {
  binId: string;
  binName: string;
  color: string;
  icon: string;
  onClick: () => void;
  disabled: boolean;
  feedback: "correct" | "incorrect" | null;
}

export default function BinButton({
  binName,
  color,
  icon,
  onClick,
  disabled,
  feedback,
}: BinButtonProps) {
  const Icon = iconMap[icon] || Trash2;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 min-w-[100px]",
        feedback === "correct" && "border-green-500 bg-green-50 ring-2 ring-green-200",
        feedback === "incorrect" && "border-red-500 bg-red-50 ring-2 ring-red-200",
        !feedback && !disabled && "border-gray-200 hover:border-gray-400 hover:shadow-md cursor-pointer",
        !feedback && disabled && "border-gray-100 opacity-50 cursor-not-allowed"
      )}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: color + "20" }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <span className="text-xs font-medium text-gray-700">{binName}</span>

      {feedback === "correct" && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
      {feedback === "incorrect" && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <X className="w-4 h-4 text-white" />
        </div>
      )}
    </button>
  );
}

import Link from "next/link";
import {
  Droplets,
  Timer,
  TreePine,
  Sprout,
  SearchCheck,
  Clock,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SustainabilityTag from "@/components/shared/SustainabilityTag";
import type { Challenge, ChallengeStatus } from "@/types/challenge";

const iconMap: Record<string, React.ElementType> = {
  Droplets,
  Timer,
  TreePine,
  Sprout,
  SearchCheck,
};

const difficultyColors = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

interface ChallengeCardProps {
  challenge: Challenge;
  status?: ChallengeStatus;
}

export default function ChallengeCard({
  challenge,
  status = "available",
}: ChallengeCardProps) {
  const Icon = iconMap[challenge.icon] || Star;

  return (
    <Link href={`/challenges/${challenge.id}`}>
      <div
        className={cn(
          "bg-white rounded-xl border p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer",
          status === "completed"
            ? "border-eco-green/30 bg-eco-green-light/30"
            : "border-gray-100"
        )}
      >
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor:
                status === "completed" ? "#dcfce7" : "#f3f4f6",
            }}
          >
            <Icon
              className={cn(
                "w-6 h-6",
                status === "completed" ? "text-eco-green" : "text-gray-500"
              )}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                difficultyColors[challenge.difficulty]
              )}
            >
              {challenge.difficulty}
            </span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-1">
          {challenge.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {challenge.shortDescription}
        </p>

        <div className="flex items-center justify-between">
          <SustainabilityTag tag={challenge.sustainabilityTag} />
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {challenge.estimatedMinutes}m
            </span>
            <span className="flex items-center gap-1 font-semibold text-eco-green">
              <Star className="w-3.5 h-3.5" />
              {challenge.pointsReward}pts
            </span>
          </div>
        </div>

        {status === "completed" && (
          <div className="mt-3 pt-3 border-t border-eco-green/20">
            <span className="text-xs font-medium text-eco-green">
              ✓ Completed
            </span>
          </div>
        )}
        {status === "in_progress" && (
          <div className="mt-3 pt-3 border-t border-yellow-200">
            <span className="text-xs font-medium text-yellow-600">
              ● In Progress
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

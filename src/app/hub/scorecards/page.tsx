import {
  ClipboardCheck,
  TreePine,
  Recycle,
  Droplets,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import SustainabilityTag from "@/components/shared/SustainabilityTag";
import scorecardData from "@/data/scorecards/scorecards.json";
import type { Scorecard } from "@/types/scorecard";

const scorecards = scorecardData.scorecards as unknown as Scorecard[];

const iconMap: Record<string, React.ElementType> = {
  TreePine,
  Recycle,
  Droplets,
};

const trendIcon = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
};

export const metadata = {
  title: "Scorecards — EcoQuest GreenLedger",
};

export default function ScorecardsPage() {
  return (
    <div className="container-custom py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-civic-accent-light flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5 text-civic-accent" />
          </div>
          <h1 className="section-title mb-0">Sustainability Scorecards</h1>
        </div>
        <p className="text-gray-500 text-sm">
          How is Cerritos doing on key sustainability programs? Check the data.
        </p>
        <div className="section-underline mt-3" />
      </div>

      <div className="grid gap-6">
        {scorecards.map((sc) => {
          const Icon = iconMap[sc.icon] || ClipboardCheck;
          return (
            <div
              key={sc.id}
              className="bg-white rounded-xl border border-gray-100 p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-civic-primary-light flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-civic-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading font-bold text-lg">
                      {sc.title}
                    </h2>
                    <SustainabilityTag tag={sc.sustainabilityTag} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{sc.tldr}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {sc.metrics.map((m, i) => {
                  const TrendIcon = trendIcon[m.trend];
                  return (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-lg p-3 text-center"
                    >
                      <p className="text-2xl font-bold text-gray-900">
                        {m.value}
                        <span className="text-sm font-normal text-gray-400 ml-0.5">
                          {m.unit}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{m.label}</p>
                      {m.target && (
                        <p className="text-xs text-gray-400">
                          Target: {m.target} {m.unit}
                        </p>
                      )}
                      <div className="flex items-center justify-center gap-0.5 mt-1">
                        <TrendIcon
                          className={`w-3 h-3 ${
                            m.trend === "up"
                              ? "text-green-500"
                              : m.trend === "down"
                                ? "text-red-500"
                                : "text-gray-400"
                          }`}
                        />
                        {m.yearOverYearChange && (
                          <span className="text-xs text-gray-500">
                            {m.yearOverYearChange > 0 ? "+" : ""}
                            {m.yearOverYearChange}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-green-700 mb-2">
                    Highlights
                  </h3>
                  <ul className="space-y-1">
                    {sc.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-600 flex gap-2"
                      >
                        <span className="text-green-500">✓</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-amber-700 mb-2">
                    Challenges
                  </h3>
                  <ul className="space-y-1">
                    {sc.challenges.map((c, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-600 flex gap-2"
                      >
                        <span className="text-amber-500">!</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

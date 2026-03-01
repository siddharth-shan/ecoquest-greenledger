"use client";

import { useEffect, useState } from "react";
import {
  Droplets,
  TreePine,
  Recycle,
  Clock,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import SustainabilityTag from "@/components/shared/SustainabilityTag";
import type { ImpactCounter } from "@/types/challenge";

const iconMap: Record<string, React.ElementType> = {
  Droplets,
  TreePine,
  Recycle,
  Clock,
  Trophy,
};

export default function ImpactPage() {
  const [counters, setCounters] = useState<ImpactCounter[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/impact")
      .then((r) => r.json())
      .then((data) => {
        setCounters(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <div className="container-custom py-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-civic-primary-light flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-civic-primary" />
          </div>
          <div>
            <h1 className="section-title mb-0">Community Impact</h1>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Every challenge completed adds to Cerritos&apos;s collective sustainability impact.
          These numbers grow with every action our community takes.
        </p>
        <div className="section-underline mt-3" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {counters.map((counter) => {
          const Icon = iconMap[counter.icon] || Trophy;
          return (
            <div
              key={counter.id}
              className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-civic-light flex items-center justify-center mx-auto mb-4">
                <Icon className="w-7 h-7 text-civic-primary" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1 tabular-nums">
                <AnimatedCounter
                  value={loaded ? counter.value : 0}
                  duration={1500}
                />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">
                {counter.label}
              </p>
              <SustainabilityTag tag={counter.sustainabilityTag} />
            </div>
          );
        })}
      </div>

      {loaded && counters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">
            Impact counters are loading...
          </p>
        </div>
      )}
    </div>
  );
}

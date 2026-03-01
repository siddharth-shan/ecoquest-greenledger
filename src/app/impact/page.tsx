"use client";

import { useEffect, useState } from "react";
import {
  Droplets,
  TreePine,
  Recycle,
  Clock,
  Trophy,
  TrendingUp,
  Waves,
  Wind,
  UserCheck,
  HandCoins,
  Users,
} from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import SustainabilityTag from "@/components/shared/SustainabilityTag";
import { getEquivalence } from "@/lib/impact-equivalences";
import type { ImpactCounter } from "@/types/challenge";

const iconMap: Record<string, React.ElementType> = {
  Droplets,
  TreePine,
  Recycle,
  Clock,
  Trophy,
};

const equivIconMap: Record<string, React.ElementType> = {
  Waves,
  Wind,
  UserCheck,
  HandCoins,
  Users,
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
          const equiv = getEquivalence(counter.id, counter.value);
          const EquivIcon = equiv ? (equivIconMap[equiv.icon] || Trophy) : null;

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

              {/* Equivalence */}
              {equiv && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-civic-accent mt-1 mb-2">
                  {EquivIcon && <EquivIcon className="w-3.5 h-3.5" />}
                  <span>
                    ≈ {equiv.value} {equiv.label}
                  </span>
                </div>
              )}

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

      {/* Methodology note */}
      {loaded && counters.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-500">
            <strong>Equivalences:</strong> Water savings calculated at 660,000 gal/Olympic pool (FINA).
            CO2 absorption at 48 lbs/tree/year (USDA Forest Service).
            Volunteer value at $31.80/hr (Independent Sector 2023).
            Waste diversion at 4.4 lbs/person-day (EPA).
          </p>
        </div>
      )}
    </div>
  );
}

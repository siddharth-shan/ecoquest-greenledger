"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Leaf,
  ArrowRight,
  DollarSign,
  Users,
  TreePine,
  Trophy,
  Droplets,
  Recycle,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import ChallengeCard from "@/components/challenges/ChallengeCard";
import challengeData from "@/data/challenges/challenges.json";
import type { Challenge } from "@/types/challenge";
import type { ImpactCounter } from "@/types/challenge";

const challenges = challengeData.challenges as unknown as Challenge[];
const featured = challenges.slice(0, 3);

const iconMap: Record<string, React.ElementType> = {
  Droplets,
  TreePine,
  Recycle,
  Trophy,
  Clock: Trophy,
};

export default function HomePage() {
  const [counters, setCounters] = useState<ImpactCounter[]>([]);

  useEffect(() => {
    fetch("/api/impact")
      .then((r) => r.json())
      .then(setCounters)
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-eco text-white py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading font-bold text-lg">
                EcoQuest GreenLedger
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold leading-tight mb-4">
              Follow the Money.
              <br />
              <span className="text-eco-yellow">Improve Your City.</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-lg">
              See how Cerritos spends your tax dollars on sustainability — then
              take action with real-world challenges that make a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/hub/budget"
                className="inline-flex items-center justify-center gap-2 bg-white text-eco-green-dark font-semibold px-6 py-3 rounded-full hover:bg-eco-yellow hover:text-gray-900 transition-all duration-300"
              >
                <BarChart3 className="w-5 h-5" />
                Explore the Budget
              </Link>
              <Link
                href="/challenges"
                className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/25 transition-all duration-300"
              >
                <Trophy className="w-5 h-5" />
                Start a Challenge
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container-custom">
          <h2 className="font-heading font-bold text-sm text-gray-400 uppercase tracking-wider mb-4">
            Cerritos Budget at a Glance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-eco-green-light flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-eco-green" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">$136.6M</p>
                <p className="text-xs text-gray-500">Total Budget</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-eco-blue-light flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-eco-blue" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">$2,655</p>
                <p className="text-xs text-gray-500">Per Resident</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-tag-parks-bg flex items-center justify-center shrink-0">
                <TreePine className="w-5 h-5 text-tag-parks" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">46%</p>
                <p className="text-xs text-gray-500">Sustainability Spend</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-eco-yellow/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-eco-yellow" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">+3.4%</p>
                <p className="text-xs text-gray-500">YoY Budget Growth</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Challenges */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title text-2xl">Take Action</h2>
              <p className="text-gray-500 text-sm">
                Real-world challenges tied to Cerritos sustainability goals
              </p>
            </div>
            <Link
              href="/challenges"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-eco-green hover:text-eco-green-dark"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((c) => (
              <ChallengeCard key={c.id} challenge={c} />
            ))}
          </div>
          <div className="sm:hidden mt-4 text-center">
            <Link href="/challenges" className="btn btn-outline text-sm">
              View All Challenges
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Preview */}
      {counters.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-title text-2xl">Community Impact</h2>
                <p className="text-gray-500 text-sm">
                  Together, our community has achieved this
                </p>
              </div>
              <Link
                href="/impact"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-eco-green hover:text-eco-green-dark"
              >
                See All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {counters.slice(0, 5).map((counter) => {
                const Icon = iconMap[counter.icon] || Trophy;
                return (
                  <div
                    key={counter.id}
                    className="bg-eco-green-light/50 rounded-xl p-4 text-center"
                  >
                    <Icon className="w-5 h-5 text-eco-green mx-auto mb-2" />
                    <p className="text-xl font-bold text-gray-900 tabular-nums">
                      <AnimatedCounter value={counter.value} duration={1200} />
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {counter.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-eco-light py-12">
        <div className="container-custom text-center">
          <h2 className="font-heading font-bold text-2xl text-gray-900 mb-3">
            Ready to make a difference?
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Explore the budget, complete challenges, and help build a more
            sustainable Cerritos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/hub/budget" className="btn btn-primary">
              Explore the Budget
            </Link>
            <Link href="/challenges" className="btn btn-outline">
              Start a Challenge
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

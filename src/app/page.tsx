"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Building2,
  ArrowRight,
  DollarSign,
  Users,
  TreePine,
  Trophy,
  Droplets,
  Recycle,
  TrendingUp,
  BarChart3,
  Monitor,
  PiggyBank,
  MessageSquare,
  ClipboardCheck,
  Waves,
  Wind,
  UserCheck,
  HandCoins,
} from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import ChallengeCard from "@/components/challenges/ChallengeCard";
import { getEquivalence } from "@/lib/impact-equivalences";
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

const equivIconMap: Record<string, React.ElementType> = {
  Waves,
  Wind,
  UserCheck,
  HandCoins,
  Users,
};

interface EngagementStats {
  totalSurveyResponses: number;
  totalChallengesCompleted: number;
  totalVolunteerHours: number;
}

const strategicGoals = [
  {
    number: 5,
    title: "Technology Resources",
    description: "Interactive dashboards replacing static PDFs",
    icon: Monitor,
    color: "bg-purple-50 text-purple-700",
  },
  {
    number: 6,
    title: "Fiscal Transparency",
    description: "Real budget data with 7-department breakdown",
    icon: PiggyBank,
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    number: 7,
    title: "Community Communications",
    description: "Two-way engagement through surveys & challenges",
    icon: MessageSquare,
    color: "bg-blue-50 text-blue-700",
  },
];

export default function HomePage() {
  const [counters, setCounters] = useState<ImpactCounter[]>([]);
  const [stats, setStats] = useState<EngagementStats | null>(null);

  useEffect(() => {
    fetch("/api/impact")
      .then((r) => r.json())
      .then(setCounters)
      .catch(() => {});
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-civic-primary via-civic-primary-dark to-civic-accent text-white py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading font-bold text-lg">
                GreenLedger
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold leading-tight mb-4">
              Follow the Money.
              <br />
              <span className="text-civic-highlight">Improve Your City.</span>
            </h1>
            <p className="text-lg text-white/80 mb-4 max-w-lg">
              See how Cerritos spends your tax dollars on sustainability — then
              take action with real-world challenges that make a difference.
            </p>

            {/* Strategic Plan Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
              <ClipboardCheck className="w-4 h-4 text-civic-highlight" />
              <span className="text-sm text-white/90">
                Aligned with Cerritos Strategic Plan 2025-2027
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/hub/budget"
                className="inline-flex items-center justify-center gap-2 bg-white text-civic-primary-dark font-semibold px-6 py-3 rounded-lg hover:bg-civic-highlight hover:text-gray-900 transition-all duration-300"
              >
                <BarChart3 className="w-5 h-5" />
                Explore the Budget
              </Link>
              <Link
                href="/challenges"
                className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/25 transition-all duration-300"
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
            Cerritos FY 2025-26 Budget at a Glance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-civic-primary-light flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-civic-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">$131.4M</p>
                <p className="text-xs text-gray-500">All-Funds Budget</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-civic-accent-light flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-civic-accent" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">$2,553</p>
                <p className="text-xs text-gray-500">Per Resident</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-tag-parks-bg flex items-center justify-center shrink-0">
                <TreePine className="w-5 h-5 text-tag-parks" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">7</p>
                <p className="text-xs text-gray-500">City Departments</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-civic-highlight/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-civic-highlight" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">722M gal</p>
                <p className="text-xs text-gray-500">Water Saved/Year</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Alignment */}
      <section className="py-10 bg-gray-50 border-b border-gray-100">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading font-bold text-sm text-gray-400 uppercase tracking-wider mb-1">
                Strategic Plan Alignment
              </h2>
              <p className="text-gray-600 text-sm">
                Built to support Cerritos&apos;s 2025-2027 strategic goals
              </p>
            </div>
            <Link
              href="/hub/strategic-plan"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-civic-primary hover:text-civic-primary-dark"
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {strategicGoals.map((goal) => {
              const Icon = goal.icon;
              return (
                <Link
                  key={goal.number}
                  href="/hub/strategic-plan"
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${goal.color} flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Goal {goal.number}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-gray-900 text-sm mb-1">
                    {goal.title}
                  </h3>
                  <p className="text-xs text-gray-500">{goal.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Engagement Metrics */}
      {stats && (
        <section className="py-10 bg-white border-b border-gray-100">
          <div className="container-custom">
            <h2 className="font-heading font-bold text-sm text-gray-400 uppercase tracking-wider mb-4">
              Community Engagement
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-civic-primary-light rounded-xl p-5 text-center">
                <Users className="w-6 h-6 text-civic-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalSurveyResponses}
                </p>
                <p className="text-xs text-gray-600 mt-1">Survey Responses</p>
              </div>
              <div className="bg-civic-accent-light rounded-xl p-5 text-center">
                <Trophy className="w-6 h-6 text-civic-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalChallengesCompleted}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Challenges Completed
                </p>
              </div>
              <div className="bg-civic-highlight/10 rounded-xl p-5 text-center">
                <BarChart3 className="w-6 h-6 text-civic-highlight mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalVolunteerHours}
                </p>
                <p className="text-xs text-gray-600 mt-1">Volunteer Hours</p>
              </div>
            </div>
          </div>
        </section>
      )}

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
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-civic-primary hover:text-civic-primary-dark"
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

      {/* Impact Preview with Equivalences */}
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
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-civic-primary hover:text-civic-primary-dark"
              >
                See All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {counters.slice(0, 5).map((counter) => {
                const Icon = iconMap[counter.icon] || Trophy;
                const equiv = getEquivalence(counter.id, counter.value);
                const EquivIcon = equiv
                  ? equivIconMap[equiv.icon] || null
                  : null;
                return (
                  <div
                    key={counter.id}
                    className="bg-civic-primary-light rounded-xl p-4 text-center"
                  >
                    <Icon className="w-5 h-5 text-civic-primary mx-auto mb-2" />
                    <p className="text-xl font-bold text-gray-900 tabular-nums">
                      <AnimatedCounter value={counter.value} duration={1200} />
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {counter.label}
                    </p>
                    {equiv && (
                      <div className="flex items-center justify-center gap-1 text-[10px] text-civic-accent mt-1.5">
                        {EquivIcon && <EquivIcon className="w-3 h-3" />}
                        <span>
                          ≈ {equiv.value} {equiv.label}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-slate-50 border-t border-gray-200 py-12">
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

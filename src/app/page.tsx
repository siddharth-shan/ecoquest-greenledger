"use client";

import Link from "next/link";
import {
  ArrowRight,
  DollarSign,
  Users,
  TreePine,
  Droplets,
  BarChart3,
  Leaf,
  MessageCircle,
  ClipboardCheck,
  MessageCircleQuestion,
  FileText,
} from "lucide-react";

const topBenefits = [
  {
    title: "See Where Your Money Goes",
    description:
      "Interactive budget explorer turns a 370-page PDF into explorable data — 7 departments, 10-year trends, per-capita breakdowns.",
    stat: "$131.4M explored",
    icon: BarChart3,
    href: "/hub/budget",
    borderColor: "border-civic-primary",
    iconBg: "bg-civic-primary-light",
    iconColor: "text-civic-primary",
    linkColor: "text-civic-primary hover:text-civic-primary-dark",
  },
  {
    title: "Track Real Environmental Impact",
    description:
      "Verified sustainability scorecards — 722M gallons recycled water, 28,000+ city trees, solar energy, clean fleet — all from official city data.",
    stat: "722M gal saved",
    icon: Leaf,
    href: "/hub/scorecards",
    borderColor: "border-eco-green-dark",
    iconBg: "bg-eco-green-light",
    iconColor: "text-eco-green-dark",
    linkColor: "text-eco-green-dark hover:text-emerald-700",
  },
  {
    title: "Make Your Voice Count",
    description:
      "Rank community priorities, explore the city strategic plan, and see how your values compare to actual city spending.",
    stat: "5 categories ranked",
    icon: MessageCircle,
    href: "/hub/priorities",
    borderColor: "border-civic-highlight",
    iconBg: "bg-civic-highlight/15",
    iconColor: "text-civic-highlight",
    linkColor: "text-civic-highlight hover:text-amber-600",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-civic-primary via-civic-primary-dark to-emerald-900 text-white py-10 md:py-14">
        <div className="container-custom">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-eco-green/20 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-eco-green" />
              </div>
              <span className="font-heading font-bold text-lg">
                <span className="text-eco-green">Green</span>Ledger
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-heading font-extrabold leading-tight mb-3">
              Follow the Money.
              <br />
              <span className="text-eco-green">Improve Your City.</span>
            </h1>
            <p className="text-base text-white/80 mb-3 max-w-lg">
              See how Cerritos spends your tax dollars on sustainability —
              explore the budget, track real environmental metrics, and engage
              with your city.
            </p>

            {/* Strategic Plan Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 mb-5">
              <ClipboardCheck className="w-4 h-4 text-eco-green" />
              <span className="text-sm text-white/90">
                Aligned with Cerritos Strategic Plan 2025-2027
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/hub/budget"
                className="inline-flex items-center justify-center gap-2 bg-white text-civic-primary-dark font-semibold px-6 py-3 rounded-lg hover:bg-eco-green hover:text-gray-900 transition-all duration-300"
              >
                <BarChart3 className="w-5 h-5" />
                Explore the Budget
              </Link>
              <Link
                href="/report"
                className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/25 transition-all duration-300"
              >
                <FileText className="w-5 h-5" />
                View Report
              </Link>
            </div>
          </div>

          {/* Quick Stats — inline in hero */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/15">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-eco-green shrink-0" />
              <div>
                <p className="text-lg font-bold text-white">$131.4M</p>
                <p className="text-xs text-white/60">All-Funds Budget</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-eco-green shrink-0" />
              <div>
                <p className="text-lg font-bold text-white">$2,553</p>
                <p className="text-xs text-white/60">Per Resident</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TreePine className="w-5 h-5 text-eco-green shrink-0" />
              <div>
                <p className="text-lg font-bold text-white">7</p>
                <p className="text-xs text-white/60">City Departments</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 text-eco-green shrink-0" />
              <div>
                <p className="text-lg font-bold text-white">722M gal</p>
                <p className="text-xs text-white/60">Water Saved/Year</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why GreenLedger */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="section-title text-2xl">Why GreenLedger?</h2>
            <div className="section-underline mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topBenefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className={`bg-white rounded-xl border border-gray-200 border-t-3 ${benefit.borderColor} p-6 hover:shadow-lg transition-all hover:-translate-y-1`}
                >
                  <div
                    className={`w-12 h-12 rounded-full ${benefit.iconBg} flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-6 h-6 ${benefit.iconColor}`} />
                  </div>
                  <h3 className="font-heading font-bold text-gray-900 text-lg mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {benefit.description}
                  </p>
                  <p className="text-sm font-bold text-gray-900 mb-4">
                    {benefit.stat}
                  </p>
                  <Link
                    href={benefit.href}
                    className={`inline-flex items-center gap-1 text-sm font-semibold ${benefit.linkColor} transition-colors`}
                  >
                    Explore
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 border-t border-gray-200 py-12">
        <div className="container-custom text-center">
          <h2 className="font-heading font-bold text-2xl text-gray-900 mb-3">
            Ready to explore?
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Dive into the budget data or ask AI-powered questions about city
            finances and sustainability.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/hub/budget" className="btn btn-primary">
              Explore the Budget
            </Link>
            <Link
              href="/hub/ask"
              className="btn btn-outline inline-flex items-center gap-2"
            >
              <MessageCircleQuestion className="w-4 h-4" />
              Ask About the Budget
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Star,
  CheckCircle2,
  Lightbulb,
  DollarSign,
  Target,
} from "lucide-react";
import Link from "next/link";
import SustainabilityTag from "@/components/shared/SustainabilityTag";
import challengeData from "@/data/challenges/challenges.json";
import type { Challenge } from "@/types/challenge";

const challenges = challengeData.challenges as unknown as Challenge[];

export default function ChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [reflection, setReflection] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const challenge = challenges.find((c) => c.id === params.id);

  if (!challenge) {
    return (
      <div className="container-custom py-12 text-center">
        <p className="text-gray-500">Challenge not found.</p>
        <Link href="/challenges" className="btn btn-primary mt-4 inline-block">
          Back to Challenges
        </Link>
      </div>
    );
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: challenge.id,
          reflection,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-custom py-6 max-w-2xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <SustainabilityTag tag={challenge.sustainabilityTag} size="md" />
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              ~{challenge.estimatedMinutes} min
            </span>
            <span className="text-sm text-eco-green font-semibold flex items-center gap-1">
              <Star className="w-3.5 h-3.5" />
              {challenge.pointsReward} pts
            </span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            {challenge.title}
          </h1>
          <p className="text-gray-600 mt-2">{challenge.description}</p>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-heading font-bold text-lg mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-eco-green" />
            Steps
          </h2>
          <ol className="space-y-3">
            {challenge.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-eco-green-light text-eco-green-dark text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Tips */}
        <div className="bg-eco-yellow/5 rounded-xl border border-eco-yellow/20 p-5">
          <h2 className="font-heading font-bold text-lg mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-eco-yellow" />
            Tips
          </h2>
          <ul className="space-y-2">
            {challenge.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-eco-yellow">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* City Connection */}
        <div className="bg-eco-blue-light/50 rounded-xl border border-eco-blue/20 p-5">
          <h2 className="font-heading font-bold text-lg mb-2 flex items-center gap-2">
            <Target className="w-5 h-5 text-eco-blue" />
            City Connection
          </h2>
          <p className="text-sm text-gray-700">{challenge.cityGoalConnection}</p>
        </div>

        {/* Financial Snippet */}
        <div className="bg-eco-green-light/50 rounded-xl border border-eco-green/20 p-5">
          <h2 className="font-heading font-bold text-lg mb-2 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-eco-green" />
            Why It Matters Financially
          </h2>
          <p className="text-sm text-gray-700">{challenge.financialSnippet}</p>
        </div>

        {/* Submission */}
        {!submitted ? (
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-heading font-bold text-lg mb-3">
              Complete This Challenge
            </h2>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Write your reflection here... What did you learn? What surprised you?"
              rows={4}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-eco-green/20 focus:border-eco-green outline-none resize-none"
            />
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !reflection.trim()}
              className="btn btn-primary w-full mt-3 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Completion"}
            </button>
          </div>
        ) : (
          <div className="bg-eco-green-light rounded-xl p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-eco-green mx-auto mb-3" />
            <h2 className="font-heading font-bold text-xl text-eco-green-dark">
              Challenge Complete!
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              You earned {challenge.pointsReward} points. Great work!
            </p>
            <Link
              href="/challenges"
              className="btn btn-primary mt-4 inline-block"
            >
              Find More Challenges
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

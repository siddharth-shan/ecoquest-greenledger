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
  Camera,
  QrCode,
  ShieldCheck,
  Upload,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import SustainabilityTag from "@/components/shared/SustainabilityTag";
import challengeData from "@/data/challenges/challenges.json";
import type { Challenge } from "@/types/challenge";

const challenges = challengeData.challenges as unknown as Challenge[];

type VerificationStatus = "unverified" | "pending" | "verified";

const verificationMethods = [
  {
    id: "qr",
    label: "QR Code Scan",
    icon: QrCode,
    description: "Scan the event QR code at a city event or school activity",
  },
  {
    id: "photo",
    label: "Photo Evidence",
    icon: Camera,
    description: "Upload a photo showing your completed action",
  },
  {
    id: "teacher",
    label: "Teacher/Leader Sign-off",
    icon: UserCheck,
    description: "Get verified by a teacher, club leader, or event organizer",
  },
];

export default function ChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [reflection, setReflection] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("unverified");
  const [photoUploaded, setPhotoUploaded] = useState(false);

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
          verificationMethod,
          verified: verificationStatus === "verified",
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerification = (method: string) => {
    setVerificationMethod(method);
    // Simulate verification flow
    if (method === "qr") {
      setVerificationStatus("verified");
    } else if (method === "photo") {
      setVerificationStatus("pending");
    } else {
      setVerificationStatus("pending");
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
            <span className="text-sm text-civic-accent font-semibold flex items-center gap-1">
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
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-heading font-bold text-lg mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-civic-accent" />
            Steps
          </h2>
          <ol className="space-y-3">
            {challenge.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-civic-primary-light text-civic-primary-dark text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Verification Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-heading font-bold text-lg mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-civic-primary" />
            Verify Your Action
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Verified actions earn higher rewards and count toward City impact reports.
            Choose a verification method below.
          </p>

          <div className="grid gap-3">
            {verificationMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = verificationMethod === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => handleVerification(method.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? "border-civic-primary bg-civic-primary-light"
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-civic-primary text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${isSelected ? "text-civic-primary-dark" : "text-gray-700"}`}>
                      {method.label}
                    </p>
                    <p className="text-xs text-gray-500">{method.description}</p>
                  </div>
                  {isSelected && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      verificationStatus === "verified"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {verificationStatus === "verified" ? "Verified" : "Pending Review"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Photo upload UI (shown when photo method selected) */}
          {verificationMethod === "photo" && (
            <div className="mt-4 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
              {!photoUploaded ? (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Upload photo evidence</p>
                  <button
                    onClick={() => {
                      setPhotoUploaded(true);
                      setVerificationStatus("pending");
                    }}
                    className="text-xs px-4 py-2 bg-civic-primary text-white rounded-lg"
                  >
                    Choose Photo
                  </button>
                  <p className="text-[10px] text-gray-400 mt-2">
                    Photos are reviewed before verification. No precise location data is collected.
                  </p>
                </>
              ) : (
                <div className="flex items-center gap-2 justify-center">
                  <Camera className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-700">Photo uploaded — pending review</span>
                </div>
              )}
            </div>
          )}

          {/* QR display (shown when QR method selected) */}
          {verificationMethod === "qr" && (
            <div className="mt-4 bg-green-50 rounded-xl p-4 text-center">
              <QrCode className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-700 font-semibold">QR Code Scanned</p>
              <p className="text-xs text-green-600 mt-1">
                Event: Cerritos Sustainability Event | Verified automatically
              </p>
            </div>
          )}

          {/* Teacher sign-off (shown when teacher method selected) */}
          {verificationMethod === "teacher" && (
            <div className="mt-4 bg-amber-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-5 h-5 text-amber-600" />
                <p className="text-sm text-amber-700 font-semibold">Pending Teacher Verification</p>
              </div>
              <p className="text-xs text-amber-600">
                Share your completion code with your teacher or club leader. They can verify
                your action through the GreenLedger admin panel.
              </p>
              <div className="mt-2 bg-white rounded-lg p-2 text-center">
                <p className="text-xs text-gray-400">Your verification code:</p>
                <p className="text-lg font-mono font-bold text-civic-primary tracking-wider">
                  GL-{challenge.id.slice(0, 4).toUpperCase()}-{Math.random().toString(36).slice(2, 6).toUpperCase()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-civic-highlight/5 rounded-xl border border-civic-highlight/20 p-5">
          <h2 className="font-heading font-bold text-lg mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-civic-highlight" />
            Tips
          </h2>
          <ul className="space-y-2">
            {challenge.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-civic-highlight">&bull;</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* City Connection */}
        <div className="bg-civic-accent-light/50 rounded-xl border border-civic-accent/20 p-5">
          <h2 className="font-heading font-bold text-lg mb-2 flex items-center gap-2">
            <Target className="w-5 h-5 text-civic-accent" />
            City Connection
          </h2>
          <p className="text-sm text-gray-700">{challenge.cityGoalConnection}</p>
        </div>

        {/* Financial Snippet */}
        <div className="bg-civic-primary-light rounded-xl border border-civic-primary/20 p-5">
          <h2 className="font-heading font-bold text-lg mb-2 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-civic-primary" />
            Why It Matters Financially
          </h2>
          <p className="text-sm text-gray-700">{challenge.financialSnippet}</p>
        </div>

        {/* Submission */}
        {!submitted ? (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-heading font-bold text-lg mb-3">
              Complete This Challenge
            </h2>

            {/* Verification badge */}
            {verificationMethod && (
              <div className={`flex items-center gap-2 mb-3 p-2 rounded-lg ${
                verificationStatus === "verified"
                  ? "bg-green-50"
                  : "bg-amber-50"
              }`}>
                <ShieldCheck className={`w-4 h-4 ${
                  verificationStatus === "verified" ? "text-green-600" : "text-amber-600"
                }`} />
                <span className={`text-xs font-medium ${
                  verificationStatus === "verified" ? "text-green-700" : "text-amber-700"
                }`}>
                  {verificationStatus === "verified"
                    ? "Verified action — earns full points + $Eco reward"
                    : "Pending verification — points awarded after review"
                  }
                </span>
              </div>
            )}

            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Write your reflection here... What did you learn? What surprised you?"
              rows={4}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-civic-primary/20 focus:border-civic-primary outline-none resize-none"
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
          <div className="bg-civic-accent-light rounded-xl p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-civic-accent mx-auto mb-3" />
            <h2 className="font-heading font-bold text-xl text-civic-accent-dark">
              Challenge Complete!
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              You earned {challenge.pointsReward} points
              {verificationStatus === "verified" && " + verified bonus"}. Great work!
            </p>
            {verificationStatus === "verified" && (
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-700 font-medium">Verified Action</span>
              </div>
            )}
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

"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Trophy, Star, LogOut, ArrowRight } from "lucide-react";

interface UserProgress {
  challengesCompleted: number;
  totalPoints: number;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    if (session) {
      fetch("/api/user")
        .then((r) => r.json())
        .then((data) => {
          const p = data.progress;
          setProgress({
            challengesCompleted: p?.completedChallengeIds?.length ?? 0,
            totalPoints: p?.totalPoints ?? 0,
          });
          setLoadingProgress(false);
        })
        .catch(() => setLoadingProgress(false));
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="container-custom py-12 text-center">
        <div className="animate-pulse w-16 h-16 bg-gray-200 rounded-full mx-auto" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container-custom py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-gray-900 mb-2">
            Sign in to track your progress
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Create an account to save challenge completions, earn points, and
            see your sustainability impact.
          </p>
          <Link href="/sign-in" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4">
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt=""
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-civic-primary flex items-center justify-center text-white font-bold text-xl">
              {session.user?.name?.[0] || "U"}
            </div>
          )}
          <div>
            <h1 className="font-heading font-bold text-xl text-gray-900">
              {session.user?.name || "GreenLedger User"}
            </h1>
            <p className="text-sm text-gray-500">{session.user?.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-civic-primary-light rounded-xl p-4 text-center">
          <Trophy className="w-6 h-6 text-civic-primary mx-auto mb-1" />
          {loadingProgress ? (
            <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mx-auto" />
          ) : (
            <p className="text-2xl font-bold text-civic-primary-dark">
              {progress?.challengesCompleted ?? 0}
            </p>
          )}
          <p className="text-xs text-gray-600">Challenges Completed</p>
        </div>
        <div className="bg-civic-accent-light rounded-xl p-4 text-center">
          <Star className="w-6 h-6 text-civic-accent mx-auto mb-1" />
          {loadingProgress ? (
            <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mx-auto" />
          ) : (
            <p className="text-2xl font-bold text-civic-accent-dark">
              {progress?.totalPoints ?? 0}
            </p>
          )}
          <p className="text-xs text-gray-600">Total Points</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="font-heading font-bold text-lg mb-3">Quick Links</h2>
        <div className="space-y-2">
          <Link
            href="/challenges"
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">
              Browse Challenges
            </span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </Link>
          <Link
            href="/impact"
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">
              Community Impact
            </span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </Link>
          <Link
            href="/hub/budget"
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">
              Budget Explorer
            </span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </Link>
        </div>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
}

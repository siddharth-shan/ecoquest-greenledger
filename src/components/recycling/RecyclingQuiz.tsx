"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Recycle,
  Leaf,
  Trash2,
  ArrowRight,
  RotateCcw,
  ExternalLink,
  Trophy,
  AlertTriangle,
  Truck,
} from "lucide-react";
import BinButton from "./BinButton";
import quizData from "@/data/recycling/quiz-items.json";
import Link from "next/link";

type QuizState = "intro" | "playing" | "results";

interface Answer {
  itemId: string;
  itemName: string;
  selectedBin: string;
  correctBin: string;
  isCorrect: boolean;
  explanation: string;
  isTricky: boolean;
}

const ITEMS_PER_QUIZ = 10;

function shuffleAndPick<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const binIconMap: Record<string, React.ElementType> = {
  Recycle,
  Leaf,
  Trash2,
};

export default function RecyclingQuiz() {
  const [state, setState] = useState<QuizState>("intro");
  const [quizItems, setQuizItems] = useState(() =>
    shuffleAndPick(quizData.items, ITEMS_PER_QUIZ)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedBin, setSelectedBin] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentItem = quizItems[currentIndex];
  const score = answers.filter((a) => a.isCorrect).length;

  const startQuiz = useCallback(() => {
    const items = shuffleAndPick(quizData.items, ITEMS_PER_QUIZ);
    setQuizItems(items);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedBin(null);
    setShowExplanation(false);
    setState("playing");
  }, []);

  const handleBinSelect = useCallback(
    (binId: string) => {
      if (selectedBin || !currentItem) return;
      const isCorrect = binId === currentItem.correctBin;
      setSelectedBin(binId);
      setShowExplanation(true);
      setAnswers((prev) => [
        ...prev,
        {
          itemId: currentItem.id,
          itemName: currentItem.name,
          selectedBin: binId,
          correctBin: currentItem.correctBin,
          isCorrect,
          explanation: currentItem.explanation,
          isTricky: currentItem.isTricky,
        },
      ]);
    },
    [selectedBin, currentItem]
  );

  const nextItem = useCallback(() => {
    if (currentIndex + 1 >= quizItems.length) {
      setState("results");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedBin(null);
      setShowExplanation(false);
    }
  }, [currentIndex, quizItems.length]);

  const trickyMissed = useMemo(
    () => answers.filter((a) => a.isTricky && !a.isCorrect),
    [answers]
  );

  const binBreakdown = useMemo(() => {
    const breakdown: Record<string, { correct: number; total: number }> = {};
    for (const a of answers) {
      if (!breakdown[a.correctBin])
        breakdown[a.correctBin] = { correct: 0, total: 0 };
      breakdown[a.correctBin].total++;
      if (a.isCorrect) breakdown[a.correctBin].correct++;
    }
    return breakdown;
  }, [answers]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Intro */}
      {state === "intro" && (
        <div className="space-y-6">
          {/* 3-Cart Explainer */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-heading font-bold text-gray-900 mb-4">
              Cerritos 3-Cart System
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {quizData.bins.map((bin) => {
                const Icon = binIconMap[bin.icon] || Trash2;
                return (
                  <div
                    key={bin.id}
                    className="rounded-xl border-2 p-4 text-center"
                    style={{ borderColor: bin.color + "40" }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
                      style={{ backgroundColor: bin.color + "15" }}
                    >
                      <Icon className="w-6 h-6" style={{ color: bin.color }} />
                    </div>
                    <h3
                      className="font-bold text-sm mb-1"
                      style={{ color: bin.color }}
                    >
                      {bin.name}
                    </h3>
                    <p className="text-xs text-gray-500">{bin.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SB 1383 */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-800 text-sm mb-1">
                  {quizData.sb1383.title}
                </h3>
                <p className="text-xs text-amber-700 leading-relaxed">
                  {quizData.sb1383.description}
                </p>
              </div>
            </div>
          </div>

          {/* CNG Fleet Fact */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
            <Truck className="w-5 h-5 text-gray-500 shrink-0" />
            <p className="text-xs text-gray-600">
              <strong>Fun fact:</strong> All Cerritos waste collection vehicles
              operated by Athens Services run on Compressed Natural Gas (CNG),
              reducing diesel emissions.
            </p>
          </div>

          <button
            onClick={startQuiz}
            className="w-full btn btn-primary flex items-center justify-center gap-2 py-3 text-base"
          >
            Start Quiz ({ITEMS_PER_QUIZ} questions)
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Playing */}
      {state === "playing" && currentItem && (
        <div className="space-y-6">
          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500">
                Question {currentIndex + 1} of {quizItems.length}
              </span>
              <span className="text-sm font-medium text-civic-primary">
                Score: {score}/{answers.length}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-civic-primary rounded-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / quizItems.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Item card */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">
              Which bin does this go in?
            </p>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {currentItem.name}
            </h2>
            {currentItem.isTricky && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                Tricky!
              </span>
            )}
          </div>

          {/* Bin buttons */}
          <div className="flex justify-center gap-4">
            {quizData.bins.map((bin) => {
              let feedback: "correct" | "incorrect" | null = null;
              if (selectedBin) {
                if (bin.id === currentItem.correctBin)
                  feedback = "correct";
                else if (bin.id === selectedBin) feedback = "incorrect";
              }
              return (
                <BinButton
                  key={bin.id}
                  binId={bin.id}
                  binName={bin.name}
                  color={bin.color}
                  icon={bin.icon}
                  onClick={() => handleBinSelect(bin.id)}
                  disabled={!!selectedBin}
                  feedback={feedback}
                />
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div
              className={`rounded-xl p-4 border ${
                selectedBin === currentItem.correctBin
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <p
                className={`text-sm font-bold mb-1 ${
                  selectedBin === currentItem.correctBin
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {selectedBin === currentItem.correctBin
                  ? "Correct!"
                  : `Incorrect — goes in ${quizData.bins.find((b) => b.id === currentItem.correctBin)?.name}`}
              </p>
              <p
                className={`text-xs ${
                  selectedBin === currentItem.correctBin
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {currentItem.explanation}
              </p>
            </div>
          )}

          {/* Next button */}
          {showExplanation && (
            <button
              onClick={nextItem}
              className="w-full btn btn-primary flex items-center justify-center gap-2"
            >
              {currentIndex + 1 >= quizItems.length
                ? "See Results"
                : "Next Item"}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {state === "results" && (
        <div className="space-y-6">
          {/* Score */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-civic-primary-light flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-civic-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {score} / {answers.length}
            </h2>
            <p className="text-sm text-gray-500">
              {score === answers.length
                ? "Perfect score! You're a recycling expert!"
                : score >= answers.length * 0.7
                  ? "Great job! You know your bins well."
                  : "Keep learning — every item matters!"}
            </p>
          </div>

          {/* Breakdown by bin */}
          <div className="grid grid-cols-3 gap-3">
            {quizData.bins.map((bin) => {
              const data = binBreakdown[bin.id];
              const Icon = binIconMap[bin.icon] || Trash2;
              return (
                <div
                  key={bin.id}
                  className="bg-white rounded-xl border border-gray-100 p-3 text-center"
                >
                  <Icon
                    className="w-5 h-5 mx-auto mb-1"
                    style={{ color: bin.color }}
                  />
                  <p className="text-xs font-medium" style={{ color: bin.color }}>
                    {bin.name}
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {data ? `${data.correct}/${data.total}` : "—"}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Tricky items recap */}
          {trickyMissed.length > 0 && (
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
              <h3 className="font-bold text-amber-800 text-sm mb-2">
                Tricky Items You Missed
              </h3>
              <div className="space-y-2">
                {trickyMissed.map((a) => (
                  <div key={a.itemId}>
                    <p className="text-xs font-medium text-amber-900">
                      {a.itemName} → {quizData.bins.find((b) => b.id === a.correctBin)?.name}
                    </p>
                    <p className="text-xs text-amber-700">{a.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SB 1383 Facts */}
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-2">
              SB 1383 Key Facts
            </h3>
            <ul className="space-y-1">
              {quizData.sb1383.keyFacts.map((fact, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                  <span className="text-civic-accent mt-0.5">•</span>
                  {fact}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={startQuiz}
              className="flex-1 btn btn-primary flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              href="/challenges"
              className="flex-1 btn bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              Explore Challenges
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Sources */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <h3 className="text-xs font-semibold text-gray-700 mb-2">
              Sources
            </h3>
            <div className="space-y-1">
              {quizData.sources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-civic-primary transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  {source.name} (accessed {source.accessDate})
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

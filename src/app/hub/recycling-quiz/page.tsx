import { Recycle } from "lucide-react";
import RecyclingQuiz from "@/components/recycling/RecyclingQuiz";

export const metadata = {
  title: "Recycling Quiz — EcoQuest GreenLedger",
  description: "Test your knowledge of Cerritos's 3-cart recycling system",
};

export default function RecyclingQuizPage() {
  return (
    <div className="container-custom py-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <Recycle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="section-title mb-0">Recycling Quiz</h1>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Test your knowledge of Cerritos&apos;s 3-cart waste sorting system
          powered by Athens Services.
        </p>
        <div className="section-underline mt-3" />
      </div>

      <RecyclingQuiz />
    </div>
  );
}

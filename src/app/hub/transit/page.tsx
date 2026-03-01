import { Bus } from "lucide-react";
import TransitModeShift from "@/components/transit/TransitModeShift";

export const metadata = {
  title: "Transit Mode Shift — EcoQuest GreenLedger",
  description: "Calculate the impact of shifting trips from driving to Cerritos on Wheels, walking, or biking",
};

export default function TransitPage() {
  return (
    <div className="container-custom py-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <Bus className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="section-title mb-0">Transit Mode Shift</h1>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Explore Cerritos on Wheels (COW) routes and calculate the environmental
          and financial impact of choosing transit, walking, or biking.
        </p>
        <div className="section-underline mt-3" />
      </div>

      <TransitModeShift />
    </div>
  );
}

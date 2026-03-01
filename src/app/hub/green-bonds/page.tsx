import { Landmark } from "lucide-react";
import GreenBondSimulator from "@/components/bonds/GreenBondSimulator";

export const metadata = {
  title: "Green Bond Simulator — EcoQuest GreenLedger",
  description: "Educational micro green bond simulator using real Cerritos infrastructure projects",
};

export default function GreenBondsPage() {
  return (
    <div className="container-custom py-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Landmark className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="section-title mb-0">Green Bond Simulator</h1>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Learn municipal finance by issuing and investing in simulated green
          bonds tied to real Cerritos sustainability projects.
        </p>
        <div className="section-underline mt-3" />
      </div>

      <GreenBondSimulator />
    </div>
  );
}

import { Zap } from "lucide-react";
import EnergyLiteracyModule from "@/components/energy/EnergyLiteracyModule";

export const metadata = {
  title: "Energy Literacy — EcoQuest GreenLedger",
  description: "Interactive energy education module for Cerritos, CA",
};

export default function EnergyLiteracyPage() {
  return (
    <div className="container-custom py-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h1 className="section-title mb-0">Energy Literacy</h1>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Explore Cerritos&apos;s energy story, California&apos;s power mix, and
          calculate your own carbon footprint.
        </p>
        <div className="section-underline mt-3" />
      </div>

      <EnergyLiteracyModule />
    </div>
  );
}

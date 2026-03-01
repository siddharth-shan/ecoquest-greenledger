import { Droplets } from "lucide-react";
import WaterFinanceModule from "@/components/water/WaterFinanceModule";

export const metadata = {
  title: "Water Finance — EcoQuest GreenLedger",
  description: "Interactive financial case study of Cerritos's recycled water program",
};

export default function WaterFinancePage() {
  return (
    <div className="container-custom py-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="section-title mb-0">Water Finance</h1>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Explore the financial impact of Cerritos&apos;s recycled water program —
          722 million gallons saved annually since 1988.
        </p>
        <div className="section-underline mt-3" />
      </div>

      <WaterFinanceModule />
    </div>
  );
}

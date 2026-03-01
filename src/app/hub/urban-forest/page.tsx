import { TreePine } from "lucide-react";
import UrbanForestModule from "@/components/forest/UrbanForestModule";

export const metadata = {
  title: "Urban Forest Finance — EcoQuest GreenLedger",
  description: "Model Cerritos trees as municipal assets with quantifiable financial benefits",
};

export default function UrbanForestPage() {
  return (
    <div className="container-custom py-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <TreePine className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="section-title mb-0">Urban Forest Finance</h1>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Explore Cerritos&apos;s 30,000+ tree urban forest as a municipal asset.
          Model costs, benefits, and create capital improvement plans.
        </p>
        <div className="section-underline mt-3" />
      </div>

      <UrbanForestModule />
    </div>
  );
}

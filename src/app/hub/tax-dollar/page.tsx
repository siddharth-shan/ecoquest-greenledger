import { Receipt } from "lucide-react";
import TaxDollarCalculator from "@/components/budget/TaxDollarCalculator";

export const metadata = {
  title: "Your Tax Dollar — EcoQuest GreenLedger",
  description:
    "See exactly where your sales tax goes when you shop in Cerritos. Interactive calculator showing how every dollar funds city services.",
};

export default function TaxDollarPage() {
  return (
    <div className="container-custom py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-eco-green-light flex items-center justify-center">
            <Receipt className="w-5 h-5 text-eco-green" />
          </div>
          <h1 className="section-title mb-0">
            Your Tax <span className="text-gradient">Dollar</span>
          </h1>
        </div>
        <p className="text-gray-500 text-sm">
          See exactly where your money goes when you shop in Cerritos.
        </p>
        <div className="section-underline mt-3" />
      </div>

      <TaxDollarCalculator />
    </div>
  );
}

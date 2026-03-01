import { Wallet } from "lucide-react";
import GreenWalletModule from "@/components/wallet/GreenWalletModule";

export const metadata = {
  title: "Green Wallet — EcoQuest GreenLedger",
  description: "Budget-capped micro-incentives for verified sustainability actions in Cerritos",
};

export default function GreenWalletPage() {
  return (
    <div className="container-custom py-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="section-title mb-0">Green Wallet</h1>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Earn $Eco rewards for verified sustainability actions. Learn how
          budget-capped incentive programs work — just like real city programs.
        </p>
        <div className="section-underline mt-3" />
      </div>

      <GreenWalletModule />
    </div>
  );
}

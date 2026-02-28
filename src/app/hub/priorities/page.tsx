import { ListOrdered, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Community Priorities — EcoQuest GreenLedger",
};

export default function PrioritiesPage() {
  return (
    <div className="container-custom py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-eco-orange/10 flex items-center justify-center">
            <ListOrdered className="w-5 h-5 text-eco-orange" />
          </div>
          <h1 className="section-title mb-0">Community Priorities</h1>
        </div>
        <p className="text-gray-500 text-sm">
          Share your voice on what sustainability issues matter most to Cerritos.
        </p>
        <div className="section-underline mt-3" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-eco-orange/10 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-eco-orange" />
        </div>
        <h2 className="font-heading font-bold text-xl mb-2">Coming Soon</h2>
        <p className="text-gray-500 text-sm">
          We&apos;re building a community survey where you can rank sustainability
          priorities for Cerritos. Your voice will help shape how the city
          allocates resources for parks, water, waste, and more.
        </p>
      </div>
    </div>
  );
}

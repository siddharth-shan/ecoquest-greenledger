import { Megaphone, Send } from "lucide-react";

export const metadata = {
  title: "Civic Actions — EcoQuest GreenLedger",
};

export default function CivicPage() {
  return (
    <div className="container-custom py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-eco-blue-light flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-eco-blue" />
          </div>
          <h1 className="section-title mb-0">Civic Actions</h1>
        </div>
        <p className="text-gray-500 text-sm">
          Tools to help you engage with Cerritos city government on sustainability.
        </p>
        <div className="section-underline mt-3" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-eco-blue-light flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-eco-blue" />
        </div>
        <h2 className="font-heading font-bold text-xl mb-2">Coming Soon</h2>
        <p className="text-gray-500 text-sm">
          We&apos;re building a feedback builder to help you write messages to city
          council, a public meeting explainer, and a volunteer connector — all
          designed to make civic participation easy and effective.
        </p>
      </div>
    </div>
  );
}

import { Building2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-civic-primary flex items-center justify-center animate-pulse">
        <Building2 className="w-7 h-7 text-white" />
      </div>
      <p className="text-sm text-gray-400 font-medium">Loading...</p>
    </div>
  );
}

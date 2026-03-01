import Link from "next/link";
import { Building2, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
      <div className="w-16 h-16 rounded-2xl bg-civic-primary flex items-center justify-center">
        <Building2 className="w-10 h-10 text-white" />
      </div>
      <div className="text-center">
        <h1 className="font-heading font-bold text-4xl text-gray-900 mb-2">
          404
        </h1>
        <p className="text-gray-500 text-lg">
          This page couldn&apos;t be found.
        </p>
      </div>
      <Link
        href="/"
        className="btn btn-primary flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}

import { Building2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="hidden md:block bg-slate-50 border-t border-gray-200 py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-civic-primary" />
            <span className="font-heading font-semibold text-sm text-gray-700">
              GreenLedger — Cerritos, CA
            </span>
          </div>
          <p className="text-sm text-gray-500 text-center">
            Making city budgets understandable for everyone.
          </p>
          <p className="text-xs text-gray-400">
            Data sourced from{" "}
            <a
              href="https://www.cerritos.us/GOVERNMENT/finance/budget.php"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-civic-accent"
            >
              public records
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

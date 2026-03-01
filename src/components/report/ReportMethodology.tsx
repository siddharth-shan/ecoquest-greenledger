import { AlertTriangle } from "lucide-react";

export default function ReportMethodology() {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-heading font-bold text-civic-primary mb-3 border-b border-gray-200 pb-2">
        Methodology &amp; Limitations
      </h2>

      <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
        <div>
          <h3 className="font-bold text-gray-900 mb-1">Data Sources</h3>
          <p>
            All budget figures are drawn from the City of Cerritos FY 2025-26
            Adopted Budget (370+ pages) and the OpenGov Transparency Portal for
            historical trends. Sustainability metrics are sourced from the
            city&apos;s official Green Efforts and Recycled Water program pages.
            Population data comes from the 2020 U.S. Census.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-1">Confidence Levels</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>
              <strong>High confidence:</strong> Total budget figures, department
              totals, revenue categories — directly from adopted budget document.
            </li>
            <li>
              <strong>Medium confidence:</strong> Program-level allocations,
              sustainability percentages — estimated from departmental
              descriptions and publicly available program details.
            </li>
          </ul>
        </div>

        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-800 mb-1">Disclaimer</h3>
            <p className="text-amber-700">
              This report is a student-built civic technology demonstration using
              publicly available data. It is not an official City of Cerritos
              document, nor has it been reviewed or endorsed by city staff.
              For authoritative financial data, refer to the official Adopted
              Budget at cerritos.gov.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

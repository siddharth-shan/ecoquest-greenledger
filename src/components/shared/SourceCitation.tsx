import { FileText } from "lucide-react";
import type { SourceCitation as SourceType } from "@/types/budget";
import FreshnessLabel from "./FreshnessLabel";

interface SourceCitationProps {
  source: SourceType;
  compact?: boolean;
}

export default function SourceCitation({
  source,
  compact = false,
}: SourceCitationProps) {
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
        <FileText className="w-3 h-3" />
        {source.documentName}
      </span>
    );
  }

  return (
    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
      <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {source.documentUrl ? (
            <a
              href={source.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-eco-blue hover:underline"
            >
              {source.documentName}
            </a>
          ) : (
            <span className="text-sm font-medium text-gray-700">
              {source.documentName}
            </span>
          )}
          <FreshnessLabel level={source.freshnessLabel} />
        </div>
        {source.pageNumber && (
          <p className="text-xs text-gray-400 mt-0.5">
            Page {source.pageNumber}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-0.5">
          Accessed {source.accessDate}
        </p>
      </div>
    </div>
  );
}

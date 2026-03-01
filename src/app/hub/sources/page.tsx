import { FileText, ExternalLink, ShieldCheck } from "lucide-react";
import FreshnessLabel from "@/components/shared/FreshnessLabel";
import DataDictionaryPanel from "@/components/sources/DataDictionaryPanel";
import sourcesData from "@/data/sources.json";
import sourcesMetadata from "@/data/sources-metadata.json";
import type { SourceMetadata } from "@/types/budget";

const metadataMap = new Map(
  (sourcesMetadata.metadata as SourceMetadata[]).map((m) => [m.sourceId, m])
);

export const metadata = {
  title: "Data Sources — EcoQuest GreenLedger",
};

export default function SourcesPage() {
  return (
    <div className="container-custom py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-gray-600" />
          </div>
          <h1 className="section-title mb-0">Data Sources</h1>
        </div>
        <p className="text-gray-500 text-sm">
          All data in GreenLedger comes from official public records. Here are
          our sources with full methodology and data dictionaries.
        </p>
        <div className="section-underline mt-3" />
      </div>

      {/* Data credibility intro */}
      <div className="bg-civic-primary-light rounded-xl p-4 mb-6 max-w-2xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-civic-primary shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-civic-primary mb-1">
            Our Data Credibility Approach
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Every figure in GreenLedger is traceable to an official source.
            Expand any source below to see its update frequency, measurement
            methodology, data field definitions, precision levels, and known
            limitations. Fields marked &quot;direct&quot; come straight from the source;
            &quot;derived&quot; fields are calculated or editorially assigned by GreenLedger.
          </p>
        </div>
      </div>

      <div className="space-y-4 max-w-2xl">
        {sourcesData.sources.map((source) => {
          const meta = metadataMap.get(source.id);
          return (
            <div
              key={source.id}
              className="bg-white rounded-xl border border-gray-100 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {source.documentName}
                    </h3>
                    <FreshnessLabel
                      level={
                        source.freshnessLabel as
                          | "current"
                          | "recent"
                          | "historical"
                      }
                    />
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    {source.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {source.dataUsedFor.map((use) => (
                      <span
                        key={use}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                      >
                        {use}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Accessed: {source.accessDate}
                  </p>
                </div>
                {source.documentUrl && (
                  <a
                    href={source.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                )}
              </div>

              {meta && <DataDictionaryPanel metadata={meta} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

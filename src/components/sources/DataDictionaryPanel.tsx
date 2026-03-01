"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, AlertTriangle, Clock } from "lucide-react";
import ConfidenceIndicator from "./ConfidenceIndicator";
import type { SourceMetadata, ConfidenceLevel } from "@/types/budget";

interface DataDictionaryPanelProps {
  metadata: SourceMetadata;
}

export default function DataDictionaryPanel({ metadata }: DataDictionaryPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-xs text-civic-primary font-medium hover:text-civic-primary/80 transition-colors w-full text-left"
      >
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5" />
        )}
        Data Dictionary &amp; Methodology
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2">
            <ConfidenceIndicator level={metadata.confidenceLevel as ConfidenceLevel} />
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 rounded-full px-2 py-0.5">
              <Clock className="w-3 h-3" />
              {metadata.updateFrequency}
            </span>
            <span className="text-xs text-gray-400">
              Verified: {metadata.lastVerified}
            </span>
          </div>

          {/* Methodology */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-1">
              Methodology
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              {metadata.methodology}
            </p>
          </div>

          {/* Data Fields Table */}
          {metadata.dataFields.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-1">
                Data Fields
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-1 pr-2 text-gray-600 font-medium">
                        Field
                      </th>
                      <th className="text-left py-1 px-2 text-gray-600 font-medium">
                        Description
                      </th>
                      <th className="text-left py-1 px-2 text-gray-600 font-medium">
                        Unit
                      </th>
                      <th className="text-left py-1 px-2 text-gray-600 font-medium">
                        Precision
                      </th>
                      <th className="text-left py-1 pl-2 text-gray-600 font-medium">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {metadata.dataFields.map((field) => (
                      <tr
                        key={field.fieldName}
                        className="border-b border-gray-50"
                      >
                        <td className="py-1.5 pr-2 text-gray-800 font-medium">
                          {field.fieldName}
                        </td>
                        <td className="py-1.5 px-2 text-gray-500">
                          {field.description}
                        </td>
                        <td className="py-1.5 px-2 text-gray-500">
                          {field.unit}
                        </td>
                        <td className="py-1.5 px-2 text-gray-500">
                          {field.precision}
                        </td>
                        <td className="py-1.5 pl-2">
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded ${
                              field.type === "direct"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-purple-50 text-purple-700"
                            }`}
                          >
                            {field.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Limitations */}
          {metadata.limitations.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                Limitations
              </h4>
              <ul className="space-y-1">
                {metadata.limitations.map((limitation, i) => (
                  <li
                    key={i}
                    className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1"
                  >
                    {limitation}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import Modal from "@/components/ui/Modal";
import type { GlossaryTerm } from "@/types/budget";

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  terms: GlossaryTerm[];
}

export default function GlossaryModal({
  isOpen,
  onClose,
  terms,
}: GlossaryModalProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return terms;
    const q = search.toLowerCase();
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q)
    );
  }, [terms, search]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Budget Glossary">
      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search terms..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-eco-green/20 focus:border-eco-green outline-none transition-all text-sm"
          />
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {filtered.map((term) => (
            <div
              key={term.term}
              className="p-3 rounded-lg bg-gray-50 border border-gray-100"
            >
              <h4 className="font-semibold text-sm text-gray-900 mb-1">
                {term.term}
              </h4>
              <p className="text-sm text-gray-600">{term.definition}</p>
              {term.example && (
                <p className="text-xs text-eco-green mt-1.5 italic">
                  Example: {term.example}
                </p>
              )}
              {term.relatedTerms && term.relatedTerms.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {term.relatedTerms.map((rt) => (
                    <span
                      key={rt}
                      className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full"
                    >
                      {rt}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">
              No terms found matching &quot;{search}&quot;
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}

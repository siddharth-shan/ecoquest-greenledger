"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircleQuestion,
  Send,
  Loader2,
  Sparkles,
  FileText,
} from "lucide-react";
import type { QAMessage } from "@/types/budget-qa";

const SUGGESTED_QUESTIONS = [
  "How much does Cerritos spend on community safety?",
  "What's the biggest source of city revenue?",
  "How has the budget changed over 10 years?",
  "What sustainability programs does the city run?",
];

export default function BudgetQAPage() {
  const [messages, setMessages] = useState<QAMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(question?: string) {
    const text = question || input.trim();
    if (!text || isLoading) return;

    setInput("");
    const userMessage: QAMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/budget-qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response");
      }

      const data = await res.json();
      const assistantMessage: QAMessage = {
        role: "assistant",
        content: data.answer,
        sources: data.sources,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I had trouble processing your question. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="container-custom section-padding">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-civic-primary flex items-center justify-center">
              <MessageCircleQuestion className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Budget Q&A</h1>
              <p className="text-sm text-gray-500">
                AI-powered answers from verified Cerritos budget data
              </p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="min-h-[400px] max-h-[60vh] overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Sparkles className="w-8 h-8 text-civic-primary/40 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-4">
                  Ask any question about the Cerritos city budget, spending, or
                  sustainability programs.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSubmit(q)}
                      className="text-left text-xs bg-gray-50 hover:bg-civic-primary-light border border-gray-200 hover:border-civic-primary/30 rounded-lg px-3 py-2.5 text-gray-700 hover:text-civic-primary-dark transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-civic-primary text-white"
                      : "bg-gray-50 text-gray-800 border border-gray-100"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Sources
                      </p>
                      {msg.sources.map((src, j) => (
                        <p key={j} className="text-xs text-gray-500">
                          {src.document}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                  <Loader2 className="w-4 h-4 text-civic-primary animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the Cerritos budget..."
                className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-civic-primary/30 focus:border-civic-primary"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="shrink-0 w-10 h-10 rounded-lg bg-civic-primary text-white flex items-center justify-center hover:bg-civic-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              Answers are generated from verified city budget data. Always verify
              important figures with official sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

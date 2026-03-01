export interface SourceCitation {
  document: string;
  detail: string;
}

export interface QAMessage {
  role: "user" | "assistant";
  content: string;
  sources?: SourceCitation[];
}

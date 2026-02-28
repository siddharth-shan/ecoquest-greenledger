export interface SurveyQuestion {
  id: string;
  question: string;
  type: "rating" | "multiple_choice" | "free_text";
  options?: string[];
  required: boolean;
}

export interface SurveyResponse {
  surveyId: string;
  userId: string;
  answers: Record<string, string | number>;
  submittedAt: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: "meeting" | "volunteer" | "workshop";
  signUpUrl?: string;
}

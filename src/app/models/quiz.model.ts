// src/app/models/quiz.model.ts
export interface Quiz {
  id: number;
  title: string;
  attemptedAt: string;
  score: number;
  totalQuestions: number;
  lessonId: number;
  userId?: number;
}

export interface Question {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  userAnswer: string | null;
  correct: boolean;
}

export interface QuizSubmission {
  lessonId: number;
  answers: Answer[];
}

export interface Answer {
  questionId: number;
  selectedAnswer: string;
}
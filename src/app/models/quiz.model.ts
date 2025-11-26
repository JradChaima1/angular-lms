export interface Quiz {
  id: number;
  lessonId: number;
  title: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
}

export interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizAttempt {
  id: number;
  quizId: number;
  userId: number;
  score: number;
  answers: number[];
  completedAt: Date;
  passed: boolean;
}

export interface QuizSubmission {
  lessonId: number;
  answers: QuestionAnswer[];
}

export interface QuestionAnswer {
  questionId: number;
  selectedAnswer: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  answers: QuestionResult[];
}

export interface QuestionResult {
  questionId: number;
  questionText: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation?: string;
}

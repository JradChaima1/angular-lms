import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { ToastService } from '../../services/toast.service';
import { Quiz, QuizResult } from '../../models/quiz.model';
import { IconsModule } from '../../shared/icons.module';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, IconsModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent implements OnInit {
  quiz: Quiz | null = null;
  currentQuestionIndex: number = 0;
  selectedAnswers: number[] = [];
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  showResults: boolean = false;
  quizResult: QuizResult | null = null;
  timeRemaining: number = 0;
  timerInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));
    if (lessonId) {
      this.loadQuiz(lessonId);
    }
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  loadQuiz(lessonId: number): void {
    this.quizService.getQuizByLessonId(lessonId).subscribe({
      next: (quiz) => {
        this.quiz = quiz;
        
        if (!quiz.questions || quiz.questions.length === 0) {
          this.toastService.error('This quiz has no questions');
          this.isLoading = false;
          return;
        }
        this.selectedAnswers = new Array(quiz.questions.length).fill(-1);
        if (quiz.timeLimit) {
          this.timeRemaining = quiz.timeLimit * 60;
          this.startTimer();
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.toastService.error('Failed to load quiz');
        this.isLoading = false;
        console.error('Error loading quiz:', error);
      }
    });
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.submitQuiz();
      }
    }, 1000);
  }

  selectAnswer(answerIndex: number): void {
    this.selectedAnswers[this.currentQuestionIndex] = answerIndex;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < (this.quiz?.questions.length || 0) - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  goToQuestion(index: number): void {
    this.currentQuestionIndex = index;
  }

  canSubmit(): boolean {
    return this.selectedAnswers.every(answer => answer !== -1);
  }

  submitQuiz(): void {
    if (!this.quiz || this.isSubmitting) return;

    if (!this.canSubmit()) {
      this.toastService.warning('Please answer all questions before submitting');
      return;
    }

    this.isSubmitting = true;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    const submission = {
     lessonId: this.quiz.lessonId,
     answers: this.quiz.questions.map((question, index) => ({
    questionId: question.id,
    selectedAnswer: this.getAnswerLetter(this.selectedAnswers[index])
  }))
};




    this.quizService.submitQuiz(submission).subscribe({
      next: (result) => {
        this.quizResult = result;
        this.showResults = true;
        this.isSubmitting = false;
        if (result.passed) {
          this.toastService.success('Congratulations! You passed! 🎉');
        } else {
          this.toastService.info('Keep trying! You can retake the quiz.');
        }
      },
      error: (error) => {
        this.toastService.error('Failed to submit quiz');
        this.isSubmitting = false;
        console.error('Error submitting quiz:', error);
      }
    });
  }

 retakeQuiz(): void {
  this.showResults = false;
  this.quizResult = null;
  this.currentQuestionIndex = 0;
  this.selectedAnswers = new Array(this.quiz?.questions.length || 0).fill(-1);
  
  
  setTimeout(() => {
    if (this.quiz?.timeLimit) {
      this.timeRemaining = this.quiz.timeLimit * 60;
      this.startTimer();
    }
  }, 0);
}

  goBack(): void {
    this.router.navigate(['/courses']);
  }

  getTimeFormatted(): string {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  getAnswerLetter(index: number): string {
  const letters = ['A', 'B', 'C', 'D'];
  return letters[index] || 'A';
}

  getProgressPercentage(): number {
    const answered = this.selectedAnswers.filter(a => a !== -1).length;
    return (answered / (this.quiz?.questions.length || 1)) * 100;
  }
}

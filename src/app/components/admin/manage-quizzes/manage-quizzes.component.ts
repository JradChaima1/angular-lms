import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { CourseService } from '../../../services/course.service';
import { ToastService } from '../../../services/toast.service';
import { IconsModule } from '../../../shared/icons.module';

interface Course {
  id: number;
  title: string;
}

interface Lesson {
  id: number;
  title: string;
  courseId: number;
}

interface Question {
  id?: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
}

interface Quiz {
  id?: number;
  title: string;
  lessonId: number;
  questions: Question[];
}

@Component({
  selector: 'app-manage-quizzes',
  standalone: true,
  imports: [CommonModule, FormsModule, IconsModule],
  templateUrl: './manage-quizzes.component.html',
  styleUrl: './manage-quizzes.component.scss'
})
export class ManageQuizzesComponent implements OnInit {
  courses: Course[] = [];
  lessons: Lesson[] = [];
  selectedCourseId: number | null = null;
  selectedLessonId: number | null = null;
  
  quiz: Quiz = {
    title: '',
    lessonId: 0,
    questions: []
  };

  currentQuestion: Question = {
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A'
  };

  existingQuiz: any = null;
  existingQuestions: Question[] = []; 
  newQuestions: Question[] = []; 
  isLoading = false;
  showDeleteModal = false;
  questionToDelete: { id: number; index: number } | null = null;

  constructor(
    private adminService: AdminService,
    private courseService: CourseService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.adminService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: (error) => {
        this.toastService.error('Failed to load courses');
        console.error('Error loading courses:', error);
      }
    });
  }

  onCourseChange(): void {
    if (this.selectedCourseId) {
      this.loadLessons(this.selectedCourseId);
      this.selectedLessonId = null;
      this.existingQuiz = null;
      this.resetQuiz();
    }
  }

  loadLessons(courseId: number): void {
    this.courseService.getCourseLessons(courseId).subscribe({
      next: (lessons) => {
        this.lessons = lessons;
      },
      error: (error) => {
        this.toastService.error('Failed to load lessons');
        console.error('Error loading lessons:', error);
      }
    });
  }

  onLessonChange(): void {
    if (this.selectedLessonId) {
      this.loadExistingQuiz(this.selectedLessonId);
    }
  }

  loadExistingQuiz(lessonId: number): void {
    this.isLoading = true;
    this.courseService.getQuizByLesson(lessonId).subscribe({
      next: (quiz) => {
        this.existingQuiz = quiz;
        this.quiz.title = quiz.title;
        this.quiz.lessonId = lessonId;
        this.existingQuestions = quiz.questions || [];
        this.newQuestions = [];
        this.quiz.questions = [];
        this.isLoading = false;
        this.toastService.success(`Quiz loaded with ${this.existingQuestions.length} questions`);
      },
      error: () => {
        
        this.existingQuiz = null;
        this.existingQuestions = [];
        this.newQuestions = [];
        this.quiz = {
          title: '',
          lessonId: lessonId,
          questions: []
        };
        this.isLoading = false;
      }
    });
  }

  addQuestion(): void {
    if (!this.validateQuestion()) {
      this.toastService.error('Please fill all question fields');
      return;
    }

    this.newQuestions.push({ ...this.currentQuestion });
    this.resetCurrentQuestion();
    this.toastService.success(`Question added (${this.newQuestions.length} new)`);
  }

  removeQuestion(index: number): void {
    this.newQuestions.splice(index, 1);
    this.toastService.success('Question removed');
  }

  deleteExistingQuestion(questionId: number | undefined, index: number): void {
    if (!questionId) {
      this.toastService.error('Cannot delete question without ID');
      return;
    }

    this.questionToDelete = { id: questionId, index };
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.questionToDelete) return;

    this.adminService.deleteQuestion(this.questionToDelete.id).subscribe({
      next: () => {
        this.existingQuestions.splice(this.questionToDelete!.index, 1);
        this.toastService.success('Question deleted successfully');
        this.closeDeleteModal();
      },
      error: (error) => {
        this.toastService.error('Failed to delete question');
        console.error('Error deleting question:', error);
        this.closeDeleteModal();
      }
    });
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.questionToDelete = null;
  }

  validateQuestion(): boolean {
    return !!(
      this.currentQuestion.questionText &&
      this.currentQuestion.optionA &&
      this.currentQuestion.optionB &&
      this.currentQuestion.optionC &&
      this.currentQuestion.optionD &&
      this.currentQuestion.correctAnswer
    );
  }

  resetCurrentQuestion(): void {
    this.currentQuestion = {
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A'
    };
  }

  saveQuiz(): void {
    if (!this.quiz.title) {
      this.toastService.error('Please enter quiz title');
      return;
    }

    if (!this.selectedLessonId) {
      this.toastService.error('Please select a lesson');
      return;
    }

    
    const titleChanged = this.existingQuiz && this.existingQuiz.title !== this.quiz.title;
    
   
    const hasNewQuestions = this.newQuestions.length > 0;

    if (!titleChanged && !hasNewQuestions) {
      this.toastService.error('No changes to save');
      return;
    }

    this.isLoading = true;

  
    if (this.existingQuiz && this.existingQuiz.id) {
    
      if (titleChanged) {
        const quizData = { 
          title: this.quiz.title, 
          lessonId: Number(this.selectedLessonId) 
        };
        this.adminService.updateQuiz(this.existingQuiz.id, quizData).subscribe({
          next: () => {
            this.existingQuiz.title = this.quiz.title;
            this.toastService.success('Quiz title updated');
            
          
            if (hasNewQuestions) {
              this.addQuestionsToQuiz(this.existingQuiz.id, this.newQuestions);
            } else {
              this.isLoading = false;
            }
          },
          error: (err) => {
            this.toastService.error('Failed to update quiz title');
            console.error('Error updating quiz:', err);
            this.isLoading = false;
          }
        });
      } else {
       
        this.addQuestionsToQuiz(this.existingQuiz.id, this.newQuestions);
      }
    } else {
     
      if (!hasNewQuestions) {
        this.toastService.error('Please add at least one question');
        this.isLoading = false;
        return;
      }

      const quizData = {
        title: this.quiz.title,
        lessonId: Number(this.selectedLessonId)
      };

      this.adminService.createQuiz(Number(this.selectedLessonId), quizData).subscribe({
        next: (createdQuiz) => {
          this.addQuestionsToQuiz(createdQuiz.id, this.newQuestions);
        },
        error: (err) => {
          this.toastService.error('Failed to create quiz');
          console.error('Error creating quiz:', err);
          this.isLoading = false;
        }
      });
    }
  }

  private addQuestionsToQuiz(quizId: number, questions: Question[]): void {
    this.addQuestionSequentially(quizId, questions, 0);
  }

  private addQuestionSequentially(quizId: number, questions: Question[], index: number): void {
    if (index >= questions.length) {
      
      this.toastService.success(`${questions.length} questions added successfully! 🎉`);
      this.existingQuiz = { id: quizId, title: this.quiz.title };
      this.quiz.id = quizId;
      
      setTimeout(() => {
        this.loadExistingQuiz(this.selectedLessonId!);
      }, 500);
      return;
    }

    const question = questions[index];
    console.log(`Adding question ${index + 1} of ${questions.length}:`, question);

    this.adminService.addQuestion(quizId, question).subscribe({
      next: (savedQuestion) => {
        console.log(`Question ${index + 1} saved successfully:`, savedQuestion);
      
        this.addQuestionSequentially(quizId, questions, index + 1);
      },
      error: (error) => {
        const errorMsg = error?.error?.message || error?.message || 'Unknown error';
        console.error(`Error adding question ${index + 1}:`, error);
        this.toastService.error(`Failed to add question ${index + 1}: ${errorMsg}`);
        this.isLoading = false;
      }
    });
  }

  resetQuiz(): void {
    this.quiz = {
      title: '',
      lessonId: 0,
      questions: []
    };
    this.resetCurrentQuestion();
  }

  getCorrectAnswerText(question: Question): string {
    const answerMap: { [key: string]: string } = {
      'A': question.optionA,
      'B': question.optionB,
      'C': question.optionC,
      'D': question.optionD
    };
    return answerMap[question.correctAnswer] || '';
  }
}

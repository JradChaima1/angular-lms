import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Quiz, QuizSubmission, QuizResult, QuizAttempt } from '../models/quiz.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private authService: AuthService
  ) {}
  
  getQuizByLessonId(lessonId: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/quizzes/lesson/${lessonId}`);
  }

  submitQuiz(submission: QuizSubmission): Observable<QuizResult> {
  const userId = this.authService.getCurrentUserId();
  return this.http.post<QuizResult>(`${this.apiUrl}/quizzes/${userId}/submit`, submission);
}



  getMyQuizHistory(): Observable<QuizAttempt[]> {
    return this.http.get<QuizAttempt[]>(`${this.apiUrl}/quizzes/me/history`);
  }

  getQuizAttempt(attemptId: number): Observable<QuizAttempt> {
    return this.http.get<QuizAttempt>(`${this.apiUrl}/quizzes/attempts/${attemptId}`);
  }
}

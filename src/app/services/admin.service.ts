import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';
import { User } from '../models/user.model';

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalQuizzes: number;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  imageUrl?: string;
}

export interface CreateLessonRequest {
  title: string;
  content: string;
  lessonOrder: number;
  videoUrl?: string;
  duration: number;
}

export interface CreateQuizRequest {
  title: string;
}

export interface CreateQuestionRequest {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'https://lms-backend-1-9lds.onrender.com/api/admin'; // Update with your Render URL

  constructor(private http: HttpClient) {}

 
  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/stats`);
  }

 
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
  }

  
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`);
  }

  createCourse(course: CreateCourseRequest): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/courses`, course);
  }

  updateCourse(courseId: number, course: CreateCourseRequest): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/courses/${courseId}`, course);
  }

  deleteCourse(courseId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/courses/${courseId}`);
  }

  
  createLesson(courseId: number, lesson: CreateLessonRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/lessons`, lesson);
  }

  updateLesson(lessonId: number, lesson: CreateLessonRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/lessons/${lessonId}`, lesson);
  }

  deleteLesson(lessonId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/lessons/${lessonId}`);
  }

  
  createQuiz(lessonId: number, quiz: CreateQuizRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/lessons/${lessonId}/quiz`, quiz);
  }

  updateQuiz(quizId: number, quiz: CreateQuizRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/quizzes/${quizId}`, quiz);
  }

  addQuestion(quizId: number, question: CreateQuestionRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/quizzes/${quizId}/questions`, question);
  }

  deleteQuestion(questionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/questions/${questionId}`);
  }

  uploadCourseImage(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:8080/api/upload/course-image', formData);
  }
}

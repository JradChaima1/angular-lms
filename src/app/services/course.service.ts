import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, Lesson } from '../models/course.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = environment.apiUrl; // Update with your Render URL

  constructor(private http: HttpClient) {}

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/courses/${id}`);
  }

  getCourseLessons(courseId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}/courses/${courseId}/lessons`);
  }

  getLessonById(lessonId: number): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.apiUrl}/courses/lessons/${lessonId}`);
  }

  enrollInCourse(courseId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/users/me/enrollments/${courseId}`, {});
  }

  getCoursesByCategory(category: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses/category/${category}`);
  }

  getMyEnrolledCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/users/me/courses`);
  }

  getQuizByLesson(lessonId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/quizzes/lesson/${lessonId}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://delighted-marrilee-chaimajrad1888spersonalcount-f3b38ced.koyeb.app/api'; 
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkExistingToken();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
     
          localStorage.setItem('token', response.token);
          this.fetchCurrentUser();
        })
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/me`);

  }
  getCurrentUserId(): number | null {
  return this.currentUserSubject.value?.id || null;
}


  private fetchCurrentUser(): void {
    this.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUserSubject.next(user);
      },
      error: (error) => {
        // Only logout if it's a 401/403 (unauthorized) error
        if (error.status === 401 || error.status === 403) {
          this.logout();
        } else {
          // Network or other error - retry after a short delay
          setTimeout(() => {
            this.fetchCurrentUser();
          }, 1000);
        }
      }
    });
  }

  private checkExistingToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.fetchCurrentUser();
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }
  updateProfile(profileData: { name: string; email: string }): Observable<User> {
  return this.http.put<User>(`${this.apiUrl}/users/me`, profileData)
    .pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      })
    );
}

}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Achievement } from '../models/achievement.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private apiUrl = 'https://delighted-marrilee-chaimajrad1888spersonalcount-f3b38ced.koyeb.app/api'

  constructor(private http: HttpClient) {}

  getAllAchievements(): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(`${this.apiUrl}/achievements`);
  }

  getMyAchievements(): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(`${this.apiUrl}/achievements/me`);
  }

  getUserAchievements(userId: number): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(`${this.apiUrl}/achievements/${userId}`);
  }

  checkAchievements(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/achievements/check`, {});
  }
}

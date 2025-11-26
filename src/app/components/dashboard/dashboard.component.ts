import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CourseService } from '../../services/course.service';
import { AchievementService } from '../../services/achievement.service';
import { User } from '../../models/user.model';
import { Course } from '../../models/course.model';
import { Achievement } from '../../models/achievement.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  enrolledCourses: Course[] = [];
  achievements: Achievement[] = [];
  isLoading: boolean = true;

  constructor(
    private authService: AuthService,
    private courseService: CourseService,
    private achievementService: AchievementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.loadEnrolledCourses();
    
  }

  loadEnrolledCourses(): void {
    this.courseService.getMyEnrolledCourses().subscribe({
      next: (courses) => {
        console.log('Loaded courses with progress:', courses); 
        this.enrolledCourses = courses;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading enrolled courses:', error);
        this.isLoading = false;
      }
    });
  }

 viewCourse(courseId: number): void {
  if (courseId === 0) {
    this.router.navigate(['/courses']);
  } else {
    this.router.navigate(['/courses', courseId]);
  }
}

  getEnrolledCount(): number {
    return this.enrolledCourses.length;
  }

  getCompletedCount(): number {
    return this.enrolledCourses.filter(c => c.progress === 100).length;
  }

  getInProgressCount(): number {
    return this.enrolledCourses.filter(c => c.progress && c.progress > 0 && c.progress < 100).length;
  }

  getCourseIcon(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'MATH': '🔢',
      'SCIENCE': '🔬',
      'READING': '📖',
      'ART': '🎨',
      'MUSIC': '🎵',
      'PROGRAMMING': '💻'
    };
    return categoryMap[category] || '📚';
  }
}

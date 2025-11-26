import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Course, Lesson } from '../../models/course.model';
import { IconsModule } from '../../shared/icons.module';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, IconsModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  lessons: Lesson[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  selectedLesson: Lesson | null = null;

constructor(
  private route: ActivatedRoute,
  private router: Router,
  private courseService: CourseService,
  private toastService: ToastService
) {}
  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    if (courseId) {
      this.loadCourse(courseId);
      this.loadLessons(courseId);
    }
  }

  loadCourse(courseId: number): void {
    this.courseService.getCourseById(courseId).subscribe({
      next: (course) => {
        this.course = course;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load course details.';
        this.isLoading = false;
        console.error('Error loading course:', error);
      }
    });
  }

  loadLessons(courseId: number): void {
    this.courseService.getCourseLessons(courseId).subscribe({
      next: (lessons) => {
        this.lessons = lessons.sort((a, b) => a.order - b.order);
      },
      error: (error) => {
        console.error('Error loading lessons:', error);
      }
    });
  }

  selectLesson(lesson: Lesson): void {
    this.selectedLesson = lesson;
  }

  enrollInCourse(): void {
  if (this.course) {
    this.courseService.enrollInCourse(this.course.id).subscribe({
      next: () => {
        alert('Successfully enrolled! 🎉');
        this.loadCourse(this.course!.id);
      },
      error: (error) => {
        alert('Failed to enroll. Please try again.');
        console.error('Error enrolling:', error);
      }
    });
  }
}

  goBack(): void {
    this.router.navigate(['/courses']);
  }
  takeQuiz(): void {
  if (this.selectedLesson) {
    this.router.navigate(['/quiz', this.selectedLesson.id]);
  }
}

  getCourseIcon(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'MATH': '🔢',
      'SCIENCE': '🔬',
      'READING': '📖',
      'ART': '🎨',
      'MUSIC': '🎵'
    };
    return categoryMap[category] || '📚';
  }
}

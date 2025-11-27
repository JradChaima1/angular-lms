import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { IconsModule } from '../../shared/icons.module';
import { ToastService } from '../../services/toast.service';
import { ImageUrlPipe } from '../../pipes/image-url.pipe';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, IconsModule, ImageUrlPipe],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  selectedCategory: string = 'all';

  categories = [
    { value: 'all', label: 'All Courses', icon: 'book-open' },
    { value: 'MATH', label: 'Math', icon: 'calculator' },
    { value: 'SCIENCE', label: 'Science', icon: 'book' },
    { value: 'READING', label: 'Reading', icon: 'book' },
    { value: 'ART', label: 'Art', icon: 'palette' },
    { value: 'MUSIC', label: 'Music', icon: 'music' }
  ];

  constructor(
    private courseService: CourseService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.filteredCourses = courses;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load courses. Please try again.';
        this.isLoading = false;
        console.error('Error loading courses:', error);
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'all') {
      this.filteredCourses = this.courses;
    } else {
      this.filteredCourses = this.courses.filter(
        course => course.category === category
      );
    }
  }

  viewCourse(courseId: number): void {
    this.router.navigate(['/courses', courseId]);
  }

  enrollInCourse(courseId: number, event: Event): void {
    event.stopPropagation();
    
    const course = this.courses.find(c => c.id === courseId);
    if (course?.enrolled) {
      this.toastService.info('You are already enrolled in this course!');
      return;
    }

    this.courseService.enrollInCourse(courseId).subscribe({
      next: () => {
        this.toastService.success('Successfully enrolled! 🎉');
        const courseIndex = this.courses.findIndex(c => c.id === courseId);
        if (courseIndex !== -1) {
          this.courses[courseIndex].enrolled = true;
        }
        this.filterByCategory(this.selectedCategory);
      },
      error: (error) => {
        console.error('Enrollment error:', error);
        const errorMsg = error.error?.message || 'Failed to enroll. Please try again.';
        this.toastService.error(errorMsg);
      }
    });
  }

 getCourseIcon(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'MATH': 'assets/books.png',
    'SCIENCE': 'assets/progress.png',
    'Programming': 'assets/reading-icon.png',
    'Physics': 'assets/art-icon.png',
    'Art': 'assets/music-icon.png'
  };
  return categoryMap[category] || 'assets/default-icon.png';
}


  getLessonsCount(course: Course): number {
    return course.lessonCount || course.lessons?.length || 0;
  }
}

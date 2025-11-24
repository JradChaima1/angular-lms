import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule],
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
    { value: 'all', label: 'All Courses', icon: '📚' },
    { value: 'MATH', label: 'Math', icon: '🔢' },
    { value: 'SCIENCE', label: 'Science', icon: '🔬' },
    { value: 'READING', label: 'Reading', icon: '📖' },
    { value: 'ART', label: 'Art', icon: '🎨' },
    { value: 'MUSIC', label: 'Music', icon: '🎵' }
  ];

  constructor(
    private courseService: CourseService,
    private router: Router
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
    this.courseService.enrollInCourse(courseId).subscribe({
      next: () => {
        alert('Successfully enrolled! 🎉');
        this.loadCourses();
      },
      error: (error) => {
        alert('Failed to enroll. Please try again.');
        console.error('Error enrolling:', error);
      }
    });
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

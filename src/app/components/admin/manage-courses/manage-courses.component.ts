import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';
import { Course } from '../../../models/course.model';
import { IconsModule } from '../../../shared/icons.module';

@Component({
  selector: 'app-manage-courses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconsModule],
  templateUrl: './manage-courses.component.html',
  styleUrl: './manage-courses.component.scss'
})
export class ManageCoursesComponent implements OnInit {
  courses: Course[] = [];
  isLoading: boolean = true;
  showModal: boolean = false;
  isEditMode: boolean = false;
  isSaving: boolean = false;
  courseForm: FormGroup;
  selectedCourse: Course | null = null;

  difficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  categories = ['Programming', 'Web Development', 'Math', 'Science', 'Reading', 'Art', 'Music'];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private toastService: ToastService
  ) {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      difficulty: ['', Validators.required],
      duration: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.adminService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.isLoading = false;
      },
      error: (error) => {
        this.toastService.error('Failed to load courses');
        this.isLoading = false;
        console.error('Error loading courses:', error);
      }
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedCourse = null;
    this.courseForm.reset();
    this.showModal = true;
  }

  openEditModal(course: Course): void {
    this.isEditMode = true;
    this.selectedCourse = course;
    this.courseForm.patchValue({
      title: course.title,
      description: course.description,
      category: course.category,
      difficulty: course.difficulty,
      duration: course.duration
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.courseForm.reset();
    this.selectedCourse = null;
  }

  saveCourse(): void {
    if (this.courseForm.invalid) {
      this.toastService.warning('Please fill in all required fields');
      return;
    }

    this.isSaving = true;
    const courseData = this.courseForm.value;

    if (this.isEditMode && this.selectedCourse) {
      this.adminService.updateCourse(this.selectedCourse.id, courseData).subscribe({
        next: () => {
          this.toastService.success('Course updated successfully');
          this.loadCourses();
          this.closeModal();
          this.isSaving = false;
        },
        error: (error) => {
          this.toastService.error('Failed to update course');
          this.isSaving = false;
          console.error('Error updating course:', error);
        }
      });
    } else {
      this.adminService.createCourse(courseData).subscribe({
        next: () => {
          this.toastService.success('Course created successfully');
          this.loadCourses();
          this.closeModal();
          this.isSaving = false;
        },
        error: (error) => {
          this.toastService.error('Failed to create course');
          this.isSaving = false;
          console.error('Error creating course:', error);
        }
      });
    }
  }

  deleteCourse(course: Course): void {
    if (!confirm(`Are you sure you want to delete "${course.title}"? This action cannot be undone.`)) {
      return;
    }

    this.adminService.deleteCourse(course.id).subscribe({
      next: () => {
        this.toastService.success('Course deleted successfully');
        this.loadCourses();
      },
      error: (error) => {
        this.toastService.error('Failed to delete course');
        console.error('Error deleting course:', error);
      }
    });
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Programming': '💻',
      'Web Development': '🌐',
      'Math': '🔢',
      'Science': '🔬',
      'Reading': '📖',
      'Art': '🎨',
      'Music': '🎵'
    };
    return icons[category] || '📚';
  }
}

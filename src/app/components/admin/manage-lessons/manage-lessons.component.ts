import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { CourseService } from '../../../services/course.service';
import { ToastService } from '../../../services/toast.service';
import { Course, Lesson } from '../../../models/course.model';
import { IconsModule } from '../../../shared/icons.module';
import { ImageUrlPipe } from '../../../pipes/image-url.pipe';

@Component({
  selector: 'app-manage-lessons',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconsModule, ImageUrlPipe],
  templateUrl: './manage-lessons.component.html',
  styleUrl: './manage-lessons.component.scss'
})
export class ManageLessonsComponent implements OnInit {
  courses: Course[] = [];
  lessons: Lesson[] = [];
  selectedCourse: Course | null = null;
  isLoading: boolean = true;
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  isEditMode: boolean = false;
  isSaving: boolean = false;
  lessonForm: FormGroup;
  selectedLesson: Lesson | null = null;
  lessonToDelete: Lesson | null = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private courseService: CourseService,
    private toastService: ToastService
  ) {
    this.lessonForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      lessonOrder: [1, [Validators.required, Validators.min(1)]],
      videoUrl: [''],
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
        if (courses.length > 0) {
          this.selectCourse(courses[0]);
        }
      },
      error: (error) => {
        this.toastService.error('Failed to load courses');
        this.isLoading = false;
        console.error('Error loading courses:', error);
      }
    });
  }

  selectCourse(course: Course): void {
    this.selectedCourse = course;
    this.loadLessons(course.id);
  }

  loadLessons(courseId: number): void {
    this.courseService.getCourseLessons(courseId).subscribe({
      next: (lessons) => {
        this.lessons = lessons.sort((a, b) => a.order - b.order);
      },
      error: (error) => {
        this.toastService.error('Failed to load lessons');
        console.error('Error loading lessons:', error);
      }
    });
  }

  openCreateModal(): void {
    if (!this.selectedCourse) {
      this.toastService.warning('Please select a course first');
      return;
    }
    this.isEditMode = false;
    this.selectedLesson = null;
    this.lessonForm.reset({ lessonOrder: this.lessons.length + 1, duration: 0 });
    this.showModal = true;
  }

  openEditModal(lesson: Lesson): void {
    this.isEditMode = true;
    this.selectedLesson = lesson;
    this.lessonForm.patchValue({
      title: lesson.title,
      content: lesson.content,
      lessonOrder: lesson.order,
      videoUrl: lesson.videoUrl || '',
      duration: lesson.duration
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.lessonForm.reset();
    this.selectedLesson = null;
  }

  saveLesson(): void {
    if (this.lessonForm.invalid || !this.selectedCourse) {
      this.toastService.warning('Please fill in all required fields');
      return;
    }

    this.isSaving = true;
    const lessonData = {
      ...this.lessonForm.value,
      order: this.lessonForm.value.lessonOrder
    };

    if (this.isEditMode && this.selectedLesson) {
      this.adminService.updateLesson(this.selectedLesson.id, lessonData).subscribe({
        next: () => {
          this.toastService.success('Lesson updated successfully');
          this.loadLessons(this.selectedCourse!.id);
          this.closeModal();
          this.isSaving = false;
        },
        error: (error) => {
          this.toastService.error('Failed to update lesson');
          this.isSaving = false;
          console.error('Error updating lesson:', error);
        }
      });
    } else {
      this.adminService.createLesson(this.selectedCourse.id, lessonData).subscribe({
        next: () => {
          this.toastService.success('Lesson created successfully');
          this.loadLessons(this.selectedCourse!.id);
          this.closeModal();
          this.isSaving = false;
        },
        error: (error) => {
          this.toastService.error('Failed to create lesson');
          this.isSaving = false;
          console.error('Error creating lesson:', error);
        }
      });
    }
  }

  openDeleteModal(lesson: Lesson): void {
    this.lessonToDelete = lesson;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.lessonToDelete = null;
  }

  confirmDelete(): void {
    if (!this.lessonToDelete) return;

    this.adminService.deleteLesson(this.lessonToDelete.id).subscribe({
      next: () => {
        this.toastService.success('Lesson deleted successfully');
        this.loadLessons(this.selectedCourse!.id);
        this.closeDeleteModal();
      },
      error: (error) => {
        this.toastService.error('Failed to delete lesson');
        console.error('Error deleting lesson:', error);
      }
    });
  }

  getCourseIcon(category: string): string {
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';
import { Course } from '../../../models/course.model';
import { IconsModule } from '../../../shared/icons.module';
import { ImageUrlPipe } from '../../../pipes/image-url.pipe';

@Component({
  selector: 'app-manage-courses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconsModule, ImageUrlPipe],
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
  showDeleteModal: boolean = false;
  courseToDelete: Course | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isUploading: boolean = false;

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
      duration: [0, [Validators.required, Validators.min(1)]],
      imageUrl: ['']
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
      duration: course.duration,
      imageUrl: course.imageUrl || ''
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.courseForm.reset();
    this.selectedCourse = null;
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        resolve('');
        return;
      }

      this.isUploading = true;
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.adminService.uploadCourseImage(formData).subscribe({
        next: (response: any) => {
          this.isUploading = false;
          resolve(response.imageUrl);
        },
        error: (error) => {
          this.isUploading = false;
          this.toastService.error('Failed to upload image');
          reject(error);
        }
      });
    });
  }

  async saveCourse(): Promise<void> {
    if (this.courseForm.invalid) {
      this.toastService.warning('Please fill in all required fields');
      return;
    }

    this.isSaving = true;
    
    let imageUrl = this.courseForm.get('imageUrl')?.value || '';
    console.log('Initial imageUrl from form:', imageUrl);
    console.log('Selected file:', this.selectedFile);
    
    if (this.selectedFile) {
      try {
        imageUrl = await this.uploadImage();
        console.log('Uploaded image URL:', imageUrl);
      } catch (error) {
        console.error('Upload error:', error);
        this.isSaving = false;
        return;
      }
    }

    const courseData = {
      ...this.courseForm.value,
      imageUrl: imageUrl
    };
    
    console.log('Course data being sent:', courseData);

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

 openDeleteModal(course: Course): void {
  this.courseToDelete = course;
  this.showDeleteModal = true;
}

closeDeleteModal(): void {
  this.showDeleteModal = false;
  this.courseToDelete = null;
}

confirmDelete(): void {
  if (!this.courseToDelete) return;

  this.adminService.deleteCourse(this.courseToDelete.id).subscribe({
    next: () => {
      this.toastService.success('Course deleted successfully');
      this.loadCourses();
      this.closeDeleteModal();
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

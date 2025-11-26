import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../models/user.model';
import { IconsModule } from '../../shared/icons.module';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileForm: FormGroup;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isSaving: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.profileForm.patchValue({
          name: user.name,
          email: user.email
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.toastService.error('Failed to load profile');
        this.isLoading = false;
        console.error('Error loading profile:', error);
      }
    });
  }

  toggleEditMode(): void {
    if (this.isEditMode) {
     
      this.profileForm.patchValue({
        name: this.currentUser?.name,
        email: this.currentUser?.email
      });
    }
    this.isEditMode = !this.isEditMode;
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.toastService.warning('Please fill in all required fields correctly');
      return;
    }

    this.isSaving = true;
    const profileData = this.profileForm.value;

    this.authService.updateProfile(profileData).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.isEditMode = false;
        this.isSaving = false;
        this.toastService.success('Profile updated successfully!');
      },
      error: (error) => {
        this.isSaving = false;
        if (error.error?.message) {
          this.toastService.error(error.error.message);
        } else {
          this.toastService.error('Failed to update profile');
        }
        console.error('Error updating profile:', error);
      }
    });
  }

  getInitials(): string {
    if (!this.currentUser?.name) return '?';
    const names = this.currentUser.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return this.currentUser.name.substring(0, 2).toUpperCase();
  }

  getRoleBadgeClass(): string {
    return this.currentUser?.role === 'ADMIN' ? 'role-admin' : 'role-student';
  }
}

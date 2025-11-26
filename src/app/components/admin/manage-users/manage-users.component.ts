import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';
import { User } from '../../../models/user.model';
import { IconsModule } from '../../../shared/icons.module';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, IconsModule, FormsModule],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  isLoading: boolean = true;
  showDeleteModal: boolean = false;
  userToDelete: User | null = null;
  searchTerm: string = '';
  filterRole: string = 'ALL';

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        this.toastService.error('Failed to load users');
        this.isLoading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  getFilteredUsers(): User[] {
    return this.users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = this.filterRole === 'ALL' || user.role === this.filterRole;
      return matchesSearch && matchesRole;
    });
  }

  openDeleteModal(user: User): void {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.userToDelete = null;
  }

  confirmDelete(): void {
    if (!this.userToDelete) return;

    this.adminService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.toastService.success('User deleted successfully');
        this.loadUsers();
        this.closeDeleteModal();
      },
      error: (error) => {
        this.toastService.error('Failed to delete user');
        console.error('Error deleting user:', error);
      }
    });
  }

  getInitials(name: string): string {
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getRoleBadgeClass(role: string): string {
    return role === 'ADMIN' ? 'role-admin' : 'role-student';
  }

  getUserCount(): number {
    return this.getFilteredUsers().length;
  }

  getAdminCount(): number {
    return this.users.filter(u => u.role === 'ADMIN').length;
  }

  getStudentCount(): number {
    return this.users.filter(u => u.role === 'STUDENT').length;
  }
}

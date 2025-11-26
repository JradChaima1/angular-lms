import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService, AdminStats } from '../../../services/admin.service';
import { IconsModule } from '../../../shared/icons.module';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, IconsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  stats: AdminStats = {
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalQuizzes: 0
  };
  isLoading: boolean = true;

  adminMenuItems = [
    { icon: 'users', label: 'Manage Users', route: '/admin/users', color: '#667eea' },
    { icon: 'book-open', label: 'Manage Courses', route: '/admin/courses', color: '#f093fb' },
    { icon: 'file-text', label: 'Manage Lessons', route: '/admin/lessons', color: '#4facfe' },
    { icon: 'help-circle', label: 'Manage Quizzes', route: '/admin/quizzes', color: '#43e97b' }
  ];

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
  this.adminService.getStats().subscribe({
    next: (stats) => {
      console.log('Stats received:', stats);  
      this.stats = stats;
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error loading stats:', error);
      this.isLoading = false;
    }
  });
}


  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}

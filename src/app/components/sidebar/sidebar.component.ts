import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconsModule } from '../../shared/icons.module';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  menuItems = [
    { icon: 'home', label: 'Dashboard', route: '/dashboard' },
    { icon: 'book-open', label: 'Courses', route: '/courses' },
    { icon: 'trophy', label: 'Achievements', route: '/achievements' },
 
    { icon: 'user', label: 'Profile', route: '/profile' },
   
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to user changes and update menu items
    this.authService.currentUser$.subscribe(user => {
      if (user?.role === 'ADMIN') {
        // Check if admin item already exists
        const hasAdminItem = this.menuItems.some(item => item.route === '/admin');
        if (!hasAdminItem) {
          // Add admin panel after dashboard
          this.menuItems.splice(1, 0, { 
            icon: 'shield', 
            label: 'Admin Panel', 
            route: '/admin' 
          });
        }
      } else {
        // Remove admin item if user is not admin
        this.menuItems = this.menuItems.filter(item => item.route !== '/admin');
      }
    });
  }
}

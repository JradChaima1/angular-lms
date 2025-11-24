import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  menuItems = [
    { icon: '🏠', label: 'Dashboard', route: '/dashboard' },
    { icon: '📚', label: 'My Courses', route: '/courses' },
    { icon: '🎮', label: 'Quizzes', route: '/quizzes' },
    { icon: '⭐', label: 'Progress', route: '/progress' },
    { icon: '🏆', label: 'Achievements', route: '/achievements' },
    { icon: '⚙️', label: 'Settings', route: '/settings' }
  ];
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconsModule } from '../../shared/icons.module';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  menuItems = [
    { icon: 'home', label: 'Dashboard', route: '/dashboard' },
    { icon: 'book-open', label: 'My Courses', route: '/courses' },
    { icon: 'trophy', label: 'Achievements', route: '/achievements' },
    { icon: 'bar-chart-3', label: 'Progress', route: '/progress' },
    { icon: 'settings', label: 'Settings', route: '/settings' }
  ];
}


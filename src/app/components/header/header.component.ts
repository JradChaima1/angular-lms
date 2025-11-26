import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { IconsModule } from '../../shared/icons.module';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IconsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
  this.router.navigate(['/profile']);
}
getInitials(): string {
  if (!this.currentUser?.name) return '?';
  const names = this.currentUser.name.split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  return this.currentUser.name.substring(0, 2).toUpperCase();
}


}

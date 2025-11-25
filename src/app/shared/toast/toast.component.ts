import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';
import { IconsModule } from '../icons.module';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, IconsModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnInit {
  toast: Toast | null = null;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toast$.subscribe(toast => {
      this.toast = toast;
    });
  }

  getIcon(): string {
    switch (this.toast?.type) {
      case 'success': return 'check-circle';
      case 'error': return 'x';
      case 'warning': return 'alert-triangle';
      case 'info': return 'info';
      default: return 'info';
    }
  }
}

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    
    map(user => {
      if (user && user.role === 'ADMIN') {
        return true;
      }
      router.navigate(['/dashboard']);
      return false;
    })
  );
};

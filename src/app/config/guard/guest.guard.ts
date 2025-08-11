// src/app/config/guard/guest.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/authService/auth-service.service';

export const guestGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        router.navigate(['/dashboard']); // Redirect authenticated users to dashboard
        return false;
      }
      return true; // Allow access for non-authenticated users
    })
  );
};

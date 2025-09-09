// src/app/config/guard/guest.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, filter, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { AuthService } from '../services/authService/auth-service.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // First ensure auth service is initialized
  return from(authService.init()).pipe(
    switchMap(() => authService.isAuthenticated$),
    filter(isAuthenticated => isAuthenticated !== null), // Wait until auth state is determined
    map(isAuthenticated => {
      if (isAuthenticated) {
        router.navigate(['/dashboard']); // Redirect authenticated users to dashboard
        return false;
      }
      return true; // Allow access for non-authenticated users
    })
  );
};

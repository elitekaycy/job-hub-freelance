// src/app/auth/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/authService/auth-service.service';
import { map, filter, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // First ensure auth service is initialized
  return from(authService.init()).pipe(
    switchMap(() => authService.isAuthenticated$),
    filter(isAuthenticated => isAuthenticated !== null), // Wait until auth state is determined
    map(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/auth/signin']);
        return false;
      }
      return true;
    })
  );
};

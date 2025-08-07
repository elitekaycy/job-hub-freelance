// src/app/auth/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/authService/auth-service.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // ✅ allow route
  } else {
    router.navigate(['/signin'], { queryParams: { returnUrl: state.url } });
    return false; // ❌ block route
  }
};

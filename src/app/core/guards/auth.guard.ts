import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Check if user has a token
  if (authService.getToken()) {
    
    // Optional: Check if token is expired (requires jwt-decode library)
    // For now, existence is enough.
    return true;
  }

  // 2. If not logged in, redirect to login page
  router.navigate(['/login']);
  return false;
};
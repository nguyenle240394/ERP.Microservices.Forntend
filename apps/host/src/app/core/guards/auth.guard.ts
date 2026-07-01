import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  
  // TODO: Replace with actual authentication check from your AuthService/Store
  // For demonstration, we check a flag in localStorage
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    // Redirect to the login page
    return router.parseUrl('/login');
  }

  return true;
};

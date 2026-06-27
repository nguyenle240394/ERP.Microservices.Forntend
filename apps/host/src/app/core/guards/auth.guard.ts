import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  
  // TODO: Replace with actual authentication check from your AuthService/Store
  // For demonstration, we assume the user is not authenticated
  const isAuthenticated = false;

  if (!isAuthenticated) {
    // Redirect to the login page
    return router.parseUrl('/login');
  }

  return true;
};

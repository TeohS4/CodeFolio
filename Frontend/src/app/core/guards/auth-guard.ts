import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AlertService } from '../services/alert-service/alert';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const alert = inject(AlertService);
  const token = localStorage.getItem('token');

  if (token) {
    return true; // allow access
  }
  alert.error('Access Denied', 'Please login first');
  
  router.navigate(['/login'], { replaceUrl: true });
  return false;
};
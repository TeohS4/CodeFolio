import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service/auth-service';
import { AlertService } from '../services/alert-service/alert';

export const authInterceptor = (req: any, next: any) => {
  const authService = inject(AuthService);
  const alertService = inject(AlertService);
  const router = inject(Router);
  const token = authService.getToken();

  // bypass public api
  const isExternal = req.url.includes('open-meteo.com') ||
    req.url.includes('openstreetmap.org');

  if (token && !isExternal) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {
      // After token has expired in JwtHelper.cs
      if (error.status === 401) {
        alertService.error('Session Expired', 'Please login again to continue');

        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};

import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service/auth-service';


export const authInterceptor = (req: any, next: any) => {
  const authService = inject(AuthService);

  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
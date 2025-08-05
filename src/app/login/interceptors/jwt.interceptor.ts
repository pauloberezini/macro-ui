import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  let authReq = req;
  
  if (token && isTokenValid(token)) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      }
    });
  } else if (token) {
    // Token is invalid, clear it
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('lastEmail');
    // SECURITY: Removed password storage reference
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Clear all authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('lastEmail');
        // SECURITY: Removed password storage reference
        
        // Redirect to main page (home)
        router.navigate(['/']);
        
        return throwError(() => error);
      }
      return throwError(() => error);
    })
  );
};

// Helper function to validate JWT token
function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

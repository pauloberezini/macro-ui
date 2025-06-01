import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const http = inject(HttpClient);

  const token = localStorage.getItem('token');
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token, redirect to login or show error
          localStorage.removeItem('token');
          return throwError(() => error);
        }

        // Call /auth/refresh with the refresh token
        return http.post<{ accessToken: string }>('/auth/refresh', { refreshToken }).pipe(
          switchMap(response => {
            // Save new token
            localStorage.setItem('token', response.accessToken);
            // Retry original request with new token
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`,
              }
            });
            return next(retryReq);
          }),
          catchError(err => {
            // Refresh failed, log out user
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            // Optionally redirect to login page here
            return throwError(() => err);
          })
        );
      }
      return throwError(() => error);
    })
  );
};

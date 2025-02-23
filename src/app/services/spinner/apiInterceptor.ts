import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { inject } from '@angular/core';
import {SpinnerService} from "./spinner.component";

export const apiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  console.log('[ApiInterceptor] Request intercepted:', req.url);

  // Use Angular's inject() to obtain the SpinnerService instance
  const spinnerService = inject(SpinnerService);
  spinnerService.set(true);

  return next(req).pipe(
    finalize(() => {
      console.log('[ApiInterceptor] Request completed, turning spinner OFF');
      spinnerService.set(false);
    })
  );
};

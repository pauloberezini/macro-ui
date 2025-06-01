import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { inject } from '@angular/core';
import {SpinnerService} from "./spinner.component";

export const apiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {

  const spinnerService = inject(SpinnerService);
  spinnerService.set(true);

  return next(req).pipe(
    finalize(() => {
      spinnerService.set(false);
    })
  );
};

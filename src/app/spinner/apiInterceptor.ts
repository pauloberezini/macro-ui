import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, finalize } from "rxjs";
import { SpinnerService } from "./spinner.component";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private spinnerService: SpinnerService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.spinnerService.set(true);
    return next.handle(request).pipe(
      finalize(() => {
        this.spinnerService.set(false);
      })
    );
  }
}
import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { AuthService } from "../auth/auth.service";
import { catchError, switchMap, throwError } from "rxjs";
import { inject } from "@angular/core";

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);

  const authReq = req.clone({
    withCredentials: true
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status !== 401 || req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
        return throwError(() => error);
      }

      return authService.refresh().pipe(
        switchMap(() => {
          
          const retryReq = req.clone({ withCredentials: true });
          return next(retryReq);
        }),
        catchError(refreshError => {
          authService.clearSession();
          return throwError(() => refreshError);
        })
      );
    })
  );
};
import {HttpErrorResponse, HttpInterceptorFn} from "@angular/common/http";
import { AuthService } from "../services/auth-service";
import { catchError, switchMap, throwError } from "rxjs";
import { inject } from "@angular/core";


/**
 * HTTP Interceptor that adds JWT token to requests and handles token expiration.
 * 
 * Flow:
 * 1. Adds access token to all requests (except auth endpoints)
 * 2. If request fails with 401 error, attempts to refresh token
 * 3. If refresh succeeds, retries original request with new token
 * 4. If refresh fails, logs user out and redirects to login
 * 
 * This interceptor implements automatic token refresh on expiration,
 * providing a seamless experience for users.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  const isAuthEndpoint = req.url.includes('/auth/');

  const authReq = (token && !isAuthEndpoint)
    ? req.clone({
      setHeaders: { Authorization: `Bearer ${token}`}
    })
    : req;

   return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      // Only handle 401 Unauthorized errors
      if (error.status !== 401) {
        return throwError(() => error);
      }

      // Check if this is a token expiration error vs other 401 errors
      const errorBody = error.error;
      const isTokenExpired = errorBody?.error === 'token_expired';
      const isRefreshTokenExpired = errorBody?.error === 'refresh_token_expired';

      // If refresh token itself expired, logout immediately
      if (isRefreshTokenExpired) {
        authService.clearSession();
        return throwError(() => error);
      }

      // If this is the refresh endpoint failing, logout
      if (req.url.includes('/auth/refresh')) {
        authService.clearSession();
        return throwError(() => error);
      }

      return authService.refresh().pipe(
        switchMap(newToken => {

          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` }
          });

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
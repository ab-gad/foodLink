import { HttpInterceptorFn, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // Handle critical HTTP status codes globally
            switch (error.status) {
                case HttpStatusCode.Unauthorized:
                    // Unauthorized: Clear tokens and boot to login
                    localStorage.removeItem('fl_token');
                    router.navigate(['/login']);
                    break;
                case HttpStatusCode.Forbidden:
                    // Forbidden: User doesn't have administrative or correct portal rights
                    router.navigate(['/dashboard']);
                    break;
                case HttpStatusCode.InternalServerError:
                    // Internal Server Error: Log to monitoring systems (e.g., Sentry)
                    console.error('Critical Server Error (500):', error.message);
                    break;
                default:
                    // Network errors or unknown client/server exceptions
                    console.error(`API Error [Status ${error.status}]:`, error.error);
                    break;
            }

            // Forward the error down the stream so local components/mutations can still respond if needed
            return throwError(() => error);
        })
    );
};
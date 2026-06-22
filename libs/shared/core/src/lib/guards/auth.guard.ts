import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@foodlink/shared-auth-data-access';

export const adminGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated() && authService.userRole() === 'Admin') {
        return true;
    }

    // Redirect malicious or unauthenticated attempts back to admin login
    return router.createUrlTree(['/login']);
};
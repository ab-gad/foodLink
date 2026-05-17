import { Routes } from '@angular/router';
export const appRoutes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('@foodlink/shared-auth-feature-login').then(m => m.LoginPage)
    },
    // {
    //     path: 'dashboard',
    //     canActivate: [adminGuard],
    //     loadChildren: () => import('./features/dashboard.routes').then(m => m.dashboardRoutes) // Placeholder path for next step
    // },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
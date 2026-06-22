import { Routes } from '@angular/router';
import { AdminShellComponent } from './components/admin-layout';
import { adminGuard, guestGuard } from '@foodlink/shared-core';
export const appRoutes: Routes = [
    {
        path: 'login',
        title: 'Login',
        canActivate: [guestGuard],
        loadComponent: () => import('@foodlink/shared-auth-feature-login').then(m => m.LoginPage)
    },
    {
        path: '',
        component: AdminShellComponent,
        canActivate: [adminGuard],       // Secure all child routes globally right here
        children: [
            {
                path: 'dashboard',
                title: 'Dashboard',
                loadComponent: () => import('@foodlink/admin-dashboard-feature').then(m => m.AdminDashboardPage)
            },
            {
                path: 'users',
                loadComponent: () => import('@foodlink/admin-dashboard-feature').then(m => m.AdminUsersPage)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'login'
    },
];
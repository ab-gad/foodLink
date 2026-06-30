import { Routes } from '@angular/router';
import { AdminShellComponent } from './components/admin-layout';
import { adminGuard, guestGuard, stateRequiredGuard, StateRequiredRouteData } from '@foodlink/shared-core';
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
        canActivate: [adminGuard],
        children: [
            {
                path: 'dashboard',
                title: 'Dashboard',
                loadComponent: () => import('@foodlink/admin-dashboard-feature').then(m => m.AdminDashboardPage)
            },
            {
                path: 'users',
                title: 'Users',
                loadComponent: () => import('@foodlink/admin-dashboard-feature').then(m => m.AdminUsersPage)
            },
            {
                path: 'charities',
                title: 'Charities',
                loadComponent: () => import('@foodlink/admin-dashboard-feature').then(m => m.AdminCharitiesPage),
            },
            {
                path: 'charities/:id',
                canActivate: [stateRequiredGuard],
                loadComponent: () => import('@foodlink/admin-dashboard-feature').then(m => m.AdminCharityProfile),
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'info'
                    },
                    {
                        canActivate: [stateRequiredGuard],
                        data: {
                            requiredStateKey: 'charity',
                        } as StateRequiredRouteData,
                        title: 'Charity Profile',
                        path: 'info',
                        loadComponent: () => import('@foodlink/admin-dashboard-feature').then(m => m.AdminCharityProfileInfo),
                    },
                    {
                        canActivate: [stateRequiredGuard],
                        data: {
                            requiredStateKey: 'charity',
                        } as StateRequiredRouteData,
                        title: 'Charity Reservation',
                        path: 'reservations',
                        loadComponent: () => import('@foodlink/admin-dashboard-feature').then(m => m.ReservationsTableComponent),
                    }
                ]
            },
            {
                path: 'businesses',
                title: 'Businesses',
                loadComponent: () => import('@foodlink/admin-dashboard-feature').then(m => m.AdminBusinessesPage),
            },
            {
                path: 'businesses/:id',
                canActivate: [stateRequiredGuard],
                loadComponent: () => import('@foodlink/admin-dashboard-feature').then(m => m.AdminBusinessProfile),
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'info'
                    },
                    {
                        canActivate: [stateRequiredGuard],
                        data: {
                            requiredStateKey: 'business',
                        } as StateRequiredRouteData,
                        title: 'Business Profile',
                        path: 'info',
                        loadComponent: () => import('@foodlink/admin-dashboard-feature').then(m => m.AdminBusinessProfileInfo),
                    },
                    {
                        canActivate: [stateRequiredGuard],
                        data: {
                            requiredStateKey: 'business',
                        } as StateRequiredRouteData,
                        title: 'Business Donations',
                        path: 'donations',
                        loadComponent: () => import('@foodlink/admin-dashboard-feature').then(m => m.DonationsTableComponent),
                    }
                ]
            },
            {
                path: 'donations',
                title: 'Donations',
                loadComponent: () => import('@foodlink/admin-dashboard-feature').then(m => m.DonationsTableComponent),
            },
            {
                path: 'reservations',
                title: 'Reservations',
                loadComponent: () => import('@foodlink/admin-dashboard-feature').then(m => m.ReservationsTableComponent),
            },
            {
                path: 'reservations/:id',
                title: 'Reservation Details',
                canActivate: [stateRequiredGuard],
                data: {
                    requiredStateKey: 'reservation',
                } as StateRequiredRouteData,
                loadComponent: () => import('@foodlink/admin-dashboard-feature').then(m => m.ReservationDetailsComponent),
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
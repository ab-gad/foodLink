/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { ENV_CONFIG, PagedResponse, TOAST_PROMISE_CONFIG } from '@foodlink/shared-util';
import { AdminBusinessResponse, AdminCharityResponse, AdminDonationResponse, AdminUserResponse, DashboardStats, Reservation } from '@foodlink/admin-dashboard-utils';
import { lastValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminDashboardService {
    private http = inject(HttpClient);
    private config = inject(ENV_CONFIG);
    private queryClient = inject(QueryClient);

    // --- Query Options ---
    getStatsOptions() {
        return {
            queryKey: ['admin', 'dashboard-stats'] as const,
            queryFn: () => lastValueFrom(this.http.get<DashboardStats>(`${this.config.apiUrl}/admin/dashboard/stats`)),
        };
    }

    getRecentUsersOptions(page = 1, pageSize = 10) {
        return {
            queryKey: ['admin', 'dashboard-recent-users', page, pageSize] as const,
            queryFn: () =>
                lastValueFrom(this.http.get<PagedResponse<AdminUserResponse>>(`${this.config.apiUrl}/admin/users`, {
                    params: {
                        page: String(page),
                        pageSize: String(pageSize),
                        maxPageSize: String(pageSize)
                    }
                }))
        };
    }

    getAllUsersOptions(page = 1, pageSize = 100) {
        return {
            queryKey: ['admin', 'users-management-list', page, pageSize] as const,
            queryFn: () => lastValueFrom(this.http.get<PagedResponse<AdminUserResponse>>(`${this.config.apiUrl}/admin/users`, {
                params: {
                    page: String(page),
                    pageSize: String(pageSize),
                    maxPageSize: String(pageSize)
                }
            }))
        };
    }

    getAllCharitiesOptions(page = 1, pageSize = 100) {
        return {
            queryKey: ['admin', 'charities-management-list', page, pageSize] as const,
            queryFn: () => lastValueFrom(this.http.get<PagedResponse<AdminCharityResponse>>(`${this.config.apiUrl}/admin/charities`, {
                params: {
                    page: String(page),
                    pageSize: String(pageSize),
                    maxPageSize: String(pageSize)
                }
            }))
        };
    }
    getAllBusinessesOptions(page = 1, pageSize = 100) {
        return {
            queryKey: ['admin', 'businesses-management-list', page, pageSize] as const,
            queryFn: () => lastValueFrom(this.http.get<PagedResponse<AdminBusinessResponse>>(`${this.config.apiUrl}/admin/businesses`, {
                params: {
                    page: String(page),
                    pageSize: String(pageSize),
                    maxPageSize: String(pageSize)
                }
            }))
        };
    }
    getAllReservationsOptions(page = 1, pageSize = 100) {
        return {
            queryKey: ['admin', 'reservations-management-list', page, pageSize] as const,
            queryFn: () => lastValueFrom(this.http.get<PagedResponse<Reservation>>(`${this.config.apiUrl}/admin/reservations`, {
                params: {
                    page: String(page),
                    pageSize: String(pageSize),
                    maxPageSize: String(pageSize)
                }
            }))
        };
    }
    getCharityReservationsOptions(charityId: string, page = 1, pageSize = 100) {
        return {
            queryKey: ['admin', 'charity-reservation-list', charityId, page, pageSize] as const,
            queryFn: () => lastValueFrom(this.http.get<PagedResponse<Reservation>>(`${this.config.apiUrl}/admin/charities/${charityId}/reservations`, {
                params: {
                    page: String(page),
                    pageSize: String(pageSize),
                    maxPageSize: String(pageSize)
                }
            }))
        };
    }
    getBusinessDonationsOptions(businessId: string, page = 1, pageSize = 100) {
        return {
            queryKey: ['admin', 'business-donations-list', businessId, page, pageSize] as const,
            queryFn: () => lastValueFrom(this.http.get<PagedResponse<AdminDonationResponse>>(`${this.config.apiUrl}/admin/businesses/${businessId}/donations`, {
                params: {
                    page: String(page),
                    pageSize: String(pageSize),
                    maxPageSize: String(pageSize)
                }
            }))
        };
    }
    getAllDonationsOptions(page = 1, pageSize = 100) {
        return {
            queryKey: ['admin', 'donations-management-list', page, pageSize] as const,
            queryFn: () => lastValueFrom(this.http.get<PagedResponse<AdminDonationResponse>>(`${this.config.apiUrl}/admin/donations`, {
                params: {
                    page: String(page),
                    pageSize: String(pageSize),
                    maxPageSize: String(pageSize)
                }
            }))
        };
    }

    // --- Mutation Options ---

    suspendUserOptions() {
        return {
            mutationFn: (userId: string) =>
                lastValueFrom(this.http.post(`${this.config.apiUrl}/admin/users/${userId}/suspend`, {}, {
                    context: new HttpContext().set(TOAST_PROMISE_CONFIG, {
                        loading: 'Suspending user...',
                        success: 'User suspended successfully',
                        error: (err: HttpErrorResponse) => `User suspension failed: ${err.error?.message || err.message || ''}`
                    })
                })),
            onSuccess: () => {
                this.queryClient.invalidateQueries({ queryKey: ['admin', 'users-management-list'] });
                this.queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard-recent-users'] });
            }
        };
    }

    reactivateUserOptions() {
        return {
            mutationFn: (userId: string) =>
                lastValueFrom(this.http.post(`${this.config.apiUrl}/admin/users/${userId}/reactivate`, {}, {
                    context: new HttpContext().set(TOAST_PROMISE_CONFIG, {
                        loading: 'Reactivating user...',
                        success: 'User reactivated successfully',
                        error: (err: HttpErrorResponse) => `User reactivation failed: ${err.error?.message || err.message || ''}`
                    })
                })),
            onSuccess: () => {
                this.queryClient.invalidateQueries({ queryKey: ['admin', 'users-management-list'] });
                this.queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard-recent-users'] });
            }
        };
    }
}
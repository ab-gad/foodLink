import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { ENV_CONFIG, PagedResponse, TOAST_PROMISE_CONFIG } from '@foodlink/shared-util';
import { AdminUserResponse, DashboardStats } from '@foodlink/admin-dashboard-utils';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AdminDashboardService {
    private http = inject(HttpClient);
    private config = inject(ENV_CONFIG);
    private queryClient = inject(QueryClient);

    getStats = injectQuery(() => ({
        queryKey: ['admin', 'dashboard-stats'],
        queryFn: () => lastValueFrom(this.http.get<DashboardStats>(`${this.config.apiUrl}/admin/dashboard/stats`)),
    }));

    getRecentUsers = injectQuery(() => ({
        queryKey: ['admin', 'dashboard-recent-users'],
        queryFn: () =>
            lastValueFrom(this.http.get<PagedResponse<AdminUserResponse>>(`${this.config.apiUrl}/admin/users`, {
                params: {
                    page: 1,
                    pageSize: 10,
                    maxPageSize: 10
                }
            }))
    }));

    getAllUsers = injectQuery(() => ({
        queryKey: ['admin', 'users-management-list'],
        queryFn: () => lastValueFrom(this.http.get<PagedResponse<AdminUserResponse>>(`${this.config.apiUrl}/admin/users`, {
            params: { page: 1, pageSize: 100, maxPageSize: 100 }
        }))
    }));

    suspendUser = injectMutation(() => ({
        mutationFn: (userId: string) =>
            lastValueFrom(this.http.put(`${this.config.apiUrl}/admin/users/${userId}/suspend`, {}, {
                context: new HttpContext().set(TOAST_PROMISE_CONFIG, {
                    loading: 'Suspending user...',
                    success: 'User suspended successfully',
                    error: (err) => `User suspension failed: ${err.error?.message || err.message || ''}`
                })
            })),
        onSuccess: () => {
            // Invalidate both lists to maintain sync consistency across dashboard components
            this.queryClient.invalidateQueries({ queryKey: ['admin', 'users-management-list'] });
            this.queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard-recent-users'] });
        }
    }));

    reactivateUser = injectMutation(() => ({
        mutationFn: (userId: string) =>
            lastValueFrom(this.http.put(`${this.config.apiUrl}/admin/users/${userId}/reactivate`, {}, {
                context: new HttpContext().set(TOAST_PROMISE_CONFIG, {
                    loading: 'Reactivating user...',
                    success: 'User reactivated successfully',
                    error: (err) => `User reactivation failed: ${err.error?.message || err.message || ''}`
                })
            })),
        onSuccess: () => {
            this.queryClient.invalidateQueries({ queryKey: ['admin', 'users-management-list'] });
            this.queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard-recent-users'] });
        }
    }));
}
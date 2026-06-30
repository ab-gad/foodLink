import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminUserResponse } from '@foodlink/admin-dashboard-utils';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-admin-dashboard-recent-users-table',
  standalone: true,
  imports: [DatePipe, RouterLink],
  template: `
    <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-50">Recent Registered Users</h3>
          <p class="text-xs text-slate-400 mt-0.5">Quick overview of the latest onboarding profiles across the network.</p>
        </div>
        <a routerLink="/users" class="text-xs font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 border border-green-200 dark:border-green-800/60 rounded-lg px-3 py-1.5 transition-colors">
          View All
        </a>
      </div>

      @if (isLoading()) {
        <div class="w-full space-y-4 animate-pulse">
          <div class="h-10 bg-slate-50 dark:bg-slate-800/60 rounded-lg flex items-center px-4"><div class="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded"></div></div>
          @for (i of [1,2,3,4,5]; track i) {
            <div class="h-14 border-b border-slate-100 dark:border-slate-800/60 flex items-center px-4 gap-4">
              <div class="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
              <div class="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div class="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded"></div>
              <div class="h-4 flex-1 bg-slate-100 dark:bg-slate-800 rounded"></div>
            </div>
          }
        </div>
      } @else if (!users() || users()?.length === 0) {
        <div class="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
          <span class="text-3xl mb-2">👥</span>
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400">No recent users found</p>
          <p class="text-xs text-slate-400 mt-0.5">New registration entries will populate here automatically.</p>
        </div>
      } @else {
        <div class="overflow-x-auto">
          <table class="w-full min-w-150 text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/20">
                <th class="py-3 px-4 font-medium">Name</th>
                <th class="py-3 px-4 font-medium">Type</th>
                <th class="py-3 px-4 font-medium">Email</th>
                <th class="py-3 px-4 font-medium">Registered At</th>
                <th class="py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              @for (user of users(); track user.id) {
                <tr class="hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors group">
                  <td class="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                    <div class="flex items-center gap-3">
                      <div class="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shrink-0 overflow-hidden flex items-center justify-center">
                        @if (user.profileImage) {
                          <img [src]="user.profileImage" [alt]="user.name" class="w-full h-full object-cover" />
                        } @else {
                          <span class="text-xs font-bold text-slate-400 uppercase">{{ user.name.slice(0, 2) }}</span>
                        }
                      </div>
                      <span class="truncate max-w-45">{{ user.name }}</span>
                    </div>
                  </td>

                  <td class="py-3.5 px-4">
                    @let role = getNormalizedRole(user.role);
                    <span [class]="getRoleColor(role)" class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium">
                      {{role}}
                    </span>
                  </td>

                  <td class="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-xs">
                    {{ user.email }}
                  </td>

                  <td class="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                    {{ user.createdAt | date: 'MMM d, yyyy' }}
                  </td>

                  <td class="py-3.5 px-4">
                    @if (user.isSuspended) {
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400">
                        Suspended
                      </span>
                    } @else {
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                        Active
                      </span>
                    }
                  </td>

                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentUsersTableComponent {
  users = input<AdminUserResponse[] | undefined>(undefined);
  isLoading = input<boolean>(false);

  /** Helper to safely resolve enums or incoming string representations from backend payload mapping context */
  protected getNormalizedRole(role: string | number): 'Charity' | 'Business' | 'Admin' {
    const roleStr = String(role).toUpperCase();
    if (roleStr.includes('0')) return 'Admin';
    if (roleStr.includes('CHARITY')) return 'Charity';
    return 'Business'; // Maps back seamlessly to Business/Restaurant logic
  }

  protected getRoleColor(role: 'Charity' | 'Business' | 'Admin'): string {
    switch (role) {
      case 'Charity':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30';
      case 'Business':
        return 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30';
      case 'Admin':
        return 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400';
    }
  }
}
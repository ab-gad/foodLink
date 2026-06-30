import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AdminDashboardService } from '@foodlink/admin-dashboard-data-access';
import { DashboardChartsComponent, RecentUsersTableComponent } from '@foodlink/admin-dashboard-ui';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { injectQuery } from '@tanstack/angular-query-experimental';
@Component({
  selector: 'lib-admin-dashboard-page',
  imports: [DashboardChartsComponent, RecentUsersTableComponent, HlmSeparatorImports],
  templateUrl: './admin-dashboard-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AdminDashboardService],
})
export class AdminDashboardPage {
  private readonly dashboardService = inject(AdminDashboardService);

  statsQuery = injectQuery(() => this.dashboardService.getStatsOptions());;
  usersQuery = injectQuery(() => this.dashboardService.getRecentUsersOptions());;
}

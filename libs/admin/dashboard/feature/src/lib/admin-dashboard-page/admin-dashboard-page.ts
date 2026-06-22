import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AdminDashboardService } from '@foodlink/admin-dashboard-data-access';
import { DashboardChartsComponent, RecentUsersTableComponent } from '@foodlink/admin-dashboard-ui';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
@Component({
  selector: 'lib-admin-dashboard-page',
  imports: [DashboardChartsComponent, RecentUsersTableComponent, HlmSeparatorImports],
  templateUrl: './admin-dashboard-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AdminDashboardService],
})
export class AdminDashboardPage implements OnInit {
  private readonly dashboardService = inject(AdminDashboardService);

  statsQuery = this.dashboardService.getStats;
  usersQuery = this.dashboardService.getRecentUsers;

  constructor() {
    console.log('CONSTRUCTOR admin dashboard page');

  }

  ngOnInit(): void {
    console.log(this.statsQuery.data());
  }
}

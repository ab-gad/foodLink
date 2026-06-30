import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import { DashboardStats } from '@foodlink/admin-dashboard-utils';
import { ChartItem } from '@foodlink/shared-util';
import { CustomPieChartsComponent } from '@foodlink/shared-ui-components';

@Component({
  selector: 'lib-admin-dashboard-charts',
  standalone: true,
  imports: [CustomPieChartsComponent],
  host: { class: 'block' },
  template: `
    <div class="grid gap-6 md:grid-cols-2">
      <lib-shared-custom-pie-chart [isLoading]="isLoading()" [chartItems]="reservationLegends()"></lib-shared-custom-pie-chart>
      <lib-shared-custom-pie-chart [isLoading]="isLoading()" [chartItems]="userLegends()"></lib-shared-custom-pie-chart>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardChartsComponent {
  stats = input<DashboardStats | undefined>(undefined);
  isLoading = input<boolean>(false);

  protected reservationLegends: Signal<ChartItem[]> = computed(() => {
    const s = this.stats();
    if (!s) return [];
    return [
      { label: 'Pending', value: s.pendingReservations, color: '#3b82f6' },
      { label: 'Picked Up', value: s.pickedUpReservations, color: '#10b981' },
      { label: 'Cancelled', value: s.noShowReservations, color: '#f59e0b' },
      { label: 'No Show', value: 0, color: '#ef4444' }
    ];
  });

  protected userLegends: Signal<ChartItem[]> = computed(() => {
    const s = this.stats();
    if (!s) return [];
    return [
      { label: 'Charities', value: s.totalCharities, color: '#3b82f6' },
      { label: 'Restaurants', value: s.totalBusinesses, color: '#10b981' }
    ];
  });
}
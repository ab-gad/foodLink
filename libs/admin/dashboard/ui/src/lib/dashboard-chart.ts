import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ChartItem, DashboardStats } from '@foodlink/admin-dashboard-utils';

@Component({
  selector: 'lib-admin-dashboard-charts',
  standalone: true,
  imports: [BaseChartDirective],
  host: { class: 'block' },
  template: `
    <div class="grid gap-6 md:grid-cols-2">
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-base font-semibold text-slate-900 dark:text-slate-50">Reservations Status</h3>
          <select class="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2.5 py-1.5 font-medium text-slate-600 dark:text-slate-300">
            <option>This Week</option>
          </select>
        </div>

        @if (isLoading()) {
          <div class="flex flex-col sm:flex-row items-center justify-center gap-8 min-h-40 animate-pulse">
            <div class="h-40 w-40 rounded-full border-18 border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0">
              <div class="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
            <div class="flex-1 w-full space-y-4">
              @for (i of [1,2,3,4]; track i) {
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2"><div class="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-800"></div><div class="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div></div>
                  <div class="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
              }
            </div>
          </div>
        } @else {
          <div class="flex flex-col sm:flex-row items-center justify-center gap-8 min-h-40">
            <div class="relative h-40 w-40 shrink-0">
              <canvas baseChart 
                [data]="resChartData()" 
                [options]="chartOptions" 
                [type]="'doughnut'">
              </canvas>
              <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{{ totalReservations() }}</span>
                <span class="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total</span>
              </div>
            </div>

            <div class="flex-1 w-full space-y-3.5">
              @for (item of reservationLegends(); track item.label) {
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center gap-3">
                    <span class="w-3 h-3 rounded-full shrink-0" [style.background-color]="item.color"></span>
                    <span class="text-slate-600 dark:text-slate-300 font-medium">{{ item.label }}</span>
                  </div>
                  <div class="text-right font-semibold text-slate-800 dark:text-slate-200">
                    {{ item.value }} <span class="text-xs font-normal text-slate-400 ml-1">({{ item.percentage }}%)</span>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>

      <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-base font-semibold text-slate-900 dark:text-slate-50">Users Distribution</h3>
          <select class="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2.5 py-1.5 font-medium text-slate-600 dark:text-slate-300">
            <option>This Week</option>
          </select>
        </div>

        @if (isLoading()) {
          <div class="flex flex-col sm:flex-row items-center justify-center gap-8 min-h-40 animate-pulse">
            <div class="h-40 w-40 rounded-full border-18 border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0">
              <div class="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
            <div class="flex-1 w-full space-y-4">
              @for (i of [1,2]; track i) {
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2"><div class="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-800"></div><div class="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div></div>
                  <div class="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
              }
            </div>
          </div>
        } @else {
          <div class="flex flex-col sm:flex-row items-center justify-center gap-8 min-h-40">
            <div class="relative h-40 w-40 shrink-0">
              <canvas baseChart 
                [data]="userChartData()" 
                [options]="chartOptions" 
                [type]="'doughnut'">
              </canvas>
              <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{{ totalUsers() }}</span>
                <span class="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total</span>
              </div>
            </div>

            <div class="flex-1 w-full space-y-3.5">
              @for (item of userLegends(); track item.label) {
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center gap-3">
                    <span class="w-3 h-3 rounded-full shrink-0" [style.background-color]="item.color"></span>
                    <span class="text-slate-600 dark:text-slate-300 font-medium">{{ item.label }}</span>
                  </div>
                  <div class="text-right font-semibold text-slate-800 dark:text-slate-200">
                    {{ item.value }} <span class="text-xs font-normal text-slate-400 ml-1">({{ item.percentage }}%)</span>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardChartsComponent {
  stats = input<DashboardStats | undefined>(undefined);
  isLoading = input<boolean>(false);

  protected totalReservations = computed(() => this.stats()?.totalReservations || 0);
  protected totalUsers = computed(() => ((this.stats()?.totalCharities || 0) + (this.stats()?.totalBusinesses || 0)));

  protected reservationLegends: Signal<ChartItem[]> = computed(() => {
    const s = this.stats();
    if (!s) return [];
    const total = s.totalReservations || 1;
    return [
      { label: 'Pending', value: s.pendingReservations, color: '#3b82f6', percentage: Math.round((s.pendingReservations / total) * 100) },
      { label: 'Picked Up', value: s.pickedUpReservations, color: '#10b981', percentage: Math.round((s.pickedUpReservations / total) * 100) },
      { label: 'Cancelled', value: s.noShowReservations, color: '#f59e0b', percentage: Math.round((s.noShowReservations / total) * 100) },
      { label: 'No Show', value: 0, color: '#ef4444', percentage: 0 } // Fallback to handle missing mock api properties safely
    ];
  });

  protected userLegends: Signal<ChartItem[]> = computed(() => {
    const s = this.stats();
    if (!s) return [];
    const total = this.totalUsers() || 1;
    return [
      { label: 'Charities', value: s.totalCharities, color: '#3b82f6', percentage: Math.round((s.totalCharities / total) * 100) },
      { label: 'Restaurants', value: s.totalBusinesses, color: '#10b981', percentage: Math.round((s.totalBusinesses / total) * 100) }
    ];
  });

  protected resChartData = computed<ChartConfiguration<'doughnut'>['data']>(() => ({
    labels: this.reservationLegends().map(i => i.label),
    datasets: [{
      data: this.reservationLegends().map(i => i.value),
      backgroundColor: this.reservationLegends().map(i => i.color),
      borderWidth: 0,
      borderRadius: 4
    }]
  }));

  protected userChartData = computed<ChartConfiguration<'doughnut'>['data']>(() => ({
    labels: this.userLegends().map(i => i.label),
    datasets: [{
      data: this.userLegends().map(i => i.value),
      backgroundColor: this.userLegends().map(i => i.color),
      borderWidth: 0,
      borderRadius: 4
    }]
  }));

  protected chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    }
  };
}
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ChartItem } from '@foodlink/shared-util';

@Component({
    selector: 'lib-shared-custom-pie-chart',
    standalone: true,
    imports: [BaseChartDirective],
    host: { class: 'block' },
    template: `
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
                <span class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{{ total() }}</span>
                <span class="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total</span>
              </div>
            </div>

            <div class="flex-1 w-full space-y-3.5">
              @for (item of chartItems(); track item.label) {
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center gap-3">
                    <span class="w-3 h-3 rounded-full shrink-0" [style.background-color]="item.color"></span>
                    <span class="text-slate-600 dark:text-slate-300 font-medium">{{ item.label }}</span>
                  </div>
                  <div class="text-right font-semibold text-slate-800 dark:text-slate-200">
                    {{ item.value }} <span class="text-xs font-normal text-slate-400 ml-1">({{ getPercentage(item.value) }}%)</span>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomPieChartsComponent {
    chartItems = input<ChartItem[]>([]);
    isLoading = input<boolean>(false);

    protected total = computed(() => this.chartItems().reduce((acc, item) => acc + item.value, 0));


    protected resChartData = computed<ChartConfiguration<'doughnut'>['data']>(() => ({
        labels: this.chartItems().map(i => i.label),
        datasets: [{
            data: this.chartItems().map(i => i.value),
            backgroundColor: this.chartItems().map(i => i.color),
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

    protected getPercentage(value: number): number {
        return Math.round(((value || 0) / (this.total() || 1)) * 100)
    }
}
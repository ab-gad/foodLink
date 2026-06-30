import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideClock, lucideCheckCircle, lucideXCircle,
  lucideUserX, lucideBuilding, lucideFileText,
  lucideMapPin, lucideMail, lucidePhone, lucideCalendar, lucideShieldAlert
} from '@ng-icons/lucide';
import { AdminCharityResponse } from '@foodlink/admin-dashboard-utils';
import { StatCardComponent } from '@foodlink/admin-dashboard-ui';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
@Component({
  selector: 'lib-admin-charity-profile-info',
  imports: [CommonModule, StatCardComponent, HlmFieldImports, HlmInputImports, BaseChartDirective, NgIcon, DatePipe],
  providers: [
    provideIcons({
      lucideClock, lucideCheckCircle, lucideXCircle,
      lucideUserX, lucideBuilding, lucideFileText,
      lucideMapPin, lucideMail, lucidePhone, lucideCalendar, lucideShieldAlert
    })
  ],
  templateUrl: './admin-charity-profile-info.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCharityProfileInfo {
  private readonly router = inject(Router);

  // Extract data from history state safely
  protected readonly charity = signal<AdminCharityResponse | null>(
    (this.router.currentNavigation()?.extras.state?.['charity'] || history.state?.['charity']) ?? null
  );

  // 1. Structural definitions for Metric Summary Cards
  protected readonly statCards = computed(() => {
    const data = this.charity();
    if (!data) return [];

    return [
      { label: 'Pending', value: data.pendingReservations, icon: 'lucideClock', color: '#3b82f6' },
      { label: 'Picked Up', value: data.pickedUpReservations, icon: 'lucideCheckCircle', color: '#10b981' },
      { label: 'Cancelled', value: data.cancelledReservations, icon: 'lucideXCircle', color: '#f59e0b' },
      { label: 'No Show', value: data.noShowReservations, icon: 'lucideUserX', color: '#ef4444' }
    ];
  });

  // 2. Setup ChartJS Layout Dataset Configurations
  protected readonly barChartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const data = this.charity();
    return {
      labels: ['Pending', 'Picked Up', 'Cancelled', 'No Show'],
      datasets: [
        {
          data: data ? [data.pendingReservations, data.pickedUpReservations, data.cancelledReservations, data.noShowReservations] : [0, 0, 0, 0],
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
          hoverBackgroundColor: ['#2563eb', '#059669', '#d97706', '#dc2626'],
          borderRadius: 8,
          borderSkipped: false,
          barThickness: 32
        }
      ]
    };
  });

  // 3. Chart Layout Display Options
  protected readonly barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { family: 'Inter', size: 12 } }
      },
      y: {
        grid: { color: '#e2e8f0' },
        border: { dash: [4, 4] },
        ticks: { color: '#64748b', precision: 0 }
      }
    }
  };
}

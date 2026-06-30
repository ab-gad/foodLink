import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'lib-admin-ui-stat-card',
  standalone: true,
  imports: [CommonModule, NgIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div 
      class="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm transition-all hover:shadow-md"
      [style.borderLeftColor]="color()"
      style="border-left-width: 4px;"
    >
      <div class="space-y-1">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {{ label() }}
        </span>
        <h3 class="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
          {{ value() | number }}
        </h3>
      </div>
      
      <div 
        class="flex h-12 w-12 items-center justify-center rounded-lg text-xl"
        [style.backgroundColor]="iconBgColor()"
        [style.color]="color()"
      >
        <ng-icon [name]="icon()" />
      </div>
    </div>
  `
})
export class StatCardComponent {
  public readonly label = input.required<string>();
  public readonly value = input.required<number>();
  public readonly icon = input.required<string>();
  public readonly color = input.required<string>();

  // Generates a soft alpha-transparent background shade out of the raw hex color for the icon badge
  protected readonly iconBgColor = computed(() => `${this.color()}15`);
}
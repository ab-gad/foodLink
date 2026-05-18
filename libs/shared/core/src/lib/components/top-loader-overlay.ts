import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GlobalLoaderService } from '../services/global-loader.service';

@Component({
  selector: 'lib-shared-core-top-loader-overlay',
  standalone: true,
  template: `
    <div
      [class]="'fixed top-0 left-0 right-0 h-[30vh] bg-linear-to-b from-green-600/90 to-emerald-600/0  z-9999 flex items-center justify-center transition-transform duration-300 ease-in-out ' + 
      (loaderService.isLoading() ? 'translate-y-0' : '-translate-y-full')"
    >
      <div class="flex items-center gap-3 bg-white/90 dark:bg-slate-900/95 px-5 py-2.5 rounded-full shadow-lg border border-slate-200/50">
        <span class="h-5 w-5 rounded-full border-2 border-green-600 border-t-transparent animate-spin"></span>
        <span class="text-sm font-medium text-slate-800 dark:text-slate-100 tracking-wide">Loading ...</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopLoaderOverlayComponent {
  protected readonly loaderService = inject(GlobalLoaderService);
}
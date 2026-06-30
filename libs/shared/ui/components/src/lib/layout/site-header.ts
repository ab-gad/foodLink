import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSun, lucideMoon } from '@ng-icons/lucide';
import { BreadcrumbService, ThemeService } from '@foodlink/shared-util'
@Component({
	selector: 'lib-shared-ui-site-header',
	standalone: true,
	imports: [
		RouterLink,
		NgIcon,
		HlmSidebarImports,
		HlmSeparatorImports,
		HlmBreadCrumbImports
	],
	providers: [
		provideIcons({ lucideSun, lucideMoon })
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
        <header class="flex h-16 shrink-0 items-center justify-between gap-2 px-4 border-b border-slate-200 dark:border-slate-800 w-full">
            <div class="flex items-center gap-2">
                <!-- eslint-disable-next-line @angular-eslint/template/elements-content -->
                <button hlmSidebarTrigger></button>
                <hlm-separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
                
                <nav hlmBreadcrumb>
                    <ol hlmBreadcrumbList>
                        @for (item of breadcrumbs(); track item.url; let last = $last) {
                            <li hlmBreadcrumbItem [class.hidden]="!last" class="sm:block">
                                @if (!last) {
                                    <a hlmBreadcrumbLink [link]="item.url">{{ item.label }}</a>
                                } @else {
                                    <a hlmBreadcrumbPage>{{ item.label }}</a>
                                }
                            </li>
                            @if (!last) {
                                <li hlmBreadcrumbSeparator class="hidden sm:block"></li>
                            }
                        }
                    </ol>
                </nav>
            </div>

            <div>
                <button 
                    type="button"
                    (click)="themeService.toggleTheme()" 
                    class="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    [attr.aria-label]="themeService.isDark() ? 'Switch to light theme' : 'Switch to dark theme'"
                >
                    @if (themeService.isDark()) {
                        <ng-icon name="lucideSun" class="text-lg text-amber-500" />
                    } @else {
                        <ng-icon name="lucideMoon" class="text-lg text-slate-700" />
                    }
                </button>
            </div>
        </header>
    `,
})
export class SiteHeader {
	private readonly breadcrumbService = inject(BreadcrumbService);
	public readonly themeService = inject(ThemeService);

	// Expose the signals cleanly to the local HTML template
	protected readonly breadcrumbs = this.breadcrumbService.breadcrumbs;
}
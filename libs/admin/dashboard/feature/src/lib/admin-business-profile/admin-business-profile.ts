import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBuilding,
  lucideHandHeart,
  lucideInfo,
  lucideShieldAlert
} from '@ng-icons/lucide';
import { AdminBusinessResponse } from '@foodlink/admin-dashboard-utils';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'lib-admin-business-profile',
  imports: [CommonModule, NgIcon, RouterOutlet],
  providers: [
    provideIcons({
      lucideBuilding,
      lucideShieldAlert,
      lucideInfo,
      lucideHandHeart,
    })
  ],
  templateUrl: './admin-business-profile.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBusinessProfile {
  private readonly router = inject(Router);

  protected readonly business = signal<AdminBusinessResponse | null>(
    (this.router.currentNavigation()?.extras.state?.['business'] || history.state?.['business']) ?? null
  );

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  protected navigateToTab(tabPath: string, title: string): void {
    const data = this.business();
    if (!data) return;

    this.router.navigate(['/businesses', data.id, tabPath], {
      state: { title: `${this.business()?.businessName} | ${title}`, business: data }
    });
  }

  protected isTabActive(tabPath: string): boolean {
    return this.currentUrl().endsWith(`/${tabPath}`);
  }
}

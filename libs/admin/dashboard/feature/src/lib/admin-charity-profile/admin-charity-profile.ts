import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideClock, lucideCheckCircle, lucideXCircle,
  lucideUserX, lucideBuilding, lucideFileText,
  lucideInfo,
  lucidePackage,
} from '@ng-icons/lucide';
import { AdminCharityResponse } from '@foodlink/admin-dashboard-utils';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
@Component({
  selector: 'lib-admin-charity-profile',
  imports: [CommonModule, HlmFieldImports, HlmInputImports, NgIcon, RouterOutlet, RouterOutlet,
  ]
  ,
  providers: [
    provideIcons({
      lucideClock, lucideCheckCircle, lucideXCircle, lucidePackage,
      lucideUserX, lucideBuilding, lucideFileText, lucideInfo,
    })
  ],
  templateUrl: './admin-charity-profile.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCharityProfile {
  private readonly router = inject(Router);

  protected readonly charity = signal<AdminCharityResponse | null>(
    (this.router.currentNavigation()?.extras.state?.['charity'] || history.state?.['charity']) ?? null
  );

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  protected navigateToTab(tabPath: string, title: string): void {
    const data = this.charity();
    if (!data) return;

    this.router.navigate(['/charities', data.id, tabPath], {
      state: { title: `${this.charity()?.name} | ${title}`, charity: data }
    });
  }

  protected isTabActive(tabPath: string): boolean {
    return this.currentUrl().endsWith(`/${tabPath}`);
  }

}

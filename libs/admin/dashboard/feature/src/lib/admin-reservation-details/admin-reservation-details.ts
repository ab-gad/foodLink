// reservation-details.component.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, Location, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideCalendar, lucideBuilding2, lucidePackage, lucideClock, lucideUser } from '@ng-icons/lucide';

// Spartan UI Primitives
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { Reservation } from '@foodlink/admin-dashboard-utils';

@Component({
    selector: 'lib-admin-reservation-details',
    standalone: true,
    imports: [
        CommonModule,
        HlmButtonImports,
        HlmCardImports,
        NgIcon,
        DatePipe
    ],
    providers: [
        provideIcons({ lucideArrowLeft, lucideCalendar, lucideBuilding2, lucidePackage, lucideClock, lucideUser })
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './admin-reservation-details.html'
})
export class ReservationDetailsComponent {
    private readonly router = inject(Router);
    private readonly location = inject(Location);

    protected readonly reservation = signal<Reservation | null>(
        (this.router.currentNavigation()?.extras.state?.['reservation'] as Reservation) || null
    );

    protected goBack(): void {
        this.location.back();
    }
}
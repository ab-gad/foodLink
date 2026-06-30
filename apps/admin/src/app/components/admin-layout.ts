import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@foodlink/shared-auth-data-access';
import { SidebarData, SidebarInsetPage } from '@foodlink/shared-ui-components';
import { provideIcons } from '@ng-icons/core';
import { lucideLayoutDashboard, lucideUsers, lucideHeartHandshake, lucideBuilding2, lucidePackage } from '@ng-icons/lucide';

@Component({
  selector: 'admin-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarInsetPage],
  providers: [
    provideIcons({
      lucideLayoutDashboard,
      lucideUsers,
      lucideHeartHandshake,
      lucideBuilding2,
      lucidePackage,
    }),
  ],
  template: `
    <lib-shared-ui-layout [sidebarData]="sidebarData()">
        <router-outlet></router-outlet>
    </lib-shared-ui-layout>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminShellComponent {
  protected readonly authService = inject(AuthService);
  sidebarData: WritableSignal<SidebarData>;

  constructor() {
    this.sidebarData = signal<SidebarData>({
      user: {
        name: this.authService.currentUser()?.name ?? '_',
        email: this.authService.currentUser()?.email ?? '_',
        avatar: this.authService.currentUser()?.profileImage ?? '_',
        logout: this.authService.logout.bind(this.authService)
      },
      navMain: [
        {
          groupName: 'Dashboard',
          groupItems: [
            {
              title: 'Admin Dashboard',
              icon: 'lucideLayoutDashboard',
              url: '/dashboard',
            },
          ]
        },
        {
          groupName: 'Users',
          groupItems: [
            {
              title: 'All Users',
              icon: 'lucideUsers',
              url: '/users',
            },
            {
              title: 'Charities',
              icon: 'lucideHeartHandshake',
              url: '/charities',
            },
            {
              title: 'Businesses',
              icon: 'lucideBuilding2',
              url: '/businesses',
            },
          ]
        },
        {
          groupName: 'Donation & Reservations',
          groupItems: [
            {
              title: 'Reservations',
              icon: 'lucidePackage',
              url: '/reservations',
            },
          ]
        }
      ],
      navSecondary: [
      ],
      projects: [
      ]
    });
  }
}
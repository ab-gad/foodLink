import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@foodlink/shared-auth-data-access';
import { SidebarData, SidebarInsetPage } from '@foodlink/shared-ui-components';
import { provideIcons } from '@ng-icons/core';
import { lucideLayoutDashboard, lucideUsers } from '@ng-icons/lucide';

@Component({
  selector: 'admin-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarInsetPage],
  providers: [
    provideIcons({
      lucideLayoutDashboard,
      lucideUsers
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
          title: 'Dashboard',
          icon: 'lucideLayoutDashboard',
          url: '/dashboard',
        },
        {
          title: 'Users',
          icon: 'lucideUsers',
          url: '/users',
        }
      ],
      navSecondary: [],
      projects: []
    });
  }
}
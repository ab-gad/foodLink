import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AdminDashboardService } from '@foodlink/admin-dashboard-data-access';
import { AdminUserResponse } from '@foodlink/admin-dashboard-utils';
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createAngularTable,
  ColumnDef,
  Table,
} from '@tanstack/angular-table';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { lucideChevronDown } from '@ng-icons/lucide';

// interface UserActionEvent extends Event {
//   detail: {
//     id: string;
//     suspended: boolean;
//   };
// }
@Component({
  selector: 'lib-admin-users-page',
  standalone: true,
  imports: [CommonModule, NgIcon, HlmDropdownMenuImports, HlmButtonImports],
  providers: [AdminDashboardService, provideIcons({ lucideChevronDown })],
  templateUrl: './admin-users-page.html',
  styleUrl: './admin-users-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // host: {
  //   '(window:user-action)': 'onUserAction($event)'
  // }
})
export class AdminUsersPage {
  private readonly dashboardService = inject(AdminDashboardService);

  protected readonly usersQuery = this.dashboardService.getAllUsers;
  private readonly suspendMutation = this.dashboardService.suspendUser;
  private readonly reactivateMutation = this.dashboardService.reactivateUser;

  // Reactivity State Parameters
  protected readonly $globalFilter = signal<string>('');
  protected readonly $roleFilter = signal<string>('ALL');

  // Computed data pipeline combining server payload with local filters
  private readonly filteredData = computed(() => {
    const rawUsers = this.usersQuery.data()?.items || [];
    const search = this.$globalFilter().toLowerCase().trim();
    const roleToken = this.$roleFilter();

    return rawUsers.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search);
      const normalizedRole = String(u.role).toUpperCase().includes('CHARITY')
        ? 'CHARITY'
        : 'RESTAURANT';
      const matchesRole = roleToken === 'ALL' || normalizedRole === roleToken;
      return matchesSearch && matchesRole;
    });
  });

  private readonly columns: ColumnDef<AdminUserResponse>[] = [
    {
      id: 'Name', // 👈 Explicit text identifier strings
      accessorKey: 'name',
      header: 'Name',
    },
    {
      id: 'Type',
      accessorKey: 'role',
      header: 'Type',
    },
    {
      id: 'Email',
      accessorKey: 'email',
      header: 'Email',
    },
    {
      id: 'Registered At',
      accessorKey: 'createdAt',
      header: 'Registered At',
    },
    {
      id: 'Status',
      accessorKey: 'isSuspended',
      header: 'Status',
    },
    {
      id: 'Actions', // Keep it untoggled if you want actions to remain persistent
      header: 'Actions',
    }
  ];
  // Initialize the TanStack Angular Table core wrapper engine
  protected readonly table: Table<AdminUserResponse> = createAngularTable(
    () => ({
      data: this.filteredData(),
      columns: this.columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      initialState: {
        pagination: { pageSize: 10, pageIndex: 0 },
      },
    }),
  );

  // Handle Global Text Filter Inputs
  protected updateFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.$globalFilter.set(input.value);
    this.table.setPageIndex(0); // Go back to start on search mutation change
  }

  // Handle Specialized Role Filters changes
  protected toggleRoleFilter(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.$roleFilter.set(select.value);
    this.table.setPageIndex(0);
  }

  // protected onUserAction(event: Event): void {
  //   const { id, suspended } = (event as UserActionEvent).detail;
  //   if (suspended) {
  //     this.reactivateMutation.mutate(id);
  //   } else {
  //     this.suspendMutation.mutate(id);
  //   }
  // }
  protected toggleSuspension(id: string, currentlySuspended: boolean): void {
    if (currentlySuspended) {
      this.reactivateMutation.mutate(id);
    } else {
      this.suspendMutation.mutate(id);
    }
  }
}

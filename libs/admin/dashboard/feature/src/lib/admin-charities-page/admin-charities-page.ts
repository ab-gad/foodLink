import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AdminDashboardService } from '@foodlink/admin-dashboard-data-access';
import { AdminCharityResponse } from '@foodlink/admin-dashboard-utils';
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createAngularTable,
  ColumnDef,
  Table,
  flexRenderComponent,
  FlexRenderDirective,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
  RowSelectionState,
  VisibilityState,
} from '@tanstack/angular-table';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { lucideChevronDown, lucideUserRoundX, lucideUserRoundCheck, lucideSquareArrowOutUpRight } from '@ng-icons/lucide';
import { ActionDropdown, TableHeadSortButton, UserAvatar } from "@foodlink/shared-ui-components"
import { HlmTableImports } from '@spartan-ng/helm/table';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { Router } from '@angular/router';


@Component({
  selector: 'lib-admin-charities-page',
  imports: [CommonModule, NgIcon, HlmDropdownMenuImports, HlmButtonImports, HlmTableImports, FlexRenderDirective],
  providers: [DatePipe, provideIcons({ lucideChevronDown, lucideUserRoundX, lucideSquareArrowOutUpRight, lucideUserRoundCheck })],
  templateUrl: './admin-charities-page.html',
  styleUrl: './admin-charities-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCharitiesPage {
  private readonly dashboardService = inject(AdminDashboardService);
  private readonly router = inject(Router);

  protected readonly usersQuery = injectQuery(() => this.dashboardService.getAllCharitiesOptions());
  private readonly suspendMutation = injectMutation(() => this.dashboardService.suspendUserOptions());
  private readonly reactivateMutation = injectMutation(() => this.dashboardService.reactivateUserOptions());

  // Reactivity State Parameters
  protected readonly $globalFilter = signal<string>('');

  // Computed data pipeline combining server payload with local filters
  private readonly filteredData = computed(() => {
    const rawUsers = this.usersQuery.data()?.items || [];
    const search = this.$globalFilter().toLowerCase().trim();

    return rawUsers.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search);

      return matchesSearch;
    });
  });
  private readonly _columnFilters = signal<ColumnFiltersState>([]);
  private readonly _sorting = signal<SortingState>([]);
  private readonly _rowSelection = signal<RowSelectionState>({});
  private readonly _columnVisibility = signal<VisibilityState>({});

  protected readonly columns: ColumnDef<AdminCharityResponse>[] = [
    {
      id: 'Avatar',
      accessorKey: 'profileImage',
      header: 'Avatar',
      enableSorting: false,
      cell: (context) => flexRenderComponent(UserAvatar, { inputs: { image: context.row.original.profileImage, fallbackText: context.row.original.name } }),
    },
    {
      id: 'Name',
      accessorKey: 'name',
      header: () =>
        flexRenderComponent(TableHeadSortButton<AdminCharityResponse>, { inputs: { header: '' } }),
      cell: (context) => `<span class="text-slate-900 dark:text-slate-100">${context.getValue<string>()}</span>`,
    },
    {
      id: 'Email',
      accessorKey: 'email',
      header: () =>
        flexRenderComponent(TableHeadSortButton<AdminCharityResponse>, { inputs: { header: '' } }),
      cell: (context) => `<span>${context.getValue<string>()}</span>`,
    },
    {
      id: 'Status',
      accessorKey: 'isSuspended',
      header: () =>
        flexRenderComponent(TableHeadSortButton<AdminCharityResponse>, { inputs: { header: '' } }),
      cell: (context) => {
        const isSuspended = Boolean(context.getValue<string>());
        const statusClass = isSuspended ? 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/20';
        const statusText = isSuspended ? 'Suspended' : 'Active';
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${statusClass}">${statusText}</span>`
      }
    },
    {
      id: 'Total Reservations',
      accessorKey: 'totalReservations',
      header: () =>
        flexRenderComponent(TableHeadSortButton<AdminCharityResponse>, { inputs: { header: '' } }),
      cell: (context) => {
        return `<span>${context.getValue<string>()}</span>`
      },
    },
    {
      id: 'Picked Up',
      accessorKey: 'pickedUpReservations',
      header: () =>
        flexRenderComponent(TableHeadSortButton<AdminCharityResponse>, { inputs: { header: '' } }),
      cell: (context) => {
        return `<span>${context.getValue<string>()}</span>`
      },
    },
    {
      id: 'No Show',
      accessorKey: 'noShowReservations',
      header: () =>
        flexRenderComponent(TableHeadSortButton<AdminCharityResponse>, { inputs: { header: '' } }),
      cell: (context) => {
        return `<span>${context.getValue<string>()}</span>`
      },
    },
    {
      id: 'Actions',
      header: 'Actions',
      enableSorting: false,
      enableHiding: false,
      cell: (context) =>
        flexRenderComponent(ActionDropdown<AdminCharityResponse>, {
          inputs: {
            contextInstance: context.row.original,
            actions: [
              { label: 'Activate', id: 'activate', icon: 'lucideUserRoundCheck', clickFn: (user) => this.toggleSuspension(user.userId, true), disableFn: (user) => !user.isSuspended },
              { label: 'Suspend', id: 'suspend', icon: 'lucideUserRoundX', clickFn: (user) => this.toggleSuspension(user.userId, false), disableFn: (user) => user.isSuspended },
              { label: 'Details', id: 'details', icon: 'lucideSquareArrowOutUpRight', clickFn: (user) => this.viewProfile(user), disableFn: (user) => user.isSuspended },
            ]
          },
        }),
    }
  ];
  // Initialize the TanStack Angular Table core wrapper engine
  protected readonly table: Table<AdminCharityResponse> = createAngularTable(
    () => ({
      data: this.filteredData(),
      columns: this.columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      initialState: {
        pagination: { pageSize: 10, pageIndex: 0 },
      },
      onSortingChange: (updater) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        updater instanceof Function
          ? this._sorting.update(updater)
          : this._sorting.set(updater);
      },
      onColumnFiltersChange: (updater) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        updater instanceof Function
          ? this._columnFilters.update(updater)
          : this._columnFilters.set(updater);
      },
      onColumnVisibilityChange: (updater) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        updater instanceof Function
          ? this._columnVisibility.update(updater)
          : this._columnVisibility.set(updater);
      },
      onRowSelectionChange: (updater) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        updater instanceof Function
          ? this._rowSelection.update(updater)
          : this._rowSelection.set(updater);
      },
      state: {
        sorting: this._sorting(),
        columnFilters: this._columnFilters(),
        columnVisibility: this._columnVisibility(),
        rowSelection: this._rowSelection(),
      }
    }),
  );

  protected readonly hidableColumns = this.table
    .getAllColumns()
    .filter((column) => column.getCanHide());
  // Handle Global Text Filter Inputs
  protected updateFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.$globalFilter.set(input.value);
    this.table.setPageIndex(0); // Go back to start on search mutation change
  }

  private toggleSuspension(id: string, currentlySuspended: boolean): void {
    if (currentlySuspended) {
      this.reactivateMutation.mutate(id);
    } else {
      this.suspendMutation.mutate(id);
    }
  }

  private viewProfile(charity: AdminCharityResponse): void {
    this.router.navigate(['/charities', charity.id], {
      state: { title: `${charity.name} | Profile`, charity },
    });
  }
}

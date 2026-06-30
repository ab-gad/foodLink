import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import {
    ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    ColumnFiltersState,
    Table
} from '@tanstack/table-core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFilter, lucideChevronDown, lucideEyeOff, lucideEye, lucideSquareArrowOutUpRight } from '@ng-icons/lucide';

// Spartan UI Imports
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

import { AdminDashboardService } from '@foodlink/admin-dashboard-data-access';
import { createAngularTable, FlexRenderDirective } from '@tanstack/angular-table';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { AdminDonationResponse, DonationStatus, AdminBusinessResponse } from '@foodlink/admin-dashboard-utils';

@Component({
    selector: 'lib-admin-donations-table',
    standalone: true,
    imports: [
        CommonModule,
        HlmCheckboxImports,
        HlmButtonImports,
        HlmTableImports,
        HlmSkeletonImports,
        NgIcon,
        DatePipe,
        FlexRenderDirective,
        HlmPopoverImports,
        BrnPopoverImports,
    ],
    providers: [provideIcons({ lucideFilter, lucideChevronDown, lucideEyeOff, lucideEye, lucideSquareArrowOutUpRight })],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './admin-donations-page.html'
})
export class DonationsTableComponent {
    private readonly router = inject(Router);
    private readonly donationsService = inject(AdminDashboardService);

    // Context coming from the routing state if viewing a specific business's details
    protected readonly business = signal<AdminBusinessResponse | null>(
        (this.router.currentNavigation()?.extras.state?.['business'] || history.state?.['business']) ?? null
    );

    // Dynamic routing configurations based on whether context id is available
    protected readonly donationsQuery = this.business()?.id ?
        injectQuery(() => this.donationsService.getBusinessDonationsOptions(this.business()?.id as string))
        :
        injectQuery(() => this.donationsService.getAllDonationsOptions());

    protected readonly donationsData = computed(() =>
        this.donationsQuery.data()?.items.length ? this.donationsQuery.data()?.items || [] : MOCK_DONATIONS
    );

    protected readonly columnFilters = signal<ColumnFiltersState>([]);
    protected readonly columnVisibility = signal<Record<string, boolean>>({});

    protected readonly columns: ColumnDef<AdminDonationResponse>[] = [
        { id: 'title', accessorKey: 'title', header: 'Donation' },
        { id: 'business', accessorFn: (row) => row.businessName, header: 'Business Partner', filterFn: 'arrIncludesSome' },
        { id: 'status', accessorKey: 'status', header: 'Status', filterFn: 'arrIncludesSome' },
        { id: 'items', header: 'Stock Allocation' },
        { id: 'expirationDate', accessorKey: 'expirationDate', header: 'Expiration Window' },
        // { id: 'details', header: 'Details', enableHiding: false }
    ];

    protected readonly table: Table<AdminDonationResponse> = createAngularTable(() => ({
        columns: this.columns,
        data: this.donationsData(),
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters: this.columnFilters(),
            columnVisibility: this.columnVisibility()
        },
        onColumnFiltersChange: (updater) => {
            if (typeof updater === 'function') this.columnFilters.update(updater);
            else this.columnFilters.set(updater);
        },
        onColumnVisibilityChange: (updater) => {
            if (typeof updater === 'function') this.columnVisibility.update(updater);
            else this.columnVisibility.set(updater);
        }
    }));

    // Generate dynamic filters mapping businessName instead of charity name
    protected readonly dynamicFilters = computed(() => {
        const list = this.donationsData();
        return {
            business: Array.from(new Set(list.map(d => d.businessName))).map(name => ({ label: name, value: name })),
            status: Array.from(new Set(list.map(d => d.status))).map(status => ({ label: status, value: status }))
        };
    });

    constructor() {
        // Automatically hide business column if contextual business context parameter is supplied
        effect(() => {
            const id = this.business()?.id;
            this.columnVisibility.set({ business: !id });
        });
    }

    protected toggleFacetFilter(columnId: string, value: string): void {
        const column = this.table.getColumn(columnId);
        if (!column) return;
        const currentValues = (column.getFilterValue() as string[]) || [];
        const newValues = currentValues.includes(value) ? currentValues.filter(v => v !== value) : [...currentValues, value];
        column.setFilterValue(newValues.length > 0 ? newValues : undefined);
    }

    protected isValueChecked(columnId: string, value: string): boolean {
        return ((this.table.getColumn(columnId)?.getFilterValue() as string[]) || []).includes(value);
    }

    protected viewDonationDetails(donation: AdminDonationResponse): void {
        this.router.navigate(['/donations', donation.id], {
            state: { donation }
        });
    }
}

// Complete Mock payload array mapping backend response data schema 
export const MOCK_DONATIONS: AdminDonationResponse[] = [
    {
        id: 'don-001',
        businessProfileId: 'biz-101',
        businessName: 'Downtown Flour Bakery',
        title: 'Fresh Organic Bakery Assortment',
        status: DonationStatus.Available,
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=60',
        expirationDate: '2026-07-02T18:00:00Z',
        totalItems: 25,
        reservedItems: 0,
        createdAt: '2026-06-30T08:00:00Z'
    },
    {
        id: 'don-002',
        businessProfileId: '6d4d9278-52ee-4e98-a90a-110ca96281fe',
        businessName: 'Valley Harvest Markets',
        title: 'Gourmet Catering Box Lunches',
        status: DonationStatus.PartiallyReserved,
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=60',
        expirationDate: '2026-06-29T20:00:00Z',
        totalItems: 20,
        reservedItems: 12,
        createdAt: '2026-06-28T10:15:00Z'
    },
    {
        id: 'don-003',
        businessProfileId: '6d4d9278-52ee-4e98-a90a-110ca96281fe',
        businessName: 'Valley Harvest Markets',
        title: 'Overstock Farm Fresh Produce Bags',
        status: DonationStatus.FullyReserved,
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=60',
        expirationDate: '2026-07-05T15:00:00Z',
        totalItems: 50,
        reservedItems: 50,
        createdAt: '2026-06-29T14:20:00Z'
    }
];
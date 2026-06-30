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

import { AdminCharityResponse, Reservation, ReservationStatus } from '@foodlink/admin-dashboard-utils';
import { AdminDashboardService } from '@foodlink/admin-dashboard-data-access';
import { createAngularTable, FlexRenderDirective } from '@tanstack/angular-table';
import { injectQuery } from '@tanstack/angular-query-experimental';
@Component({
    selector: 'lib-admin-reservations-table',
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
    templateUrl: './admin-reservations-page.html'
})
export class ReservationsTableComponent {
    private readonly router = inject(Router);
    private readonly reservationsService = inject(AdminDashboardService);

    protected readonly charity = signal<AdminCharityResponse | null>(
        (this.router.currentNavigation()?.extras.state?.['charity'] || history.state?.['charity']) ?? null
    );
    // 2. Declarative TanStack Query integration
    protected readonly reservationsQuery = this.charity()?.id ?
        injectQuery(() => this.reservationsService.getCharityReservationsOptions(this.charity()?.id as string))
        :
        injectQuery(() => this.reservationsService.getAllReservationsOptions())

    // 3. Drive table tracking directly out of the cache payload matrix
    protected readonly reservationsData = computed(() => this.reservationsQuery.data()?.items.length ? this.reservationsQuery.data()?.items || [] : MOCK_RESERVATIONS);

    protected readonly columnFilters = signal<ColumnFiltersState>([]);
    protected readonly columnVisibility = signal<Record<string, boolean>>({});

    protected readonly columns: ColumnDef<Reservation>[] = [
        { id: 'donation', accessorFn: (row) => row.donation.title, header: 'Donation' },
        { id: 'charity', accessorFn: (row) => row.charity.name, header: 'Charity Organization', filterFn: 'arrIncludesSome' },
        { id: 'status', accessorKey: 'status', header: 'Status', filterFn: 'arrIncludesSome' },
        { id: 'quantity', accessorKey: 'totalQuantity', header: 'Qty Requested' },
        { id: 'expiresAt', accessorKey: 'expiresAt', header: 'Expiration Matrix' },
        { id: 'details', header: 'Details', enableHiding: false }
    ];

    protected readonly table: Table<Reservation> = createAngularTable(() => ({
        columns: this.columns,
        data: this.reservationsData(), // Reactively updates on cache mutation or fetch cycles
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

    protected readonly dynamicFilters = computed(() => {
        const list = this.reservationsData();
        return {
            charity: Array.from(new Set(list.map(r => r.charity.name))).map(name => ({ label: name, value: name })),
            status: Array.from(new Set(list.map(r => r.status))).map(status => ({ label: status, value: status }))
        };
    });

    constructor() {
        // 4. Reactive contextual column updates via declarative side-effects
        effect(() => {
            const id = this.charity()?.id;
            this.columnVisibility.set({ charity: !id });
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
    protected viewReservationDetails(reservation: Reservation): void {
        this.router.navigate(['/reservations', reservation.id], {
            state: { reservation }
        });
    }
}




export const MOCK_RESERVATIONS: Reservation[] = [
    {
        id: 'res-001',
        status: ReservationStatus.PickedUp,
        expiresAt: '2026-07-02T18:00:00Z',
        pickedUpAt: '2026-07-02T14:30:00Z',
        isExpired: false,
        donation: {
            id: 'don-101',
            title: 'Fresh Organic Bakery Assortment',
            imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=60',
            businessName: 'Downtown Flour Bakery'
        },
        charity: {
            id: '6294a780-3f19-498b-9561-330327d6b89d',
            name: 'Hope Community Kitchen'
        },
        items: [
            { donationItemId: 'item-1', itemName: 'Sourdough Loaves', unit: 'pcs', quantity: 10 },
            { donationItemId: 'item-2', itemName: 'Butter Croissants', unit: 'pcs', quantity: 15 }
        ],
        totalItems: 2,
        totalQuantity: 25
    },
    {
        id: 'res-002',
        status: ReservationStatus.NoShow,
        expiresAt: '2026-06-29T20:00:00Z',
        pickedUpAt: null,
        isExpired: true,
        donation: {
            id: 'don-102',
            title: 'Gourmet Catering Box Lunches',
            imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=60',
            businessName: 'Green Leaf Catering'
        },
        charity: {
            id: 'charity-xyz',
            name: 'Beacon Rescue Mission'
        },
        items: [
            { donationItemId: 'item-3', itemName: 'Chicken Avocado Wraps', unit: 'boxes', quantity: 12 },
            { donationItemId: 'item-4', itemName: 'Quinoa Salad Bowls', unit: 'boxes', quantity: 8 }
        ],
        totalItems: 2,
        totalQuantity: 20
    },
    {
        id: 'res-003',
        status: ReservationStatus.Cancelled,
        expiresAt: '2026-07-05T15:00:00Z',
        pickedUpAt: null,
        isExpired: false,
        donation: {
            id: 'don-103',
            title: 'Overstock Farm Fresh Produce Bags',
            imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=60',
            businessName: 'Valley Harvest Markets'
        },
        charity: {
            id: '6294a780-3f19-498b-9561-330327d6b89d',
            name: 'Hope Community Kitchen'
        },
        items: [
            { donationItemId: 'item-5', itemName: 'Mixed Greens Bags', unit: 'lbs', quantity: 30 },
            { donationItemId: 'item-6', itemName: 'Organic Fuji Apples', unit: 'lbs', quantity: 20 }
        ],
        totalItems: 2,
        totalQuantity: 50
    },
    {
        id: 'res-004',
        status: ReservationStatus.Expired,
        expiresAt: '2026-06-25T22:00:00Z',
        pickedUpAt: null,
        isExpired: true,
        donation: {
            id: 'don-104',
            title: 'Dairy and Milk Surplus crates',
            imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=150&auto=format&fit=crop&q=60',
            businessName: 'Meadowbrook Dairy Distributors'
        },
        charity: {
            id: 'charity-xyz',
            name: 'Beacon Rescue Mission'
        },
        items: [
            { donationItemId: 'item-7', itemName: 'Whole Milk 1-Gallon', unit: 'units', quantity: 15 },
            { donationItemId: 'item-8', itemName: 'Greek Yogurt Tubs', unit: 'units', quantity: 40 }
        ],
        totalItems: 2,
        totalQuantity: 55
    },
    {
        id: 'res-005',
        status: ReservationStatus.PickedUp,
        expiresAt: '2026-07-01T12:00:00Z',
        pickedUpAt: '2026-06-30T10:15:00Z',
        isExpired: false,
        donation: {
            id: 'don-105',
            title: 'Prepared Family-Style Trays',
            imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=150&auto=format&fit=crop&q=60',
            businessName: 'Bella Italia Bistro'
        },
        charity: {
            id: '6294a780-3f19-498b-9561-330327d6b89d',
            name: 'Hope Community Kitchen'
        },
        items: [
            { donationItemId: 'item-9', itemName: 'Baked Ziti Trays', unit: 'trays', quantity: 5 },
            { donationItemId: 'item-10', itemName: 'Garlic Knots Bags', unit: 'bags', quantity: 5 }
        ],
        totalItems: 2,
        totalQuantity: 10
    }
];
export enum ReservationStatus {
    PickedUp = 'PickedUp',
    NoShow = 'NoShow',
    Cancelled = 'Cancelled',
    Expired = 'Expired'
}

export interface Donation {
    id: string;
    title: string;
    imageUrl: string;
    businessName: string;
}

interface Charity {
    id: string;
    name: string;
}

export interface ReservationItem {
    donationItemId: string;
    itemName: string;
    unit: string;
    quantity: number;
}

export interface Reservation {
    id: string;
    status: ReservationStatus;
    expiresAt: string;
    pickedUpAt: string | null;
    isExpired: boolean;
    donation: Donation;
    charity: Charity;
    items: ReservationItem[];
    totalItems: number;
    totalQuantity: number;
}
export enum DonationStatus {
    Draft = 'Draft',
    Available = 'Available',
    PartiallyReserved = 'PartiallyReserved',
    FullyReserved = 'FullyReserved',
    Completed = 'Completed',
    Cancelled = 'Cancelled',
    Expired = 'Expired'
}

export interface AdminDonationResponse {
    id: string;
    businessProfileId: string;
    businessName: string;
    title: string;
    status: DonationStatus;
    imageUrl: string | null;
    expirationDate: string; // ISO String from backend DateTime
    totalItems: number;
    reservedItems: number;
    createdAt: string;
}
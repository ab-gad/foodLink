export interface AdminUserResponse {
    id: string;
    name: string;
    email: string;
    role: '0' | 'Charity' | 'Business';
    phone: string;
    profileImage: string | null;
    isSuspended: boolean;
    createdAt: Date | string;
}

export interface AdminCharityResponse extends Omit<AdminUserResponse, 'role'> {
    userId: string;
    licenseNumber: string;
    address: string;
    totalReservations: number,
    pickedUpReservations: number,
    noShowReservations: number,
    cancelledReservations: number,
    pendingReservations: number
}

export interface AdminBusinessResponse extends Omit<AdminUserResponse, 'role' | 'name'> {
    userId: string;
    businessName: string,
    businessType: string,
    address: string;
    totalDonations: number,
    activeDonations: number,
    expiredDonations: number,
}
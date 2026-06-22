export interface AdminUserResponse {
    id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    profileImage: string | null;
    isSuspended: boolean;
    createdAt: Date | string;
}
export interface RegisterBusinessRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
    profileImage: File | Blob | null;
    profileImageFileName: string | null;
    businessName: string;
    address: string;
    businessType: string;
}

export interface RegisterCharityRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
    profileImage: File | Blob | null;
    profileImageFileName: string | null;
    organizationName: string;
    licenseNumber: string;
    address: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthenticationResponse {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Business' | 'Charity';
    profileImage: string | null;
    organizationName: string | null;
    token: string;
}

export interface UserResponse {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'DONOR' | 'CHARITY';
    phone: string;
    profileImage: string | null;
}
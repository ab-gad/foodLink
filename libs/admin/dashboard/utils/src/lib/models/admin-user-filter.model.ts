import { PaginationRequest, UserRole } from "@foodlink/shared-util";

export interface AdminUserFilter extends PaginationRequest {
    search?: string;
    isSuspended?: string;
    role?: UserRole;
}
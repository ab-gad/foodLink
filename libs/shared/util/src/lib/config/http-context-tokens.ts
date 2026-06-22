import { HttpContextToken, HttpErrorResponse } from '@angular/common/http';

export const SHOW_GLOBAL_LOADER = new HttpContextToken<boolean>(() => false);

export interface ToastPromiseConfig {
    loading?: string;
    hideError?: boolean;
    success: string;
    error: string | ((err: HttpErrorResponse) => string);
}

export const TOAST_PROMISE_CONFIG = new HttpContextToken<ToastPromiseConfig | null>(() => null);
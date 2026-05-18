// libs/shared/auth/data-access/src/lib/auth.service.ts
import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { LoginRequest, AuthenticationResponse } from '@foodlink/shared-auth-util';
import { lastValueFrom } from 'rxjs';
import { ENV_CONFIG, SHOW_GLOBAL_LOADER, TOAST_PROMISE_CONFIG } from '@foodlink/shared-util'

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = inject(ENV_CONFIG).apiUrl;

    readonly #token = signal<string | null>(localStorage.getItem('fl_token'));
    readonly #user = signal<AuthenticationResponse | null>(null);

    readonly isAuthenticated = computed(() => !!this.#token());
    readonly currentUser = computed(() => this.#user());
    readonly userRole = computed(() => this.#user()?.role ?? null);
    readonly token = computed(() => this.#token());

    readonly loginMutation = injectMutation(() => ({
        mutationFn: (credentials: LoginRequest) =>
            lastValueFrom(
                this.http.post<AuthenticationResponse>(`${this.apiUrl}/auth/login`, credentials, {
                    // context: new HttpContext().set(SHOW_GLOBAL_LOADER, true)
                    context: new HttpContext().set(SHOW_GLOBAL_LOADER, true).set(TOAST_PROMISE_CONFIG, {
                        success: 'Login successful',
                        error: (err) => `Login failed: ${err.error.message || err.message}`
                    })
                }))
        , onSuccess: (response) => {
            this.handleAuthSuccess(response);
        }
    }));

    private handleAuthSuccess(response: AuthenticationResponse): void {
        localStorage.setItem('fl_token', response.token);
        this.#token.set(response.token);
        this.#user.set(response);
    }

    logout(): void {
        localStorage.removeItem('fl_token');
        this.#token.set(null);
        this.#user.set(null);
    }
}
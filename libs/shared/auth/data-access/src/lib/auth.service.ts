// libs/shared/auth/data-access/src/lib/auth.service.ts
import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { LoginRequest, AuthenticationResponse } from './models/auth.models';
import { lastValueFrom } from 'rxjs';
import { ENV_CONFIG } from '@foodlink/shared-util'

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
                this.http.post<AuthenticationResponse>(`${this.apiUrl}/api/auth/login`, credentials))
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
import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { injectMutation, QueryClient } from '@tanstack/angular-query-experimental';
import { LoginRequest, AuthenticationResponse } from '@foodlink/shared-auth-util';
import { lastValueFrom } from 'rxjs';
import { ENV_CONFIG, SHOW_GLOBAL_LOADER, TOAST_PROMISE_CONFIG } from '@foodlink/shared-util'
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = inject(ENV_CONFIG).apiUrl;
    private router = inject(Router);
    private queryClient = inject(QueryClient);

    readonly #token = signal<string | null>(localStorage.getItem('fl_token'));
    readonly #user = signal<AuthenticationResponse | null>(localStorage.getItem('fl_user') ? JSON.parse(localStorage.getItem('fl_user') ?? '{}') : null);

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
        localStorage.setItem('fl_user', JSON.stringify(response));
        this.#token.set(response.token);
        this.#user.set(response);
        this.router.navigate(['/']);
    }

    logout(): void {
        this.queryClient.clear();
        this.queryClient.resetQueries();
        this.queryClient.removeQueries();
        localStorage.removeItem('fl_token');
        localStorage.removeItem('fl_user');
        this.#token.set(null);
        this.#user.set(null);
        this.router.navigate(['/login']);
    }
}
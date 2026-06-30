import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { LoginRequest, AuthenticationResponse } from '@foodlink/shared-auth-util';
import { lastValueFrom } from 'rxjs';
import { ENV_CONFIG, SHOW_GLOBAL_LOADER, TOAST_PROMISE_CONFIG } from '@foodlink/shared-util';
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

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    loginMutationOptions() {
        return {
            mutationFn: (credentials: LoginRequest) =>
                lastValueFrom(
                    this.http.post<AuthenticationResponse>(`${this.apiUrl}/auth/login`, credentials, {
                        context: new HttpContext()
                            .set(SHOW_GLOBAL_LOADER, true)
                            .set(TOAST_PROMISE_CONFIG, {
                                success: 'Login successful',
                                error: (err: HttpErrorResponse) => `Login failed: ${err.error?.message || err.message}`
                            })
                    })
                ),
            onSuccess: (response: AuthenticationResponse) => {
                this.handleAuthSuccess(response);
            }
        };
    }

    private handleAuthSuccess(response: AuthenticationResponse): void {
        localStorage.setItem('fl_token', response.token);
        localStorage.setItem('fl_user', JSON.stringify(response));
        this.#token.set(response.token);
        this.#user.set(response);
        this.router.navigate(['/']);
    }

    logout(): void {
        // FIXED: queryClient.clear() destroys the entire cache and removes all queries.
        // You don't need resetQueries() or removeQueries() after calling clear()!
        this.queryClient.clear();

        localStorage.removeItem('fl_token');
        localStorage.removeItem('fl_user');
        this.#token.set(null);
        this.#user.set(null);
        this.router.navigate(['/login']);
    }
}
import { ApplicationConfig, EnvironmentProviders, provideBrowserGlobalErrorListeners, Provider } from '@angular/core';
import { provideRouter, Routes, TitleStrategy, withComponentInputBinding } from '@angular/router';
import { HttpErrorResponse, HttpStatusCode, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { ENV_CONFIG, EnvironmentConfig } from '@foodlink/shared-util';
import { errorInterceptor } from '../interceptors/error.interceptor';
import { authInterceptor } from '../interceptors/auth.interceptor';
import { withDevtools } from '@tanstack/angular-query-experimental/devtools'
import { feedbackInterceptor } from '../interceptors/feedback.interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { CustomTitleStrategy } from '../strategies/custom-title.strategy';
export interface AppConfigOptions {
    routes: Routes;
    environment: EnvironmentConfig;
    additionalProviders?: Array<Provider | EnvironmentProviders>;
}

export function createApplicationConfig(options: AppConfigOptions): ApplicationConfig {
    const { routes, environment, additionalProviders = [] } = options;

    return {
        providers: [
            provideBrowserGlobalErrorListeners(),
            provideRouter(routes, withComponentInputBinding()),
            provideHttpClient(
                withInterceptors([authInterceptor, feedbackInterceptor, errorInterceptor])
            ),
            provideTanStackQuery(
                new QueryClient({
                    // queryCache: new QueryCache({
                    //     onError: (error, _query) => {
                    //         const httpError = error as HttpErrorResponse;
                    //         // Prevent showing popups for silent background fetches or expected 401s
                    //         if (httpError.status !== HttpStatusCode.Unauthorized) {
                    //             // TODO: Inject your Spartan UI Toast Service here to notify the user
                    //             console.error(`[Global Query Error]: ${httpError.error?.message || 'Failed to sync data'}`);
                    //         }
                    //     },
                    // }),
                    // mutationCache: new MutationCache({
                    //     onError: (error, _variables, _context, _mutation) => {
                    //         const httpError = error as HttpErrorResponse;
                    //         // TODO: Inject your Spartan UI Toast Service here to notify the user
                    //         alert(`Action Failed: ${httpError.error?.message || 'Something went wrong'}`);
                    //     },
                    // }),
                    defaultOptions: {
                        queries: {
                            staleTime: 1000 * 60 * 5,
                            retry: (failureCount, error) => {
                                const httpError = error as HttpErrorResponse;
                                if (httpError.status === HttpStatusCode.Unauthorized || httpError.status === HttpStatusCode.Forbidden || httpError.status === HttpStatusCode.BadRequest) {
                                    return false;
                                }
                                return failureCount < 2; // Retry network hiccups twice maximum
                            },
                        },
                    },
                }), withDevtools()
            ),
            {
                provide: ENV_CONFIG,
                useValue: environment,
            },
            { provide: TitleStrategy, useClass: CustomTitleStrategy },
            provideCharts(withDefaultRegisterables()),
            ...additionalProviders,
        ],
    };
}
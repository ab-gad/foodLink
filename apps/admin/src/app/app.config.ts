import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { ENV_CONFIG } from '@foodlink/shared-util';
import { environment } from '../environments/environment';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { withDevtools } from '@tanstack/angular-query-experimental/devtools'
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@foodlink/shared-auth-util'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideTanStackQuery(new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 minutes global cache default
          retry: false,            // Don't spam retries on auth/API failures
        },
      },
    }), withDevtools()),
    { provide: ENV_CONFIG, useValue: environment }
  ],
};

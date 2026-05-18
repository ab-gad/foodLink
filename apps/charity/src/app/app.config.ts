import {
  ApplicationConfig,
} from '@angular/core';
import { appRoutes } from './app.routes';
import { environment } from '../environments/environment';
import { createApplicationConfig } from '@foodlink/shared-core'

export const appConfig: ApplicationConfig = createApplicationConfig({ routes: appRoutes, environment: environment });

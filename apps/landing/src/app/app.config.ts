import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import {
  ApplicationConfig,
} from '@angular/core';
import { appRoutes } from './app.routes';
import { environment } from '../environments/environment';
import { createApplicationConfig } from '@foodlink/shared-core'

export const appConfig: ApplicationConfig = createApplicationConfig({ routes: appRoutes, environment: environment, additionalProviders: [provideClientHydration(withEventReplay())] });

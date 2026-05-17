import { InjectionToken } from '@angular/core';
import { EnvironmentConfig } from './app-config.model';

export const ENV_CONFIG = new InjectionToken<EnvironmentConfig>('FoodLinkEnvConfig');
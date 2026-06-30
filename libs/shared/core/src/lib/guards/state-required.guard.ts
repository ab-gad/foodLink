import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

/**
 * Available strategies when a route is accessed without required history state context.
 */
export type StateGuardFallbackStrategy = 'climbUp' | 'rootHome' | 'notFound';

/**
 * Interface definition for route data objects utilizing the StateRequiredGuard.
 */
export interface StateRequiredRouteData {
    /**
     * The specific key expected inside the history state object (e.g., 'title', 'charityId').
     * Defaults to 'title' if left unconfigured.
     */
    requiredStateKey?: string;

    /**
     * The recovery strategy applied if the required state key is missing.
     * Defaults to 'climbUp'.
     */
    fallbackStrategy?: StateGuardFallbackStrategy;

    /**
     * An explicit fallback route path array. If provided, this overrides 
     * the automated calculations of the strategies.
     */
    explicitFallbackUrl?: string[];
}

/**
 * A highly scalable, multi-app functional route guard that ensures a specific route 
 * can only be activated when an explicit routing state context payload is present 
 * inside the client history memory pipeline.
 * * This utility preserves native browser page reloads (F5) while gracefully blocking 
 * unauthorized direct deep-linking attempts (e.g., direct URL pasting into a new tab).
 * * @param route - The snapshot profile of the route attempting to be activated.
 * @param state - The real-time status representation of the router state tree.
 * @returns `true` if valid context state is discovered; otherwise drops a calculated `UrlTree` redirect target.
 * * @example
 * // Example 1: Zero-Config Auto Fallback (Climbs one level up the path directory tree)
 * // If accessed directly at '/charities/123', redirects the client back to '/charities'
 * {
 *  path: ':id',
 *  canActivate: [stateRequiredGuard],
 *  loadComponent: () => import('@foodlink/admin-feature').then(m => m.CharityProfileComponent)
 * }
 * * @example
 * // Example 2: Custom Key Validation with explicit Global 404 Error Routing
 * // Inspects history memory specifically for the 'driverMetrics' token key
 * {
 *  path: 'drivers/:driverId/performance',
 *  canActivate: [stateRequiredGuard],
 *  data: {
 *      requiredStateKey: 'driverMetrics',
 *      fallbackStrategy: 'notFound'
 *  } as StateRequiredRouteData,
 *  loadComponent: () => import('@foodlink/driver-feature').then(m => m.AnalyticsComponent)
 * }
 * * @example
 * // Example 3: Explicit Custom Rerouting Path Overrides
 * // Directs state-less dropouts away from path segments directly to a concrete custom URL sequence
 * {
 *  path: 'checkout/success',
 *  canActivate: [stateRequiredGuard],
 *  data: {
 *      requiredStateKey: 'receiptId',
 *      explicitFallbackUrl: ['/store', 'cart']
 *  } as StateRequiredRouteData,
 *  loadComponent: () => import('@foodlink/ordering-feature').then(m => m.ReceiptComponent)
 * }
 */
export const stateRequiredGuard: CanActivateFn = (route, state): boolean | UrlTree => {
    const router = inject(Router);

    // 1. Extract developer-configured metadata configurations from the route matrix
    const routeConfig = (route.data as StateRequiredRouteData) || {};
    const targetKey = routeConfig.requiredStateKey || 'title';
    const strategy = routeConfig.fallbackStrategy || 'rootHome';

    // 2. Validate contemporary transition states against persistent browser session history
    const currentNavigation = router.currentNavigation();
    const hasInternalState = !!currentNavigation?.extras.state?.[targetKey];
    const hasBrowserHistory = !!history.state?.[targetKey];

    // Pass validation if the navigation came from an application action click OR a page reload event
    if (hasInternalState || hasBrowserHistory) {
        return true;
    }

    // 3. Fallback Execution Pipeline (State context verification failed completely)
    if (routeConfig.explicitFallbackUrl) {
        return router.createUrlTree(routeConfig.explicitFallbackUrl);
    }

    switch (strategy) {
        case 'rootHome':
            return router.createUrlTree(['/']);

        case 'notFound':
            return router.createUrlTree(['/404']);

        case 'climbUp':
        default: {
            // Intelligently dissects the active browser URL string and drops the final element segment.
            // E.g., Transforms '/admin/charities/9821' into ['/admin', 'charities']
            const currentUrlSegments = state.url.split('/').filter(segment => !!segment);

            if (currentUrlSegments.length <= 1) {
                return router.createUrlTree(['/']);
            }

            // Mutate path layout arrays to strip out the trailing context ID identifier parameter
            currentUrlSegments.pop();
            return router.createUrlTree(['/', ...currentUrlSegments]);
        }
    }
};
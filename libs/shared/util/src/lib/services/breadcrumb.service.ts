import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface BreadcrumbItem {
    label: string;
    url: string;
}

@Injectable({
    providedIn: 'root',
})
export class BreadcrumbService {
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);

    public readonly breadcrumbs = signal<BreadcrumbItem[]>([]);

    constructor() {
        this.updateBreadcrumbs();
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => this.updateBreadcrumbs());
    }

    private updateBreadcrumbs(): void {
        this.breadcrumbs.set(this.buildBreadcrumbs(this.activatedRoute.root));
    }

    private buildBreadcrumbs(
        route: ActivatedRoute | null,
        currentUrl = '',
        breadcrumbs: BreadcrumbItem[] = []
    ): BreadcrumbItem[] {
        if (!route) return breadcrumbs;

        const routeURL: string = route.snapshot?.url.map((segment) => segment.path).join('/');

        if (routeURL !== '') {
            currentUrl += `/${routeURL}`;
        }

        let label: string | undefined = undefined;
        const isLeafNode = !route.firstChild;

        // 1. 🌟 ONLY check history.state if we have reached the final active leaf node
        if (isLeafNode) {
            label = history.state?.['title'];

            if (label && typeof label === 'string' && label.includes('|')) {
                label = label.split('|')[0].trim();
            }
        }

        // 2. For parent nodes, or if the leaf node didn't have a dynamic state title, use route configuration
        if (!label) {
            label = route.snapshot?.data['title'] ?? route.snapshot?.routeConfig?.title;
        }

        // 3. Push to breadcrumbs if a valid title configuration was found
        if (label && typeof label === 'string') {
            breadcrumbs.push({
                label,
                url: currentUrl || '/',
            });
        }

        return this.buildBreadcrumbs(route.firstChild, currentUrl, breadcrumbs);
    }
}
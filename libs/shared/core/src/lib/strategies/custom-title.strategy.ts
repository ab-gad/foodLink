import { Injectable, Injector, inject } from '@angular/core';
import { Router, TitleStrategy, RouterStateSnapshot, DefaultTitleStrategy } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class CustomTitleStrategy extends TitleStrategy {
    private readonly titleService = inject(Title);
    private readonly injector = inject(Injector);
    // private readonly router = inject(Router);
    private readonly defaultTitleStrategy = inject(DefaultTitleStrategy);

    override updateTitle(routerState: RouterStateSnapshot): void {
        const baseTitle = this.buildTitle(routerState);
        const navigation = this.injector.get(Router).currentNavigation();
        const stateTile: string | undefined = navigation?.extras.state?.['title'] ||
            history.state?.['title'];

        this.titleService.setTitle(
            stateTile || baseTitle || this.defaultTitleStrategy.title.getTitle(),
        );
    }
}
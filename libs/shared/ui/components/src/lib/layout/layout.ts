import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { AppSidebarInset } from './sidebar';
import { SiteHeader } from './site-header';
import { SidebarData } from '../models/sidebar-data';

@Component({
    selector: 'lib-shared-ui-layout',
    imports: [HlmSidebarImports, SiteHeader, AppSidebarInset],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'block',
    },
    template: `
		<lib-shared-ui-sidebar [data]="sidebarData()">
			<main hlmSidebarInset>
				<lib-shared-ui-site-header />
                <section class="p-4">
                    <ng-content></ng-content>
                </section>
			</main>
		</lib-shared-ui-sidebar>
	`,
})
export class SidebarInsetPage {
    public readonly sidebarData = input.required<SidebarData>();
}
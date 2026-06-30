import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCommand } from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { NavMain } from './nav-items-expandable';
import { NavProjects } from './nav-items-context';
import { NavSecondary } from './nav-secondary';
import { NavUser } from './nav-user';
import { SidebarData } from '../models/sidebar-data';

@Component({
	selector: 'lib-shared-ui-sidebar',
	imports: [HlmSidebarImports, NgIcon, NavMain, NavProjects, NavUser, NavSecondary],
	providers: [provideIcons({ lucideCommand })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div hlmSidebarWrapper>
			<hlm-sidebar variant="inset">
				<hlm-sidebar-header>
					<ul hlmSidebarMenu>
						<li hlmSidebarMenuItem>
							<a hlmSidebarMenuButton size="lg" routerLink="/">
								<div
									class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
								>
									<ng-icon name="lucideCommand" class="text-base" />
								</div>
								<div class="grid flex-1 text-left text-sm leading-tight">
									<span class="truncate font-medium">FoodLink</span>
									<span class="truncate text-xs">Enterprise</span>
								</div>
							</a>
						</li>
					</ul>
				</hlm-sidebar-header>

				<hlm-sidebar-content>
					@for (navGroup of data().navMain; track $index) {
						<lib-shared-ui-nav-items-expandable [items]="navGroup.groupItems" [groupTitle]="navGroup.groupName" />
					}
					@if(data().projects.length){
						<lib-shared-ui-nav-items-context [projects]="data().projects" />
					}
					<lib-shared-ui-nav-secondary class="mt-auto" [items]="data().navSecondary" />
				</hlm-sidebar-content>
				<hlm-sidebar-footer>
					<lib-shared-ui-nav-user [user]="data().user" />
				</hlm-sidebar-footer>
			</hlm-sidebar>
			<ng-content />
		</div>
	`,
})
export class AppSidebarInset {
	public readonly data = input.required<SidebarData>();
}
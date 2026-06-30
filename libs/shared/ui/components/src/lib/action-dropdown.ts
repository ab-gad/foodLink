import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

import {
    type CellContext,
    injectFlexRenderContext,
} from '@tanstack/angular-table';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'lib-shared-action-dropdown',
    imports: [HlmButtonImports, NgIcon, HlmDropdownMenuImports],
    providers: [provideIcons({ lucideEllipsis })],
    template: `
		<button hlmBtn variant="ghost" class="h-8 w-8 p-0" [hlmDropdownMenuTrigger]="ActionDropDownMenu">
			<span class="sr-only">Open menu</span>
			<ng-icon name="lucideEllipsis" />
		</button>

		<ng-template #ActionDropDownMenu>
			<hlm-dropdown-menu>
                @if (title()) {
                    <hlm-dropdown-menu-label>{{ title() }}</hlm-dropdown-menu-label>
                    <hlm-dropdown-menu-separator />
                }
                @for (action of actions(); track action.id) {
				<button
                    hlmDropdownMenuItem
                    [hidden]="action.hideFn && action.hideFn(contextInstance())"
                    [disabled]="action.disableFn && action.disableFn(contextInstance())"
                    (click)="action.clickFn(contextInstance())">
                        @if (action.icon) {
                            <ng-icon [name]="action.icon" />
                        }
                        <span>
                            {{action.label}}
                        </span>
                </button>

                }
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class ActionDropdown<T> {
    private readonly _context =
        injectFlexRenderContext<CellContext<T, unknown>>();

    // created it as an input signal to trigger a rerender and re-evaluation for the hide and disable functions whenever a row is updated
    contextInstance = input<T>(this._context.row.original);

    title = input<string>();
    actions = input<{
        label: string;
        id: number | string;
        icon?: string;
        hideFn?: (context: T) => boolean;
        disableFn?: (context: T) => boolean;
        clickFn: (context: T) => void;
    }[]>();
}

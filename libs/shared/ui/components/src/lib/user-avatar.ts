import {
    ChangeDetectionStrategy,
    Component,
    input,
} from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowUpDown } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

@Component({
    selector: 'lib-shared-user-avatar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HlmAvatarImports],
    providers: [provideIcons({ lucideArrowUpDown })],
    template: `
        <hlm-avatar class="rounded-lg">
        <img [src]="image()" [alt]="fallbackText()" hlmAvatarImage />
        <span class="rounded-lg bg-[#FD005B] text-white" hlmAvatarFallback>{{
            fallbackText().charAt(0).toUpperCase()
        }}</span>
        </hlm-avatar>
    `,
})
export class UserAvatar {
    image = input<string | null>();
    fallbackText = input.required<string>();
}

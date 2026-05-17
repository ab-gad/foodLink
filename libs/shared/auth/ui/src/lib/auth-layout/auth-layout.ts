import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGalleryVerticalEnd } from '@ng-icons/lucide';

@Component({
  selector: 'lib-auth-ui-auth-layout',
  imports: [NgIcon],
  providers: [provideIcons({ lucideGalleryVerticalEnd })],

  templateUrl: './auth-layout.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayout {

}

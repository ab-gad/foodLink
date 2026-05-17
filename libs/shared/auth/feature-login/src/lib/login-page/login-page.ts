import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService, LoginRequest } from '@foodlink/shared-auth-data-access';
import { LoginForm, AuthLayout } from "@foodlink/shared-auth-ui";


@Component({
  selector: 'lib-auth-login-page',
  imports: [LoginForm, AuthLayout],
  templateUrl: './login-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  protected readonly authService = inject(AuthService);

  protected onLoginRequest(credentials: LoginRequest): void {
    this.authService.loginMutation.mutate(credentials);
  }
}

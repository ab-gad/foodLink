import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '@foodlink/shared-auth-data-access';
import { LoginForm, AuthLayout } from "@foodlink/shared-auth-ui";
import { LoginRequest } from '@foodlink/shared-auth-util'
import { injectMutation } from '@tanstack/angular-query-experimental';

@Component({
  selector: 'lib-auth-login-page',
  imports: [LoginForm, AuthLayout],
  templateUrl: './login-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  protected readonly authService = inject(AuthService);
  protected loginMutation = injectMutation(() => this.authService.loginMutationOptions());
  protected onLoginRequest(credentials: LoginRequest): void {
    this.loginMutation.mutate(credentials);
  }
}

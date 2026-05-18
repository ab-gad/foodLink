import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { LoginRequest } from '@foodlink/shared-auth-util';
@Component({
  selector: 'lib-auth-ui-login-form',
  imports: [ReactiveFormsModule, RouterLink, HlmFieldImports, HlmInputImports, HlmButtonImports],
  templateUrl: './login-form.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginForm {
  private readonly _fb = inject(FormBuilder);
  formSubmit = output<LoginRequest>();
  public form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  public login(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.getRawValue() as LoginRequest);
    }
  }
}

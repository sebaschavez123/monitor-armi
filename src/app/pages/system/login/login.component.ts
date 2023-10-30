import { Component } from '@angular/core'
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms'
import { AuthService } from 'src/app/services/auth.service'
import { countryConfig } from 'src/country-config/country-config'

@Component({
  selector: 'air-system-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: UntypedFormGroup;
  iconLogo: string;
  
  get loading() {
    return this.authService.loading;
  }

  constructor(private fb: UntypedFormBuilder, private authService: AuthService) {
    this.iconLogo = countryConfig.isColombia ? 'assets/images/logo-farmatodo-col.svg' : 'assets/images/logo-farmatodo-vzla.svg';
    this.form = fb.group({
      code: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required]],
    })
  }

  get code() {
    return this.form.controls.code
  }
  get password() {
    return this.form.controls.password
  }

  submitForm(): void {
    this.code.markAsDirty()
    this.code.updateValueAndValidity()
    this.password.markAsDirty()
    this.password.updateValueAndValidity()
    if (this.code.invalid || this.password.invalid) {
      return
    }
    this.authService.SignIn(this.code.value, this.password.value)
  }
}

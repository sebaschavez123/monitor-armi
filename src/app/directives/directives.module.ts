import { NgModule } from '@angular/core'

// Directives
import { InputMailDirective } from './inputMail.directive'
import { InputPhoneDirective } from './inputPhone.directive'
import { OnlyNumbersDirective } from './only-numbers.directive'

const DIRECTIVES = [
  InputMailDirective,
  InputPhoneDirective,
  OnlyNumbersDirective,
]

@NgModule({
  imports: [],
  declarations: [...DIRECTIVES],
  exports: [...DIRECTIVES],
})

export class DirectivesModule {}
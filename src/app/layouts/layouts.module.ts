import { NgModule } from '@angular/core'
import { SharedModule } from '../shared.module'
import { LayoutModule } from '../components/layout/layout.module'

import { LayoutAuthComponent } from './Auth/auth.component'
import { LayoutAppComponent } from './App/app.component'
import { LayoutPublicComponent } from './Public/public.component'
import { GeneralModule } from '../components/general/general.module';

const COMPONENTS = [LayoutAuthComponent, LayoutAppComponent, LayoutPublicComponent]

@NgModule({
  imports: [SharedModule, LayoutModule, GeneralModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class LayoutsModule {}

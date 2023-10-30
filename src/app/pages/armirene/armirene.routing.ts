import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LayoutsModule } from 'src/app/layouts/layouts.module'

import { AuthService } from '../../services/auth.service';
import { MessengerProfitsComponent } from './messenger-profits/messenger-profits.component';

const routes: Routes = [
  {
    path: 'messenger-profits',
    component: MessengerProfitsComponent,
    data: { breadcrumb: 'Armirene - Ganancias del Mensajero' }
  },
  
]

@NgModule({
  imports: [LayoutsModule, RouterModule.forChild(routes)],
  providers: [AuthService],
  exports: [RouterModule],
})
export class ArmireneRouterModule {}

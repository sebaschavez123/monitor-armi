import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LayoutsModule } from 'src/app/layouts/layouts.module'
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../components/layout/Guard/auth.guard';
import { IncentiveComponent } from './incentive.component';
import { Store2x2Component } from './stores2x1/stores2x1.component';
import { Store2x2FtdComponent } from './stores2x1Ftd/stores2x1ftd.component';

const routes: Routes = [
    {
        path: '',
        component: IncentiveComponent,
        data: { breadcrumb: 'Cupones Activos' },
        canActivate: [AuthGuard],
    },
    {
      path: '2x1-mu',
      component: Store2x2Component,
      data: { breadcrumb: 'Tiendas 2x1 (MU)' },
      canActivate: [AuthGuard]
    },
    {
      path: 'nx1-armi',
      component: Store2x2FtdComponent,
      data: { breadcrumb: 'Tiendas 2x1 (Apoyo FTD)' },
      canActivate: [AuthGuard]
    },
]

@NgModule({
  imports: [
    LayoutsModule,
    RouterModule.forChild(routes)
  ],
  providers: [AuthService],
  exports: [RouterModule],
})
export class IncentiveRouterModule {}
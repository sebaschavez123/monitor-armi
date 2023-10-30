import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LayoutsModule } from 'src/app/layouts/layouts.module'
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../components/layout/Guard/auth.guard';
import { CouponsListComponent } from './coupons-list/coupons-list.component';

const routes: Routes = [
    {
        path: '',
        component: CouponsListComponent,
        data: { breadcrumb: 'Cupones Activos' },
        canActivate: [AuthGuard],
    },
]

@NgModule({
  imports: [LayoutsModule, RouterModule.forChild(routes)],
  providers: [AuthService],
  exports: [RouterModule],
})
export class CouponsRouterModule {}
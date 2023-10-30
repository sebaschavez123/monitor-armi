import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LayoutsModule } from 'src/app/layouts/layouts.module'
import { AuthService } from '../../services/auth.service';
import { ScanGoGuard } from '../../components/layout/Guard/scan-go.guard';
import { ScanGoComponent } from './scan-go.component';
import { PurchasesProcessComponent } from './purchases-process/purchases-process.component';
import { ApprovedPurchasesComponent } from './approved-purchases/approved-purchases.component';
import { BlockedUsersComponent } from './blocked-users/blocked-users.component';
import { CancelPurchasesComponent } from './cancel-purchases/cancel-purchases.component';

const routes: Routes = [
    {
        path: '',
        data: { breadcrumb: 'Scan&Go'},
        component: ScanGoComponent,
        canActivate: [ScanGoGuard],
        children: [
          {
            path: 'process',
            component: PurchasesProcessComponent,
            data: { breadcrumb: 'Compras en proceso', menu_index: 1 },
            canActivate: [ScanGoGuard],
          },
          {
            path: 'approved',
            component: ApprovedPurchasesComponent,
            data: { breadcrumb: 'Compras aprobadas', menu_index: 2 },
            canActivate: [ScanGoGuard],
          },
          {
            path: 'canceled',
            component: CancelPurchasesComponent,
            data: { breadcrumb: 'Compras canceladas', menu_index: 3 },
            canActivate: [ScanGoGuard],
          },
          {
            path: 'blocked-users',
            component: BlockedUsersComponent,
            data: { breadcrumb: 'Usuarios Bloqueados', menu_index: 4 },
            canActivate: [ScanGoGuard],
          },
          { path: '', redirectTo: 'process', pathMatch: 'full' }
        ],
      },

]

@NgModule({
  imports: [LayoutsModule, RouterModule.forChild(routes)],
  providers: [AuthService],
  exports: [RouterModule],
})
export class ScanGoRouterModule {}

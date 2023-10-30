import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LayoutsModule } from 'src/app/layouts/layouts.module'
import { AuthGuard } from '../../components/layout/Guard/auth.guard';
import { AuthService } from '../../services/auth.service';
import { CustomerSearchComponent } from './customer-search/customer-search.component';
import { CustomerBlockedComponent } from './customer-blocked/customer-blocked.component';
import { CustomerRemovedComponent } from './customer-removed/customer-removed.component';

// search

const routes: Routes = [
    {
        path: 'search',
        component: CustomerSearchComponent,
        data: { breadcrumb: 'Buscar' },
        canActivate: [AuthGuard],
    },
    {
        path: 'removed',
        component: CustomerRemovedComponent,
        data: { breadcrumb: 'Eliminados' },
        canActivate: [AuthGuard],
    },
    {
        path: 'blocked',
        component: CustomerBlockedComponent,
        data: { breadcrumb: 'Bloqueados' },
        canActivate: [AuthGuard],
    },
]

@NgModule({
  imports: [LayoutsModule, RouterModule.forChild(routes)],
  providers: [AuthService],
  exports: [RouterModule],
})
export class CustomerRouterModule {}
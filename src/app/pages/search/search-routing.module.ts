import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LayoutsModule } from 'src/app/layouts/layouts.module'
import { AuthService } from '../../services/auth.service';
import { SearchOrdersComponent } from './search-orders/search-orders.component';
import { AuthGuard } from '../../components/layout/Guard/auth.guard';
import { SearchProvidersComponent } from './search-providers/search-providers.component';

// search

const routes: Routes = [
    {
        path: 'search-orders',
        component: SearchOrdersComponent,
        data: { breadcrumb: 'Buscardor de pedidos' },
        canActivate: [AuthGuard],
      },
      {
        path: 'search-providers',
        component: SearchProvidersComponent,
        data: { breadcrumb: 'Buscardor proveedores' },
        canActivate: [AuthGuard],
      },
]

@NgModule({
  imports: [LayoutsModule, RouterModule.forChild(routes)],
  providers: [AuthService],
  exports: [RouterModule],
})
export class SearchRouterModule {}
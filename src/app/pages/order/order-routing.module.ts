import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LayoutsModule } from 'src/app/layouts/layouts.module'
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../components/layout/Guard/auth.guard';
import { OrderViewComponent } from './order-view/order-view.component';

// search

const routes: Routes = [
    {
        path: 'view/:id',
        component: OrderViewComponent,
        data: { breadcrumb: 'Detalle de orden' },
        canActivate: [AuthGuard],
      },
]

@NgModule({
  imports: [LayoutsModule, RouterModule.forChild(routes)],
  providers: [AuthService],
  exports: [RouterModule],
})
export class OrderRouterModule {}
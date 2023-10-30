import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LayoutsModule } from 'src/app/layouts/layouts.module'
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../components/layout/Guard/auth.guard';
import { UtilsOptimalRouteComponent } from './utils-optimal-route/utils-optimal-route.component';
import { UtilsSendTrackingComponent } from './utils-send-tracking/utils-send-tracking.component';
import { UtilsActionsComponent } from './utils-actions/utils-actions.component';
import { UtilsCourierAssignmentComponent } from './utils-courier-assignment/utils-courier-assignment.component';
import { UtilsMarketPlaceComponent } from './utils-market-place/utils-market-place.component';
import { UtilsStoreHoursComponent } from './utils-store-hours/utils-store-hours.component';
import { UtilsMassiveActionsComponent } from './utils-massive-actions/utils-massive-actions.component';
import { UtilsStockComponent } from './utils-stock/utils-stock.component';
import { AuctioneerComponent } from './auctioneer/auctioneer.component';

const routes: Routes = [
    {
        path: 'actions',
        component: UtilsActionsComponent,
        data: { breadcrumb: 'Acciones' },
        canActivate: [AuthGuard],
    },
    {
      path: 'optimal-route',
      component: UtilsOptimalRouteComponent,
      data: { breadcrumb: 'Tiendas en ruta óptima' },
      canActivate: [AuthGuard],
  },
    {
      path: 'send-tracking',
      component: UtilsSendTrackingComponent,
      data: { breadcrumb: 'Envío de tracking' },
      canActivate: [AuthGuard],
    },
    {
      path: 'courier-assignment',
      component: UtilsCourierAssignmentComponent,
      data: { breadcrumb: 'Asignación de tiendas mensajería' },
      canActivate: [AuthGuard],
    },
    {
      path: 'market-place',
      component: UtilsMarketPlaceComponent,
      data: { breadcrumb: 'Inventario' },
      canActivate: [AuthGuard],
    },
    {
      path: 'massive-actions',
      component: UtilsMassiveActionsComponent,
      data: { breadcrumb: 'Acciones masivas' },
      canActivate: [AuthGuard],
    },
    // {
    //   path: 'reprogrammer',
    //   component: UtilsProgrammerComponent,
    //   data: { breadcrumb: 'Rerogramador de ordenes' },
    //   canActivate: [AuthGuard],
    // },
    {
      path: 'store-hours',
      component: UtilsStoreHoursComponent,
      data: { breadcrumb: 'Horario de tiendas' },
      canActivate: [AuthGuard],
    },
    {
      path: 'stock',
      component: UtilsStockComponent,
      data: { breadcrumb: 'Stock de productos' },
      canActivate: [AuthGuard],
    },
    {
      path: 'auctioneer',
      component: AuctioneerComponent,
      data: { breadcrumb: 'Subastador' },
      canActivate: [AuthGuard],
    },
    {
      path: 'messenger-providers',
      data: { breadcrumb: 'Proveedor de mensajeros' },
      loadChildren: () => import('src/app/pages/messenger-provider/messenger-provider.module').then(m => m.MessengerProviderModule),
      canActivate: [AuthGuard],
    }
]

@NgModule({
  imports: [LayoutsModule, RouterModule.forChild(routes)],
  providers: [AuthService],
  exports: [RouterModule],
})
export class UtilsRouterModule {}

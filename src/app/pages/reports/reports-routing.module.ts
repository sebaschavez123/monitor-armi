import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LayoutsModule } from 'src/app/layouts/layouts.module'
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../components/layout/Guard/auth.guard';
import { ReportAssingsComponent } from './report-assings/report-assings.component';
import { ReportOnDemandComponent } from './report-on-demand/report-on-demand.component';
import { ReportDeliveryComponent } from './report-delivery/report-delivery.component';
import { ReportStatisticsComponent } from './report-statistics/report-statistics.component';
import { ReportGluedComponent } from './report-glued/report-glued.component';
import { ReportBilledComponent } from './report-billed/report-billed.component';
import { ReportCashierDetailComponent } from './report-cashier-detail/report-cashier-detail.component';
import { ReportPlatformsComponent } from './report-platforms/report-platforms.component';
import { ReportNoExpressComponent } from './report-no-express/report-no-express.component';
import { ReportMessengersComponent } from './report-messengers/report-messengers.component';
import { ReportOrdersCorruptedComponent } from './report-orders-corrupted/report-orders-corrupted.component';
import { RreportCanceledOrdersComponent } from './report-canceled-orders/report-canceled-orders.component';
import { ReportSmsComponent } from './report-sms/report-sms.component';
import { ReportAmplitudeComponent } from './report-amplitude/report-amplitude.component';
import { ReportObservationsComponent } from './report-observations/report-observations.component';
import { ReportsCanceledWithoutStockComponent } from './report-canceled-without-stock/report-canceled-without-stock.component';
import { ReportIncentivesComponent } from './report-incentives/report-incentives.component';
import { ReportCallAwareComponent } from './report-call-aware/report-call-aware.component';
import { MessengerRatingComponent } from './report-messenger-rating/report-messenger-rating.component';
import { ReportReturnSuccessComponent } from './report-return-success/report-return-success.component';
import { ReportRefundComponent } from './report-refund/report-refund.component';
// search

const routes: Routes = [
    // {
    //     path: 'assings',
    //     component: ReportAssingsComponent,
    //     data: { breadcrumb: 'Asiganados' },
    //     canActivate: [AuthGuard],
    // },
    // {
    //     path: 'on-demand',
    //     component: ReportOnDemandComponent,
    //     data: { breadcrumb: 'Bajo demanda' },
    //     canActivate: [AuthGuard],
    // },
    {
        path: 'delivery',
        component: ReportDeliveryComponent,
        data: { breadcrumb: 'Domicilios' },
        canActivate: [AuthGuard],
    },
    {
        path: 'observations',
        component: ReportObservationsComponent,
        data: { breadcrumb: 'Observaciones' },
        canActivate: [AuthGuard],
    },
    {
        path: 'canceled-without-stock',
        component: ReportsCanceledWithoutStockComponent,
        data: { breadcrumb: 'Cancelados sin stock' },
        canActivate: [AuthGuard],
    },
    {
        path: 'statistics',
        component: ReportStatisticsComponent,
        data: { breadcrumb: 'Estadisticas' },
        canActivate: [AuthGuard],
    },
    {
        path: 'glued',
        component: ReportGluedComponent,
        data: { breadcrumb: 'Encolados' },
        canActivate: [AuthGuard],
    },
    // {
    //     path: 'billed',
    //     component: ReportBilledComponent,
    //     data: { breadcrumb: 'Facturados' },
    //     canActivate: [AuthGuard],
    // },
    {
        path: 'cashier-detail',
        component: ReportCashierDetailComponent,
        data: { breadcrumb: 'Detalle cajero' },
        canActivate: [AuthGuard],
    },
    {
        path: 'no-express',
        component: ReportNoExpressComponent,
        data: { breadcrumb: 'No Express' },
        canActivate: [AuthGuard],
    },
    // {
    //     path: 'platforms',
    //     component: ReportPlatformsComponent,
    //     data: { breadcrumb: 'Domicilios.com' },
    //     canActivate: [AuthGuard],
    // },
    {
        path: 'messengers',
        component: ReportMessengersComponent,
        data: { breadcrumb: 'Rendimiento de mensajeros' },
        canActivate: [AuthGuard],
    },
    {
        path: 'orders-corrupted',
        component: ReportOrdersCorruptedComponent,
        data: { breadcrumb: 'Finalización errada de pedidos' },
        canActivate: [AuthGuard],
    },
    {
        path: 'orders-canceled',
        component: RreportCanceledOrdersComponent,
        data: { breadcrumb: 'Pedidos cancelados' },
        canActivate: [AuthGuard],
    },
    {
        path: 'sms',
        component: ReportSmsComponent,
        data: { breadcrumb: 'Envío de SMS' },
        canActivate: [AuthGuard],
    },
    {
        path: 'amplitude',
        component: ReportAmplitudeComponent,
        data: { breadcrumb: 'Amplitude' },
        canActivate: [AuthGuard],
    },
    {
        path: 'incentives',
        component: ReportIncentivesComponent,
        data: { breadcrumb: 'Incentivos' },
        canActivate: [AuthGuard],
    },
    {
        path: 'gestion-agentes',
        component: ReportCallAwareComponent,
        data: { breadcrumb: 'Gestión Agentes' },
        canActivate: [AuthGuard],
    },
    {
        path: 'messenger-rating',
        component: MessengerRatingComponent,
        data: { breadcrumb: 'Calificación de mensajeros' },
    },
    {
        path: 'return-success',
        component: ReportReturnSuccessComponent,
        data: { breadcrumb: 'Devolución Exitosa' },
        canActivate: [AuthGuard],
    },
    {
      path: 'report-refund',
      component: ReportRefundComponent,
      data: { breadcrumb: 'Reembolsos exitosos' },
      canActivate: [AuthGuard],
  },
]

@NgModule({
  imports: [LayoutsModule, RouterModule.forChild(routes)],
  providers: [AuthService],
  exports: [RouterModule],
})
export class ReportsRouterModule {}

import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LayoutsModule } from 'src/app/layouts/layouts.module'

// dashboard
import { DashboardExpressComponent } from './dashboard-express.component';
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../components/layout/Guard/auth.guard';
import { DashboardProgrammedComponent } from './dashboard-programmed.component';
import { DashboardProviderComponent } from './dashboard-provider.component';
import { DashboardManagedComponent } from './dashboard-managed.component';
import { DashboardBilledComponent } from './dashboard-billed.component';
import { DashboardNatSendNowComponent } from './dashboard-nat-send-now.component';
import { DashboardSubscriptionComponent } from './dashboard-subscription.component';
import { DashboardMessengersComponent } from './dashboard-messengers.component';
import { DashboardCanceledComponent } from './dashboard-canceled/dashboard-canceled.component';
import { DashboardImcompleteComponent } from './dashboard-incomplete.component';
import { DashboardIssuedComponent } from './dashboard-issued.component';
import { DashboardRxComponent } from './dashboard-rx.component';
import { PaymentMethodChangeComponent } from './payment-method-change/payment-method-change.component';
import { DashboardAntifraudComponent } from './dashboard-antifraud.component';
import { DashboardSpecialsComponent } from './dashboard-specials.component';
import { DashboardTimeExceededComponent } from './dashboard-time-exceeded.component';
import { DashboardPagoMovilComponent } from './dashboard-pago-movil.component';
import { DashboardRealtimeExpressComponent } from './realtime/express.component';
import { DashboardFlashComponent } from './dashboard-flash.component';
import { DashboardPayuComponent } from './dashboard-payu.component';
import { DashboardVolumeWeightComponent } from './dashboard-volume-weight.component';
import { DashboardCallcenterComponent } from './dashboard-callcenter.component';
import { DashboardRefundComponent } from './dashboard-refund.component';
import { DashboardGreaterTenComponent } from './dashboard-greater-ten.component';
import { DashboardReturnSuccessComponent } from './dashboard-return-success.component';
import { DashboardChangeAddressComponent } from './dashboard-change-address.component';
import { DashboardNegativeRatingComponent } from './dashboard-negative-ratings.component';

const routes: Routes = [
  {
    path: 'realtime-express',
    component: DashboardRealtimeExpressComponent,
    data: { breadcrumb: 'Express - Realtime' },
    canActivate: [AuthGuard],
  },
  {
    path: 'express',
    component: DashboardExpressComponent,
    data: { breadcrumb: 'Express' },
    canActivate: [AuthGuard],
  },
  {
    path: 'negative-rating',
    component: DashboardNegativeRatingComponent ,
    data: { breadcrumb: 'Calificaciones negativas' },
    canActivate: [AuthGuard],
  },
  {
    path: 'programmed',
    component: DashboardProgrammedComponent,
    data: { breadcrumb: 'Programados' },
    canActivate: [AuthGuard],
  },
  {
    path: 'provider',
    component: DashboardProviderComponent,
    data: { breadcrumb: 'Provedores' },
    canActivate: [AuthGuard],
  },
  {
    path: 'managed',
    component: DashboardManagedComponent,
    data: { breadcrumb: 'Gestionados' },
    canActivate: [AuthGuard],
  },
  {
    path: 'billed',
    component: DashboardBilledComponent,
    data: { breadcrumb: 'Factrados' },
    canActivate: [AuthGuard],
  },
  {
    path: 'nat-send-now',
    component: DashboardNatSendNowComponent,
    data: { breadcrumb: 'Nacionales y Envíalo Ya' },
    canActivate: [AuthGuard],
  },
  {
    path: 'subscription',
    component: DashboardSubscriptionComponent,
    data: { breadcrumb: 'Subscribete y ahorra' },
    canActivate: [AuthGuard],
  },
  {
    path: 'messengers',
    component: DashboardMessengersComponent,
    data: { breadcrumb: 'Mensajeros y pedidos' },
    canActivate: [AuthGuard],
  },
  {
    path: 'canceled',
    component: DashboardCanceledComponent,
    data: { breadcrumb: 'Cancelados' },
    canActivate: [AuthGuard],
  },
  {
    path: 'incomplete',
    component: DashboardImcompleteComponent,
    data: { breadcrumb: 'Incompletos' },
    canActivate: [AuthGuard],
  },
  {
    path: 'issued',
    component: DashboardIssuedComponent,
    data: { breadcrumb: 'Emitidos' },
    canActivate: [AuthGuard],
  },
  {
    path: 'rx',
    component: DashboardRxComponent,
    data: { breadcrumb: 'Rx' },
    canActivate: [AuthGuard],
  }, 
  {
    path: 'antifraud',
    component: DashboardAntifraudComponent,
    data: { breadcrumb: 'Antifraude' },
    canActivate: [AuthGuard],
  }, 
  {
    path: 'specials',
    component: DashboardSpecialsComponent,
    data: { breadcrumb: 'Especiales' },
    canActivate: [AuthGuard],
  }, 
  {
    path: 'time-exceeded',
    component: DashboardTimeExceededComponent,
    data: { breadcrumb: 'Ordenes con tiempos excedidos' },
    canActivate: [AuthGuard],
  },
  {
    path: 'payment-change',
    component: PaymentMethodChangeComponent,
    data: { breadcrumb: 'Cambio de método de pago' },
    canActivate: [AuthGuard],
  }, 
  {
    path: 'pago-movil',
    component: DashboardPagoMovilComponent,
    data: { breadcrumb: 'Pago Movil' },
    canActivate: [AuthGuard],
  }, 
  {
    path: 'payment-change/:id',
    component: PaymentMethodChangeComponent,
    data: { breadcrumb: 'Cambio de método de pago' },
    canActivate: [AuthGuard],
  }, 
  {
    path: 'flash-orders',
    component: DashboardFlashComponent,
    data: { breadcrumb: 'Ordenes Flash' },
    canActivate: [AuthGuard],
  }, 
  {
    path: 'payu-orders',
    component: DashboardPayuComponent,
    data: { breadcrumb: 'Ordenes Pay-U sin Finalizar' },
    canActivate: [AuthGuard],
  }, 
  {
    path: 'peso-volumen',
    component: DashboardVolumeWeightComponent,
    data: { breadcrumb: 'Ordenes con posible demora.' },
    canActivate: [AuthGuard],
  }, 
  {
    path: 'callcenter',
    component: DashboardCallcenterComponent,
    data: { breadcrumb: 'Ordenes Callcenter.' },
    canActivate: [AuthGuard],
  },
  {
    path: 'refund',
    component: DashboardRefundComponent,
    data: { breadcrumb: 'Pedidos a reembolsar.' },
    canActivate: [AuthGuard],
  },
  {
    path: 'greater-ten',
    component: DashboardGreaterTenComponent,
    data: { breadcrumb: 'Mas de 10 minutos.' },
    canActivate: [AuthGuard],
  },
  {
    path: 'return-success',
    component: DashboardReturnSuccessComponent,
    data: { breadcrumb: 'Devolución exitosa.' },
    canActivate: [AuthGuard],
  },
  {
    path: 'change-address',
    component: DashboardChangeAddressComponent,
    data: { breadcrumb: 'Cambio dirección.' },
    canActivate: [AuthGuard],
  },
]

@NgModule({
  imports: [LayoutsModule, RouterModule.forChild(routes)],
  providers: [AuthService],
  exports: [RouterModule],
})
export class DashboardRouterModule {}

import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'
import { DashboardRouterModule } from './dashboard-routing.module'
import { NestableModule } from 'ngx-nestable'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartistModule } from 'ng-chartist'
import { GeneralModule } from '../../components/general/general.module';

// dashboards
import { DashboardExpressComponent } from './dashboard-express.component';
import { DashboardProgrammedComponent } from './dashboard-programmed.component'
import { DashboardProviderComponent } from './dashboard-provider.component'
import { DashboardManagedComponent } from './dashboard-managed.component'
import { DashboardBilledComponent } from './dashboard-billed.component'
import { DashboardNatSendNowComponent } from './dashboard-nat-send-now.component'
import { DashboardSubscriptionComponent } from './dashboard-subscription.component';
import { DashboardMessengersComponent } from './dashboard-messengers.component';
import { DashboardCanceledComponent } from './dashboard-canceled/dashboard-canceled.component';
import { DashboardCanceledExpressComponent } from './dashboard-canceled/dashboard-canceled-express.component';
import { DashboardCanceledNatSendNowComponent } from './dashboard-canceled/dashboard-canceled-nat-send-now.component';
import { DashboardCanceledProviderComponent } from './dashboard-canceled/dashboard-canceled-provider.component';
import { DashboardCanceledSubscriptionComponent } from './dashboard-canceled/dashboard-canceled-subscription.component';
import { DashboardImcompleteComponent } from './dashboard-incomplete.component';
import { DashboardIssuedComponent } from './dashboard-issued.component'
import { DashboardRxComponent } from './dashboard-rx.component';
import { PaymentMethodChangeComponent } from './payment-method-change/payment-method-change.component';
import { DashboardAntifraudComponent } from './dashboard-antifraud.component';
import { DashboardSpecialsComponent } from './dashboard-specials.component';
import { DashboardTimeExceededComponent } from './dashboard-time-exceeded.component';
import { DashboardPagoMovilComponent } from './dashboard-pago-movil.component';
import { DashboardRealtimeExpressComponent } from './realtime/express.component';
import { DashboardCanceledSagComponent } from './dashboard-canceled/dashboard-canceled-sag.component';
import { DashboardFlashComponent } from './dashboard-flash.component';
import { DashboardPayuComponent } from './dashboard-payu.component';
import { DashboardVolumeWeightComponent } from './dashboard-volume-weight.component';
import { DashboardCallcenterComponent } from './dashboard-callcenter.component';
import { DashboardRefundComponent } from './dashboard-refund.component';
import { DashboardGreaterTenComponent } from './dashboard-greater-ten.component';
import { DashboardReturnSuccessComponent } from './dashboard-return-success.component';
import { DashboardChangeAddressComponent } from './dashboard-change-address.component';
import { DashboardNegativeRatingComponent } from './dashboard-negative-ratings.component';

@NgModule({
  imports: [
    SharedModule,
    DashboardRouterModule,
    NestableModule,
    FormsModule,
    ReactiveFormsModule,
    ChartistModule,
    GeneralModule
  ],  
  providers: [],
  declarations: [
    DashboardExpressComponent,
    DashboardProgrammedComponent,
    DashboardProviderComponent,
    DashboardManagedComponent,
    DashboardBilledComponent,
    DashboardNatSendNowComponent,
    DashboardSubscriptionComponent,
    DashboardMessengersComponent,
    DashboardCanceledComponent,
    DashboardCanceledExpressComponent,
    DashboardCanceledNatSendNowComponent,
    DashboardCanceledProviderComponent,
    DashboardCanceledSubscriptionComponent,
    DashboardCanceledSagComponent,
    DashboardImcompleteComponent,
    DashboardIssuedComponent,
    DashboardRxComponent,
    PaymentMethodChangeComponent,
    DashboardAntifraudComponent,
    DashboardSpecialsComponent,
    DashboardTimeExceededComponent,
    DashboardPagoMovilComponent,
    DashboardRealtimeExpressComponent,
    DashboardFlashComponent,
    DashboardPayuComponent,
    DashboardVolumeWeightComponent,
    DashboardCallcenterComponent,
    DashboardRefundComponent,
    DashboardGreaterTenComponent,
    DashboardReturnSuccessComponent,
    DashboardChangeAddressComponent,
    DashboardNegativeRatingComponent 
  ],
})
export class DashboardModule {}

import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'
import { NestableModule } from 'ngx-nestable'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartistModule } from 'ng-chartist'
import { GeneralModule } from '../../components/general/general.module';
import { ReportsRouterModule } from './reports-routing.module';
import { ReportOnDemandComponent } from './report-on-demand/report-on-demand.component';
import { ReportAssingsComponent } from './report-assings/report-assings.component';
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
import { ReportAmplitudRegisterComponent } from './report-amplitude/report-amplitud-register/report-amplitud-register.component';
import { ReportObservationsComponent } from './report-observations/report-observations.component';
import { ReportsCanceledWithoutStockComponent } from './report-canceled-without-stock/report-canceled-without-stock.component';
import { ReportIncentivesComponent } from './report-incentives/report-incentives.component';
import { ReportCallAwareComponent } from './report-call-aware/report-call-aware.component';
import { MessengerRatingComponent } from './report-messenger-rating/report-messenger-rating.component';
import { MessengerRatingTableComponent } from './report-messenger-rating/messenger-rating-table/messenger-rating-table.component';
import { ReportReturnSuccessComponent } from './report-return-success/report-return-success.component';
import { ReportRefundComponent } from './report-refund/report-refund.component';
 

@NgModule({
  imports: [
    SharedModule,
    ReportsRouterModule,
    NestableModule,
    FormsModule,
    ChartistModule,
    GeneralModule,
    ReactiveFormsModule
  ],
  providers: [],
  declarations: [
    ReportOnDemandComponent,
    ReportAssingsComponent,
    ReportDeliveryComponent,
    ReportStatisticsComponent,
    ReportGluedComponent,
    ReportBilledComponent,
    ReportCashierDetailComponent,
    ReportPlatformsComponent,
    ReportNoExpressComponent,
    ReportMessengersComponent,
    ReportOrdersCorruptedComponent,
    RreportCanceledOrdersComponent,
    ReportSmsComponent,
    ReportObservationsComponent,
    ReportsCanceledWithoutStockComponent,
    ReportAmplitudeComponent,
    ReportAmplitudRegisterComponent,
    ReportIncentivesComponent,
    ReportCallAwareComponent,
    MessengerRatingComponent,
    MessengerRatingTableComponent,
    ReportReturnSuccessComponent,
    ReportRefundComponent
  ]
})
export class ReportsModule {}
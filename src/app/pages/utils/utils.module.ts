import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'
import { NestableModule } from 'ngx-nestable'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartistModule } from 'ng-chartist'
import { GeneralModule } from '../../components/general/general.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { UtilsRouterModule } from './utils-routing.module';
import { UtilsActionsComponent } from './utils-actions/utils-actions.component';
import { UtilsOptimalRouteComponent } from './utils-optimal-route/utils-optimal-route.component';
import { UtilsSendTrackingComponent } from './utils-send-tracking/utils-send-tracking.component';
import { UtilsCourierAssignmentComponent } from './utils-courier-assignment/utils-courier-assignment.component';
import { UtilsMarketPlaceComponent } from './utils-market-place/utils-market-place.component';
import { UtilsProgrammerComponent } from './utils-programmer/utils-programmer.component';
import { UtilsStoreHoursComponent } from './utils-store-hours/utils-store-hours.component';
import { EditComponent } from './utils-store-hours/edit/edit.component';
import { UtilsMassiveActionsComponent } from './utils-massive-actions/utils-massive-actions.component';
import { UtilsStockComponent } from './utils-stock/utils-stock.component';
import { AuctioneerComponent } from './auctioneer/auctioneer.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

const COMPONENTS = [
    UtilsActionsComponent,
    UtilsOptimalRouteComponent,
    UtilsSendTrackingComponent,
    UtilsCourierAssignmentComponent,
    UtilsMarketPlaceComponent,
    UtilsProgrammerComponent,
    UtilsStoreHoursComponent,
    EditComponent
]


@NgModule({
  imports: [
    SharedModule,
    UtilsRouterModule,
    NestableModule,
    FormsModule,
    ChartistModule,
    GeneralModule,
    ReactiveFormsModule,
    NzTableModule,
    DragDropModule,
    NzSwitchModule
  ],
  providers: [],
  declarations: [
    UtilsActionsComponent,
    UtilsOptimalRouteComponent,
    UtilsSendTrackingComponent,
    UtilsCourierAssignmentComponent,
    UtilsMarketPlaceComponent,
    UtilsProgrammerComponent,
    UtilsStoreHoursComponent,
    EditComponent,
    UtilsMassiveActionsComponent,
    UtilsStockComponent,
    AuctioneerComponent
  ]
})
export class UtilsModule {}

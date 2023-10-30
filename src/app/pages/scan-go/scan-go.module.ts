import { NgModule } from "@angular/core";
import { BlockedUsersComponent } from './blocked-users/blocked-users.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchasesProcessComponent } from './purchases-process/purchases-process.component';
import { ApprovedPurchasesComponent } from './approved-purchases/approved-purchases.component';
import { SettingsComponent } from './settings/settings.component';
import { RowUserComponent } from './blocked-users/row-user/row-user.component';
import { AngularResizedEventModule } from 'angular-resize-event';
import { SharedModule } from 'src/app/shared.module'
import { NestableModule } from 'ngx-nestable'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartistModule } from 'ng-chartist'
import { GeneralModule } from '../../components/general/general.module';
import { ScanGoRouterModule } from './scan-go-routing.module';
import { ScanGoComponent } from './scan-go.component';
import { CancelPurchasesComponent } from './cancel-purchases/cancel-purchases.component';

@NgModule({
  imports: [
    SharedModule,
    ScanGoRouterModule,
    NestableModule,
    FormsModule,
    ChartistModule,
    GeneralModule,
    ReactiveFormsModule,
    AngularResizedEventModule
  ],
  
  providers: [],
  declarations: [
    ScanGoComponent,
    BlockedUsersComponent,
    PurchaseComponent,
    RowUserComponent,
    PurchasesProcessComponent,
    ApprovedPurchasesComponent,
    CancelPurchasesComponent,
    SettingsComponent,
  ]
})
export class ScanGoModule {}
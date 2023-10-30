import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'
import { NestableModule } from 'ngx-nestable'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneralModule } from '../../components/general/general.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { IncentiveComponent } from './incentive.component';
import { IncentiveRouterModule } from './incentive-routing.module';
import { IncentiveFormComponent } from './incentive-form/incentive-form.component';
import { Store2x2Component } from './stores2x1/stores2x1.component';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { Store2x2FtdComponent } from './stores2x1Ftd/stores2x1ftd.component';

@NgModule({
  imports: [
    SharedModule,
    NestableModule,
    FormsModule,
    GeneralModule,
    ReactiveFormsModule,
    NzTableModule,
    NzTransferModule,
    IncentiveRouterModule
  ],
  declarations: [
    IncentiveComponent,
    Store2x2Component,
    Store2x2FtdComponent,
    IncentiveFormComponent
  ],
  exports: [IncentiveComponent]
})
export class IncentiveModule {}
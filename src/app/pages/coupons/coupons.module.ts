import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'
import { NestableModule } from 'ngx-nestable'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartistModule } from 'ng-chartist'
import { GeneralModule } from '../../components/general/general.module';
import { CouponsRouterModule } from './coupons-routing.module';
import { CouponsListComponent } from './coupons-list/coupons-list.component';
import { CouponsEditComponent } from './coupons-edit/coupons-edit.component';

// searchs 

const COMPONENTS = [
  CouponsListComponent,
  CouponsEditComponent
]


@NgModule({
  imports: [
    SharedModule,
    CouponsRouterModule,
    NestableModule,
    FormsModule,
    ChartistModule,
    GeneralModule,
    ReactiveFormsModule
  ],
  
  providers: [],
  declarations: [...COMPONENTS]
})
export class CouponsModule {}
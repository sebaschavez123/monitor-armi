import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'
import { NestableModule } from 'ngx-nestable'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartistModule } from 'ng-chartist'
import { CustomerRouterModule } from './customer-routing.module';
import { CustomerSearchComponent } from './customer-search/customer-search.component';
import { GeneralModule } from '../../components/general/general.module';
import { CustomerRemovedComponent } from './customer-removed/customer-removed.component';
import { CustomerBlockedComponent } from './customer-blocked/customer-blocked.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { CustomerTableComponent } from './customer-table/customer-table.component';
import { InputAddressesComponent } from './customer-edit/input-addresses/input-addresses.component';
import { InputCreditcard } from './customer-edit/input-creditcard/input-creditcard.component';

// searchs 


@NgModule({
  imports: [
    SharedModule,
    CustomerRouterModule,
    NestableModule,
    FormsModule,
    ChartistModule,
    GeneralModule,
    ReactiveFormsModule
  ],
  
  providers: [],
  declarations: [
    InputCreditcard,
    CustomerSearchComponent,
    CustomerRemovedComponent,
    CustomerBlockedComponent,
    CustomerEditComponent,
    CustomerTableComponent,
    InputAddressesComponent,
  ],
})
export class CustomerModule {}
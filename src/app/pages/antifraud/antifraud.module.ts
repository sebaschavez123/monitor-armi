import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'
import { NestableModule } from 'ngx-nestable'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartistModule } from 'ng-chartist'
import { GeneralModule } from '../../components/general/general.module';
import { AntifraudRouterModule } from './antifraud-routing.module';
import { AntifraudComponent } from './antifraud/antifraud.component';
import { InputSearchComponent } from './input-search/input-search-component';
import { CardBlockedComponent } from './card-blocked/card-blocked.component';
import { ProductBlockedComponent } from './product-blocked/product-blocked.component';

// searchs 

const COMPONENTS = [
    AntifraudComponent,
    InputSearchComponent,
    CardBlockedComponent,
    ProductBlockedComponent
]


@NgModule({
  imports: [
    SharedModule,
    AntifraudRouterModule,
    NestableModule,
    FormsModule,
    ChartistModule,
    GeneralModule,
    ReactiveFormsModule
  ],
  
  providers: [],
  declarations: [...COMPONENTS]
})
export class AntifraudModule {}
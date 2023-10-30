import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'
import { NestableModule } from 'ngx-nestable'
import { FormsModule } from '@angular/forms'
import { ChartistModule } from 'ng-chartist'
import { GeneralModule } from '../../components/general/general.module';
import { SearchRouterModule } from './search-routing.module';
import { SearchOrdersComponent } from './search-orders/search-orders.component';
import { SearchProvidersComponent } from './search-providers/search-providers.component'

// searchs 

const COMPONENTS = [
  SearchOrdersComponent,
  SearchProvidersComponent
]

@NgModule({
  imports: [
    SharedModule,
    SearchRouterModule,
    NestableModule,
    FormsModule,
    ChartistModule,
    GeneralModule
  ],
  
  providers: [],
  declarations: [...COMPONENTS],
})
export class SearchModule {}
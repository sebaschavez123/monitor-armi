import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'
import { NestableModule } from 'ngx-nestable'
import { FormsModule } from '@angular/forms'
import { ChartistModule } from 'ng-chartist'
import { GeneralModule } from '../../components/general/general.module';
import { OrderRouterModule } from './order-routing.module';
import { OrderViewComponent } from './order-view/order-view.component'

// searchs 

const COMPONENTS = [
    OrderViewComponent
]

@NgModule({
  imports: [
    SharedModule,
    OrderRouterModule,
    NestableModule,
    FormsModule,
    ChartistModule,
    GeneralModule
  ],
  
  providers: [],
  declarations: [...COMPONENTS],
})
export class OrderModule {}
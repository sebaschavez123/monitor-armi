import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'
import { NestableModule } from 'ngx-nestable'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartistModule } from 'ng-chartist'
import { GeneralModule } from '../../components/general/general.module';
import { ParamsRouterModule } from './params-routing.module';
import { ParamsComponent } from './params/params.component';

// searchs 

const COMPONENTS = [
    ParamsComponent
]


@NgModule({
  imports: [
    SharedModule,
    ParamsRouterModule,
    NestableModule,
    FormsModule,
    ChartistModule,
    GeneralModule,
    ReactiveFormsModule
  ],
  
  providers: [],
  declarations: [...COMPONENTS]
})
export class ParamsModule {}
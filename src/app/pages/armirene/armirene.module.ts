import { NgModule } from '@angular/core';
import { MessengerProfitsComponent } from './messenger-profits/messenger-profits.component';
import { LayoutModule } from 'src/app/components/layout/layout.module';
import { ArmireneRouterModule } from './armirene.routing';
import { SharedModule } from 'src/app/shared.module';
import { NestableModule } from 'ngx-nestable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzListModule } from 'ng-zorro-antd/list';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
    declarations: [
        MessengerProfitsComponent
    ],
    imports: [
        LayoutModule,
        SharedModule,
        ArmireneRouterModule,
        NestableModule,
        FormsModule,
        ReactiveFormsModule,
        NzListModule,
        PipesModule
    ],
    providers: [],
    exports: [],
})
export class ArmireneModule { }

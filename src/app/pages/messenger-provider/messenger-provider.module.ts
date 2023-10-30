import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { SharedModule } from 'src/app/shared.module'
import { NestableModule } from 'ngx-nestable'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartistModule } from 'ng-chartist'
import { GeneralModule } from '../../components/general/general.module';
// import { UserRouterModule } from './user-routing.module';
// import { UserListComponent } from './user-list/user-list.component';
// import { UserEditComponent } from './user-edit/user-edit.component';
// import { UserProfileComponent } from './user-profile/user-profile.component';
// import { UserMessengerListComponent } from './user-messenger-list/user-messenger-list.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { MessengerProvidesListComponent } from './messenger-provider-list/messenger-provider-list.component';
// searchs 

const routes: Routes = [
  { path: '', component: MessengerProvidesListComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    NestableModule,
    FormsModule,
    ChartistModule,
    GeneralModule,
    NzAlertModule,
    ReactiveFormsModule
  ],
  
  providers: [],
  declarations: [MessengerProvidesListComponent]
})
export class MessengerProviderModule {}
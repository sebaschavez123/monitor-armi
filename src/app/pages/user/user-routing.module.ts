import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LayoutsModule } from 'src/app/layouts/layouts.module'
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../components/layout/Guard/auth.guard';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserMessengerListComponent } from './user-messenger-list/user-messenger-list.component';

// search

const routes: Routes = [
    {
        path: 'list',
        component: UserListComponent,
        data: { breadcrumb: 'Usuarios registrados' },
        canActivate: [AuthGuard],
    },
    {
      path: 'messenger',
      component: UserMessengerListComponent,
      data: { breadcrumb: 'Mensajeros' },
      canActivate: [AuthGuard],
  },
    {
      path: 'profile/:id',
      component: UserProfileComponent,
      data: { breadcrumb: 'Perfil' },
      // canActivate: [AuthGuard],
    },
]

@NgModule({
  imports: [LayoutsModule, RouterModule.forChild(routes)],
  providers: [AuthService],
  exports: [RouterModule],
})
export class UserRouterModule {}
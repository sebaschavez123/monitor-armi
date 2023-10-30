import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LayoutsModule } from 'src/app/layouts/layouts.module'
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../components/layout/Guard/auth.guard';
import { ParamsComponent } from './params/params.component';
// search

const routes: Routes = [
    {
        path: '',
        component: ParamsComponent,
        data: { breadcrumb: 'Parametros' },
        canActivate: [AuthGuard],
    },
]

@NgModule({
  imports: [LayoutsModule, RouterModule.forChild(routes)],
  providers: [AuthService],
  exports: [RouterModule],
})
export class ParamsRouterModule {}
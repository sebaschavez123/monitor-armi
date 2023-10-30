import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppPreloader } from './app-routing-loader';
import { LayoutsModule } from './layouts/layouts.module';
import { NotFoundComponent } from './pages/404.component';
import { LayoutAppComponent } from './layouts/App/app.component';
import { SharedModule } from 'src/app/shared.module';
import { LayoutAuthComponent } from './layouts/Auth/auth.component';
import { AuthGuard } from './components/layout/Guard/auth.guard';
import { LoginGuard } from './components/layout/Guard/login.guard';
import { ArmiGuard } from './components/layout/Guard/armi.guard';

const COMPONENTS = [NotFoundComponent]

const routes: Routes = [
  {
    path: '',
    component: LayoutAppComponent,
    children: [
      {
        path: 'dashboard',
        data: { breadcrumb: 'Pedidos' },
        loadChildren: () => import('src/app/pages/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'search',
        data: { breadcrumb: 'Busqueda' },
        loadChildren: () => import('src/app/pages/search/search.module').then(m => m.SearchModule),
      },
      {
        path: 'order',
        data: { breadcrumb: 'Ordenes' },
        loadChildren: () => import('src/app/pages/order/order.module').then(m => m.OrderModule),
      },
      {
        path: 'user',
        data: { breadcrumb: 'Usuarios' },
        loadChildren: () => import('src/app/pages/user/user.module').then(m => m.UserModule),
      },
      {
        path: 'customer',
        data: { breadcrumb: 'Clientes' },
        loadChildren: () => import('src/app/pages/customer/customer.module').then(m => m.CustomerModule),
      },
      {
        path: 'utils',
        data: { breadcrumb: 'Utilidades' },
        loadChildren: () => import('src/app/pages/utils/utils.module').then(m => m.UtilsModule),
      },
      {
        path: 'params',
        data: { breadcrumb: 'Parametrizaciones' },
        loadChildren: () => import('src/app/pages/params/params.module').then(m => m.ParamsModule),
      },
      {
        path: 'coupons',
        data: { breadcrumb: 'Cupones' },
        loadChildren: () => import('src/app/pages/coupons/coupons.module').then(m => m.CouponsModule),
      },
      {
        path: 'scan-go',
        loadChildren: () => import('src/app/pages/scan-go/scan-go.module').then(m => m.ScanGoModule),
      },
      {
        path: 'antifraud',
        data: { breadcrumb: 'Antifraude' },
        loadChildren: () => import('src/app/pages/antifraud/antifraud.module').then(m => m.AntifraudModule),
      },
      {
        path: 'reports',
        data: { breadcrumb: 'Reportes' },
        loadChildren: () => import('src/app/pages/reports/reports.module').then(m => m.ReportsModule),
      },
      {
        path: 'incentives',
        data: { breadcrumb: 'Incentivos' },
        loadChildren: () => import('src/app/pages/incentive/incentive.module').then(m => m.IncentiveModule),
      },
      {
        path: 'armirene',
        data: { breadcrumb: 'Armirene' },
        loadChildren: () => import('src/app/pages/armirene/armirene.module').then(m => m.ArmireneModule),
        canLoad: [ArmiGuard],
      },
      
    ],
  },
  {
    path: 'system',
    component: LayoutAuthComponent,
    canActivate: [LoginGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/system/system.module').then(m => m.SystemModule),
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
    canActivate: [AuthGuard],
    data: { title: 'Not Found' },
  },
]

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      useHash: true,
      preloadingStrategy: AppPreloader,
    }),
    LayoutsModule,
  ],
  providers: [AppPreloader],
  declarations: [...COMPONENTS],
  exports: [RouterModule],
})



export class AppRoutingModule { }

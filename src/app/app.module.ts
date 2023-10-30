import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, isDevMode } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgProgressModule } from '@ngx-progressbar/core'
import { NgProgressRouterModule } from '@ngx-progressbar/router'
import { NgProgressHttpModule } from '@ngx-progressbar/http'
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth'
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/compat/firestore';
import { IconDefinition } from '@ant-design/icons-angular'
import * as AllIcons from '@ant-design/icons-angular/icons'
import { NZ_I18N, en_US as localeZorro } from 'ng-zorro-antd/i18n'
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './store/reducers';
import { StoreRouterConnectingModule, FullRouterStateSerializer } from '@ngrx/router-store';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { ToastrModule } from 'ngx-toastr';
import { registerLocaleData } from '@angular/common';
import localePy from '@angular/common/locales/es-PY';
import { environment } from '../environments/environment';
import { countryConfig } from 'src/country-config/country-config';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { ServiceWorkerModule } from '@angular/service-worker';



registerLocaleData(localePy, 'es');

const LOCALE_PROVIDERS = [
  { provide: LOCALE_ID, useValue: 'es' },
  { provide: NZ_I18N, useValue: localeZorro },
]

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition
}
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    StoreModule.forRoot(reducers,
      { metaReducers,
          runtimeChecks: {
              strictStateImmutability: false,
              strictActionImmutability: false,
          }
      }
  ),
    StoreRouterConnectingModule.forRoot({ serializer: FullRouterStateSerializer }),
    NgProgressModule.withConfig({
      thick: true,
      spinner: false,
      color: '#0190fe',
    }),
    NgProgressRouterModule,
    NgProgressHttpModule,
   AngularFireModule.initializeApp(countryConfig.firebaseConfig),
   AngularFireAuthModule,
   AngularFirestoreModule,
   AngularFireDatabaseModule,
   ToastrModule.forRoot({
    timeOut: 1000,
    positionClass: 'toast-bottom-right',
    preventDuplicates: true,
  }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    ...LOCALE_PROVIDERS,
    { provide: NZ_ICONS, useValue: icons },
    { provide: SETTINGS, useValue: {} },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    if(!isDevMode()) {
      console.warn('eliminado Logs');
      window.console.log = () => {};
      window.console.warn = () => {};
      window.console.info = () => {};
      window.console.groupCollapsed = () => {};
      window.console.groupEnd = () => {};
    } else {
      //console.clear()
      const style = 'color:green;font-weight:600;font-size:9pt';
      console.log(`%cModo Desarrollo [Activado]`, style);
    }
  }
}

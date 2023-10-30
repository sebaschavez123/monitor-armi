import { Component, HostListener } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { slideFadeinUp, slideFadeinRight, zoomFadein, fadein } from './router-animations'
import { MenuService } from '../../services/menu.service';
import { countryConfig } from 'src/country-config/country-config';
import { select, Store } from '@ngrx/store'
import { Observable } from 'rxjs';

import * as Reducers from 'src/app/store/reducers'

declare const zE: any;
declare const window: any;

@Component({
  selector: 'layout-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideFadeinUp, slideFadeinRight, zoomFadein, fadein],
})
export class LayoutAppComponent {
  settings$: Observable<any>
  menuLayoutType: string
  isContentNoMaxWidth: boolean
  isAppMaxWidth: boolean
  isGrayBackground: boolean
  isSquaredBorders: boolean
  isCardShadow: boolean
  isBorderless: boolean
  isTopbarFixed: boolean
  isGrayTopbar: boolean
  routerAnimation: string


  constructor(private store: Store<any>,public menuService: MenuService) {
    this.store.pipe(select(Reducers.getSettings)).subscribe(state => {
      this.menuLayoutType = state.menuLayoutType
      this.isContentNoMaxWidth = state.isContentNoMaxWidth
      this.isAppMaxWidth = state.isAppMaxWidth
      this.isGrayBackground = state.isGrayBackground
      this.isSquaredBorders = state.isSquaredBorders
      this.isCardShadow = state.isCardShadow
      this.isBorderless = state.isBorderless
      this.isTopbarFixed = state.isTopbarFixed
      this.isGrayTopbar = state.isGrayTopbar
      this.routerAnimation = state.routerAnimation
    });
    if(
      this.menuService.getLocalUser()?.rolUser === 'ADMINISTRADOR' 
      || this.menuService.getLocalUser()?.rolUser === 'AGENTE'
    ) this.load();
    window.zESettings = {
      webWidget: {
        chat: {
          enabled: false,
        },
        contactOptions: {
          enabled: true,
          chatLabelOnline: {'*': 'Habla con nosotros'},
          chatLabelOffline: {'*': 'Chat no disponible'},
          contactFormLabel: {'*': 'Sugerencias o Reclamaciones'},
        },
        launcher: {
          chatLabel: {
            '*': 'Soporte',
          },
          mobile: {
            labelVisible: true,
          },
        },
        offset: {
          horizontal: '0px',
          vertical: '0px',
          mobile: {
            horizontal: '0px',
            vertical: '50px',
          },
        },
        label: {
          'es-ES': 'Soporte',
        },
      }
    };
  }

  routeAnimation(outlet: RouterOutlet, animation: string) {
    if (animation === this.routerAnimation) {
      return outlet.isActivated && outlet.activatedRoute.routeConfig.path
    }
  }

  load(){
    return new Promise((resolve, reject) => {
      try {
        if (zE) {
          resolve(true);
        }
      } catch (e) {
        ((d, s) => {
          const z: any = (c) => { z._.push(c); };
          const $$: any = z.s = d.createElement(s);
          const e = d.getElementsByTagName(s)[0];
          z.set = (o) => { z.set._.push(o); };
          z._ = [];
          z.set._ = [];
          $$.async = !0;
          $$.defer = !0;
          $$.setAttribute('charset', 'utf-8');
          $$.src = 'https://static.zdassets.com/ekr/snippet.js?key=7fc23b6b-3eb8-407c-a9d5-54ae47f2368f';
          $$.id = 'ze-snippet';
          z.t = + new Date();
          $$.type = 'text/javascript';
          e.parentNode.insertBefore($$, e);
          setTimeout(() => { resolve(true); }, 500);

        })(document, 'script');
      }
    }).finally(()=>{
      if(zE && countryConfig.isVenezuela) {
        zE.livechat?.departments.filter('Farmacéutico');
      }
    });
  }
}

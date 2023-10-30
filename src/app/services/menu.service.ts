import { Injectable } from '@angular/core';
import { getMenuArmirene, getMenuColombia, getMenuVenezuela } from './menu.service.config'
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { SoundsService } from './sounds.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { countryConfig } from 'src/country-config/country-config';
import * as _ from 'lodash'

@Injectable({
  providedIn: 'root',
})
export class MenuService extends BaseService {

  menu:any;
  subTimeOutPending:any;
  activeSection = '';
  activeItem = ''
  urls = {
    getOrdersSummaryByType: `${this.gateway30}/getOrdersSummaryByType`,
    getOrdersEncoladas: `${this.gateway30Dashboard}/getOrdersEncoladas20`,
  }

  constructor(http:HttpClient,
              private soundsService:SoundsService,
              private router: Router,
              private msg: NzMessageService) {
    super(http);
    this.setMenu();
    this.ordersPending();
  }

  setMenu() {
    this.menu = this.getMenu();
  }

  getOrdersSummaryByType20(deliveryType, orderType){
    return this.post(this.urls.getOrdersSummaryByType, {deliveryType, orderType});
  }
  getOrdersEncoladas(){
    const endPoint = '/getOrdersEncoladas20';
    return this.get(this.gateway30Dashboard + endPoint);
  }

  isFullScreen():boolean{
    return this.activeItem === 'scan-go';
  }

  childrenRoute():string{
    const url = this.router.url
    if(url.indexOf('scan-go') !== -1) return 'scan-go';
    else return null;
  }

  getMenu(): any[] {
    let menu = [];
    if(this.modules) {
      const menuCountry = this.getMenuCountry();
      Object.keys(this.modules).forEach((module:string) => {
        const parts = module.split('/');
        if(parts.length === 1) {
          menu = menu.concat(menuCountry.filter(item => item.moduleName === parts[0]))
        }
        else{
          const item:any = menuCountry.filter(it => it.moduleName === parts[0])[0];
          const newItemMenu = Object.assign({}, item);
          newItemMenu.children = [];
          for (let i = 1; i < parts.length; i++) {
            const part = parts[i];
            newItemMenu.children = newItemMenu.children.concat(item.children.slice().filter(subItem => {
              return subItem.key === part;
            }));
          }
          menu = menu.concat(newItemMenu);
        }
        if(!countryConfig.isColombia) {
          menu = this.canUtilsMassiveActions(menuCountry);
        }
      });
    }
    return menu;
  }

  getMenuCountry() {
    if(countryConfig.isColombia) {
      return [
        ...getMenuColombia,
        ...(this.isArmiUser() ? getMenuArmirene : []) // solo usuarios armirene
      ];
    }
    else {
      return getMenuVenezuela
    }
  }

  canUtilsMassiveActions(menu: any[]) {
    if(this.getLocalUser().canChangeStoreSchedule == 0) {
      const idx = menu
        .map(m => m.key)
        .indexOf('utils');
      if(menu[idx]) {
        let children = [...menu[idx].children];
        menu[idx].children = children.filter( op => op.key != 'utilsCoueriersAssign' );
      }
      menu = menu.filter(m => m.key !== 'incentives');
    }
    return [...menu];
  }

  private ordersPending():void{
    this.subTimeOutPending = setInterval(() => {
     if(this.getLocalUser() && this.activeSection.indexOf('dashboard') !== -1){
      this.getOrdersEncoladas().subscribe((rta:any) => {
          if(rta.code === 'OK' && rta.data.message){
            this.soundsService.notification();
            this.msg.info('Pedidos encolados en domicilios');
          }
        });
     }
   },180000);
 }

  getItem(path) {
    let activeItem;
    const menuData = this.menu;
    const flattenItems = (items, key) =>
      items.reduce((flattenedItems, item) => {
        flattenedItems.push(item);
        if (Array.isArray(item[key])) {
          return flattenedItems.concat(flattenItems(item[key], key));
        }
        return flattenedItems;
      },[]);
    activeItem = _.find(flattenItems(menuData, 'children'), ['url', path]);
    return activeItem;
  }

}

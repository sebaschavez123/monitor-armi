import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from './dashboard.service';
import { User, ColumnData } from '../core/interfaces';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class MessengerProviderService extends BaseService {

  urls = {
    getMessengerProviders: `${this.gateway30}/getMessengerProviders`,
    setMessengerProviders: `${this.gateway30}/saveMessengerProvider`,
    updMessengerProviders: `${this.gateway30}/editMessengerProvider`,
  }

  constructor(http:HttpClient) { super(http); }
  
  getMessengerProviders() {
    return this.get(this.urls.getMessengerProviders);
  }
  setMessengerProviders(data) {
    let url = this.urls.setMessengerProviders;
    const params: any = { providerName: data.providerName, providerEmail: data.providerEmail };
    if(data.messengerProviderId > 0) {
      url = this.urls.updMessengerProviders;
      params.messengerProviderId = data.messengerProviderId;
    }
    return this.post(url, params);
  }

  getCols():Array<ColumnData>{
    return [
      {
        name: 'providerName',
        header: 'Nombre del proveedor',
        label: 'Proveedor',
        sortOrder: null,
        sortFn: (providerName: string, item: any) => item.providerName.indexOf(providerName) !== -1
      },
      /*{
        name: 'courierName',
        header: 'Courier',
        label: 'Courier',
        sortOrder: null,
        sortFn: (courierName: string, item: any) => item.courierName.indexOf(courierName) !== -1
      },*/
      {
        name: 'providerEmail',
        header: 'Correo electrónico',
        label: 'Email',
        sortOrder: null,
        sortFn: (providerEmail: string, item: any) => item.providerEmail.indexOf(providerEmail) !== -1
      },
      {
        name: 'createDate',
        header: 'Creado',
        label: 'Creado',
        key:'createDate',
        sortOrder: null,
        sortFn: (a: any, b: any) => String(a.storeName).localeCompare(String(b.storeName)),
      },
    ]
  }

}

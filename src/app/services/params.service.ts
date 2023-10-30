import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ParamsService extends BaseService {

  urls = {
    setDeliveryValueMessenger : `${this.gateway30}/setDeliveryValueMessenger`,
    getDeliveryValueMessenger : `${this.gateway30}/getDeliveryValueMessenger`,
    updateProperty : `${this.gateway30}/updateProperty/:key/:value`,
    logProperty: `${this.gateway30Reports}/managementLogs`,
    getProperty : `${this.gateway30}/getDeliveryProperty/:key`,
    setStoreHours: `${this.gateway30}/updateStoreTimeSchedule`,
    getStoreHours: `${this.gateway30}/getStoreTimeSchedule/:key`,
  }

  constructor(public http:HttpClient) {
    super(http);
  }


  setDeliveryValueMessenger(deliveryValue){ 
    return this.post(this.urls.setDeliveryValueMessenger, {deliveryValue});
  }

  getDeliveryValueMessenger(){
    return this.get(this.urls.getDeliveryValueMessenger);
  }

  getProperty(key){
    return this.get(this.urls.getProperty.replace(':key', key));
  }

  updateProperty(key, value){
    return this.get(this.urls.updateProperty.replace(':key', key).replace(':value', value));
  }

  logProperty(module, changes){
    return this.post(this.urls.logProperty,{module, changes, employeeNumber: this.getLocalUser()?.employeeNumber});
  }

  setStoreHours(storeId:string, startTime: string, endTime:string) {
    return this.put(this.urls.setStoreHours.replace(':key', storeId), {storeId, startTime, endTime});
  }

  getStoreHours(storeId:string) {
    return this.get(this.urls.getStoreHours.replace(':key', storeId));
  }


}
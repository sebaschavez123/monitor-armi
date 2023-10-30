import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService {

  urls = {
    getItemByBarcode: `${this.gateway}/itemMonitorEndpoint/getItemByBarcode`,
    getItemById: `${this.gateway}/itemMonitorEndpoint/getItemById`,
    itemsStock: `${this.gateway30}/getStockItems`,
    getReverseOrderStatus: `${this.gateway30}/getReverseOrderStatus`, 
    getRefundPaymentMobileStatus: `${this.gateway30}/getRefundPaymentMobileStatus`
  }

  constructor(http:HttpClient) {
    super(http)
  }

  getItemByBarcode(barcode:string, storeId:string){
    return this.post(this.urls.getItemByBarcode, {barcode, storeId});
  }

  getItemById(idItem:string, storeId:string){
    return this.post(this.urls.getItemById, {idItem,storeId});
  }

  getItemsStock(storeId:string, items:Number[], orderId?) {
    return (orderId) 
              ? this.post(this.urls.itemsStock, {storeId, items, orderId}) 
              : this.post(this.urls.itemsStock, {storeId, items})
  }

  getPaymentReference(orderId: string, order:string) {
   return  (order.toLowerCase()==="pago movil")?
            this.get(`${this.urls.getRefundPaymentMobileStatus}/${orderId}`): 
            this.get(`${this.urls.getReverseOrderStatus}/${orderId}`);
  }




}
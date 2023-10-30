import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderProcessedList, PartialStoreItemList, TransferList } from '../components/general/order-detail/transfer/models/transfer';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class TransferService extends BaseService {

  urls = {
    getOrderProcessedList: `${this.gateway30}/getOrderProcessedList`,
    getTransferList: `${this.gateway30}/getTransferList`,
    setTransferOrderFullStore: `${this.gateway30}/transferOrder/FullStore`,
    setTransferOrderPartialStore: `${this.gateway30}/transferOrder/PartialStore`,
  }

  constructor(http: HttpClient) {
    super(http)
  }

  getOrderProcessedList(orderId: number): Observable<OrderProcessedList> {
    return this.get(`${this.urls.getOrderProcessedList}/${orderId}`);
  }

  getTransferList(orderId: number, city: string, itemList: any): Observable<TransferList> {
    return this.post(`${this.urls.getTransferList}`, { orderId, city, itemList });
  }

  setTransferOrderFullStore(storeId: number, orderId: number): Observable<any> {
    return this.get(`${this.urls.setTransferOrderFullStore}/${storeId}/${orderId}`);
  }

  setTransferOrderPartialStore(storeId: number, orderId: number, itemList: PartialStoreItemList[]): Observable<any> {
    return this.post(`${this.urls.setTransferOrderPartialStore}/${storeId}`, { orderId, itemList });
  }
}

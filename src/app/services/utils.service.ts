import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { countryConfig } from 'src/country-config/country-config';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilsService extends BaseService {

  urls = {
    deleteMessByOrder : `${this.gateway30}/releaseOrderMessengerByOrderId/:id`,
    deleteMessByMessengerId : `${this.gateway30}/releaseOrderMessengerByMessengerId/:id`,
    upteStusMessenger : `${this.gateway30}/updateStatusMessenger/:mssId/:status`,
    updateProperty : `${this.gateway30}/updateProperty/:key/:value`,
    getProperty : `${this.gateway30}/getDeliveryProperty/:key`,
    isOrderTake : `${this.gateway30}/isOrderAssigned/:id`,
    addOrderCourierStatus : `${this.gateway30}/addOrderCourierStatus`,
    addCourierOrderMessHead : `${this.gateway30}/addCourierOrderMessengerHead`,
    getStoresWithOutCourier : `${this.gateway30}/getStoresWithOutCourier/:id`,
    getStoresByCourier : `${this.gateway30}/getStoresByCourier/:id`,
    updateStoresWithOutCourier : `${this.gateway30}/updateStoresWithOutCourier`,
    updateStock : 'https://us-central1-oracle-services-vzla.cloudfunctions.net/updateMarketPlace',
    updateStock2 : 'https://us-central1-stunning-base-164402.cloudfunctions.net/updateMarketPlace',
    storesOptimalRoute : `https://gateway-dot-stunning-base-164402.appspot.com/datafoundation/v3/store/optimalRoute/all`,
    updateStoresOptimalRoute : `https://gateway-dot-stunning-base-164402.appspot.com/datafoundation/v3/store/optimalRoute`,
    cartDelete: `${this.gatewaySB}/customerEndpoint/customer/deleteShoppingCart?idCustomer=:id&keyClient=12345&key=AIzaSyCZM3UTSYacMapk86ZaOWSk-e3mnG1gwfo`,
    cartDeleteAndCoupon: `${this.gatewaySB}/customerEndpoint/customer/deleteShoppingCartAndCoupon?idCustomer=:id&keyClient=12345&key=AIzaSyCZM3UTSYacMapk86ZaOWSk-e3mnG1gwfo`,
    releaseOrder: `${this.gateway30}/sendOrderReservation`,
    releaseOrderVzla: `https://soap-dot-stunning-base-164402.uc.r.appspot.com/oms/v3/order/:id/reservation`,
    deleteProducts: `${this.gateway}/itemMonitorEndpoint/deleteItemAloglia`,
    rescheduleMultiple: `${this.gateway30}/scheduleOrdersExpress`,
    launchMultiple: `${this.gateway30}/launchOrdersExpress`,
    storeHours: `${this.gateway30}/getStoreConfig/:id`,
    updateStoreHours: `${this.gateway30}/updateStoreConfig`,
    getStockByStore: `${this.gateway30}/getStockByStore/:id`,
  }

  keysSmsProperty = [
    'SMS_EXPRESS_CON_TRANSFERENCIAS',
    'SMS_EXPRESS_CON_KM_ALTO',
    'SMS_NATIONAL_CON_TRACKING',
    // 'SMS_ENVIALOYA_CON_TRACKING',
    'SMS_PROVEEDOR_CON_TRACKING'
  ];

  constructor(public http:HttpClient, private db : AngularFireDatabase) {
    super(http);
  }


  releaseOrderMessengerByOrderId(orderId){
    return this.delete(this.urls.deleteMessByOrder.replace(':id', orderId));
  }

  releaseOrderMessengerByMessengerId(employeeNumber){
    return this.delete(this.urls.deleteMessByMessengerId.replace(':id', employeeNumber));
  }

  releaseInFirebase(orderId: string) {
    this.db.database.app.database(this.dbTrackingUrl).ref(`/server/order/tracking/${orderId}/release`).set(true);
  }

  // get blockMessenger
  updateStatusMessenger(messengerId, status){
    return this.get(this.urls.upteStusMessenger.replace(':mssId', messengerId).replace(':status', status));
  }

  isOrderTake(orderId: string){
    return this.delete(this.urls.isOrderTake.replace(':id', orderId));
  }

  setStatusAssignedOrder(messengerIdByTake,orderId){
    return this.put(this.urls.addOrderCourierStatus, {orderId, employeeNumber: messengerIdByTake, statusId: 3});
  }

  setOrderMessenger(messengerIdByTake, orderId){
    return this.put(this.urls.addCourierOrderMessHead, {orderId, courierId: messengerIdByTake, statusId: 3});
  }

  soresOptimalRoute(){
    return this.get(this.urls.storesOptimalRoute);
  }

  updateOptimalRoute(idsEnable:Array<string>, idsDisable:Array<string>){
    return this.post(this.urls.updateStoresOptimalRoute, {stores: { enable: idsEnable, disable: idsDisable }});
  }

  getProperty(key){
    return this.get(this.urls.getProperty.replace(':key', key));
  }

  updateProperty(key, value){
    return this.get(this.urls.updateProperty.replace(':key', key).replace(':value', value));
  }

  cartDelete(idCustomer:string){
    return this.get(this.urls.cartDelete.replace(':id', idCustomer));
  }
  
  cartDeleteAndCoupon(idCustomer:string){
    return this.get(this.urls.cartDeleteAndCoupon.replace(':id', idCustomer));
  }

  releaseOrder(orderId:string){
    return this.post(this.urls.releaseOrder, {orderId, employeeNumber:  this.getLocalUser().employeeNumber});
  }

  getStoresWithOutCourier(idCourier:string){
    return this.get(this.urls.getStoresWithOutCourier.replace(':id', idCourier));
  }

  getStoresByCourier(idCourier:string){
    return this.get(this.urls.getStoresByCourier.replace(':id', idCourier));
  }

  getStoreConfig(idStore:string){
    return this.get(this.urls.storeHours.replace(':id', idStore));
  }

  updateStoreConfig(data:any){
    return this.post(this.urls.updateStoreHours, data);
  }

  updateStoresWithOutCourier(stores){
    return this.put(this.urls.updateStoresWithOutCourier, {stores});
  }

  
  getStockByStore(sku) {
    return this.get(this.urls.getStockByStore.replace(':id', sku));
  }

  scheduleMultiple(orderIdList: Array<any>) {
    const data = {
      rol: this.getLocalUser()?.rolUser,
      correoUsuario: this.getLocalUser()?.email,
      employeeNumber:  this.getLocalUser()?.employeeNumber,
      employeeName:  this.getLocalUser()?.employeeName,
      orderIdList
    };
    return this.post(this.urls.rescheduleMultiple, data);
  }

  launchMultiple(orderIdList: Array<any>) {
    const data = {
      rol: this.getLocalUser()?.rolUser,
      correoUsuario: this.getLocalUser()?.email,
      employeeNumber:  this.getLocalUser()?.employeeNumber,
      employeeName:  this.getLocalUser()?.employeeName,
      orderIdList
    };
    return this.post(this.urls.launchMultiple, data);
  }

  updateStock(array, form){
    const data : any = {
      newStock: form.value,
      updateInAllStores: form.allStores,
      items: array.map((item)=>{return item.id}),
      stores: form.allStores ? [] : array.map((item)=>{return Number(item.store)}),
    }
    if (countryConfig.isColombia) {
      data.updateInAlgolia = form.algolia;
      data.updateInOracle = form.oracle;
      data.useOrId = true;
    }
    return environment.isColombia ?  this.put(this.urls.updateStock2, data) : this.post(this.urls.updateStock, data);
  }

  deleteListProduct(items){
    return this.http.post(this.urls.deleteProducts, {items})
  }


}

import { Injectable, EventEmitter, NgZone } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { UtilsService } from './utils.service';
import { ColumnData } from '../core/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScanGoService extends BaseService {

    urls = {
        aproved : `${this.gateway30Dashboard}/getOrders20JSON/SCANANDGO`,
        getOneOrderAproved : `${this.gateway30}/getOrderScanAndGo/:id`,
        unaproved : `${this.gatewaySB}/orderEndpoint/deliveryOrdersScanAndGo`,
        unaproved_id : `${this.gateway}/orderMonitorEndpoint/getDeliveryOrdersScanAndGo?customerId=:id`,
        getPhoto : `https://gateway-dot-stunning-base-164402.uc.r.appspot.com/crm/v3/customer/:id/photos`,
        antifraud : `${this.gateway30}/getLockedData/:id`,
        usersblocked : `${this.gateway}/customerMonitorEndpoint/getBlockedUsers?key=AIzaSyCZM3UTSYacMapk86ZaOWSk-e3mnG1gwfo`,
        confirmOrder: `${this.gateway30}/confirmOrderScanAndGo`,
        updateInf: `${this.gateway30}/updateDashboardScanAndGo`,
        getIdsExistingOracle: `${this.gateway30}/getIdsExistingOracle`,
        orderValidate: `${this.gateway30}/validateInCheckPointScanAndGo`,
    }
    eventRefresh = new EventEmitter();
    eventCardSAG = new EventEmitter();
    private storeId = this.getLocalUser().storeId;
    get currentStoreRef() {
      if(this.getLocalUser()){
        return '/userStatus/store-id-'+ Object.assign(this.getLocalUser(), {}).storeId;
      }
      return '/userStatus/store-id-'+ this.storeId;
    }

    private oDb;

    settings = {
      purchase_score : [
        {
          key: 'SCAN_AND_GO_NUMBER_PURCHASE_SCORE_10',
          number: '10',
          value: ''
        },
        {
          key: 'SCAN_AND_GO_NUMBER_PURCHASE_SCORE_20',
          number: '20',
          value: ''
        },
        {
          key: 'SCAN_AND_GO_NUMBER_PURCHASE_SCORE_30',
          number: '30',
          value: ''
        },
        {
          key: 'SCAN_AND_GO_NUMBER_PURCHASE_SCORE_40',
          number: '40',
          value: ''
        },
        {
          key: 'SCAN_AND_GO_NUMBER_PURCHASE_SCORE_50',
          number: '50',
          value: ''
        },
        {
          key: 'SCAN_AND_GO_NUMBER_PURCHASE_SCORE_70',
          number: '70',
          value: ''
        },
        {
          key: 'SCAN_AND_GO_NUMBER_PURCHASE_SCORE_80',
          number: '80',
          value: ''
        },
        {
          key: 'SCAN_AND_GO_NUMBER_PURCHASE_SCORE_90',
          number: '90',
          value: ''
        },
        {
          key: 'SCAN_AND_GO_NUMBER_PURCHASE_SCORE_100',
          number: '100',
          value: ''
        },
      ],
      time : {
        key: 'SCAN_AND_GO_TIME_WAIT',
        title: 'Tiempo de visualización de usuarios (minutos)',
        value: '5'
      },
      params : [
        {
          key: 'SCAN_AND_GO_SCORE_DEFAULT',
          title: 'Puntaje por defecto',
          value: ''
        },
        {
          key: 'SCAN_AND_GO_MIN_PURCHASE_VALUE_CHECK',
          title: 'Valor mínimo de compra para revisión',
          value: ''
        },
        {
          key: 'SCAN_AND_GO_MIN_QUANTITY_ITEM_CHECK',
          title: 'Cantidad de productos mínima para revisión',
          value: ''
        },
        {
          key: 'SCAN_AND_GO_VALUE_ADD_SUCCESSFUL_CHECK',
          title: 'Suma de puntos',
          value: ''
        },
        {
          key: 'SCAN_AND_GO_VALUE_SUBSTRACT_FAILED_CHECK',
          title: 'Resta de puntos',
          value: ''
        },
      ]
    }


    constructor(http:HttpClient,
                private db: AngularFireDatabase,
                private zone: NgZone,
                private _uS:UtilsService) {
      super(http);
      // if(this.getLocalUser().rolUser === 'ADMINISTRADOR') this.initSettingData();
    }

    getAproved(){
      return this.get(this.urls.aproved);
    }

    getOneAproved(id:string){
      return this.post(this.urls.getOneOrderAproved.replace(':id', id), {});
    }

    getCustomerPhoto(id:string){
      return this.get(this.urls.getPhoto.replace(':id', id));
    }

    getCustomerAntifraud(id:string){
      return this.get(this.urls.antifraud.replace(':id', id));
    }

    getUnaproved(ids: Array<string>){
      return this.post(this.urls.unaproved, {customerIds: ids});
    }

    getOneUnaproved(id:string){
      return this.get(this.urls.unaproved_id.replace(':id', id));
    }

    getUsersBlocked(){
      return this.get(this.urls.usersblocked);
    }

    confirmOrder(orderId:number, customerId:number, irregular:boolean, photo:boolean){
      const body = {orderId, customerId, irregular, photo};
      return this.put(this.urls.confirmOrder, body);
    }

    updateIformation(){
      return this.get(this.urls.updateInf);
    }

    getTransactionOnline(store:string, eventType: firebase.default.database.EventType) {
      let listener;
      const ref = this.db.database.ref('/paymentSuccess/store-id-'+store);
      return new Observable<string>(observer => {
        listener = ref.on(eventType,(res:any)=>{
          this.zone.run(() => {
            observer.next(res);
          });
        });
        return {
          unsubscribe() {
            ref.off(eventType, listener);
          }
        };
      });
    }

    getEventPaymentProcessByStore() {
      return this.db.database.ref(this.currentStoreRef);
    }

    getPaymentProcessByStore(eventType: firebase.default.database.EventType): Observable<any> {
      let listener;
      const ref = this.db.database.ref(this.currentStoreRef);
      return new Observable<string>(observer => {
        listener = ref.on(eventType,(res:any)=>{
          this.zone.run(() => {
            observer.next(res);
          });
        });
        return {
          unsubscribe() {
            ref.off(eventType, listener);
          }
        };
      });
    }

    getPaymentActiveProcessByStore(): Observable<any> {
      let listener;
      const ref = this.db.database.ref(this.currentStoreRef).orderByChild('active').equalTo(true);
      return new Observable<string>(observer => {
        listener = ref.on('child_added',(res:any)=>{
          this.zone.run(() => {
            observer.next(res);
          });
        });
        return {
          unsubscribe() {
            ref.off('child_added', listener);
          }
        };
      });
    }

    getEventPaymentProcessByInput(id:string, input:string) {
      return this.db.database.ref(`${this.currentStoreRef}/${id}/${input}`);
    }

    getEventPaymentProcessById(id:string) {
      return this.db.object(`${this.currentStoreRef}/${id}`);
    }

    setAttribute(id:string, attribute:string, value:any){
      return this.db.object('/userStatus/store-id-'+this.getLocalUser().storeId+'/'+id+'/'+attribute).set(value);
    }

    setAttributes(id:string, object:any) {
      return this.db.object('/userStatus/store-id-'+this.getLocalUser().storeId+'/'+id).set(object);
    }

    getIdsExist(resDatastore:any){
      return this.post(this.urls.getIdsExistingOracle, resDatastore);
    }

    orderSAGValidate(idUser:string, listItems:Array<string>, valueDelivery){
      return this.post(this.urls.orderValidate, { idUser, listItems, valueDelivery, idStore: this.getLocalUser().storeId})
    }



    private initSettingData(){
      const promises = [];
      promises.push(this._uS.getProperty(this.settings.time.key).toPromise());
      this.settings.purchase_score.forEach(el => {
        promises.push(this._uS.getProperty(el.key).toPromise());
      });
      this.settings.params.forEach(el => {
        promises.push(this._uS.getProperty(el.key).toPromise());
      });
      Promise.all(promises).then((res:any)=>{
        this.settings.time.value = res[0].data.message;
        for (let i = 1; i < this.settings.purchase_score.length + this.settings.params.length + 1; i++) {
          if(i-1 < this.settings.purchase_score.length) this.settings.purchase_score[i-1].value = res[i].data.message;
          else this.settings.params[(i-1)-this.settings.purchase_score.length].value = res[i].data.message;
        }
      })
    }

    offEventsFirebase(){
      this.db.database.ref(this.currentStoreRef).off();
    }

    getColsBlocked():Array<ColumnData>{
      return [
        {
          name: 'id',
          header: 'Id',
          label: 'Id',
          sortOrder: null,
          sortFn: (a: any, b: any) => Number(a.id) - Number(b.id)
        },
        {
          name: 'name',
          header: 'Nombre y apellido',
          label: 'Nombre y apellido',
          sortOrder: null,
          sortFn: (firstName: string, item: any) => item.firstName.indexOf(firstName) !== -1
        },
        {
          name: 'documentNumber',
          header: 'Documento de documento',
          label: 'Cédula',
          sortOrder: null,
          sortFn: (a: any, b: any) => Number(a.documentNumber) - Number(b.documentNumber)
        },
        {
          name: 'comment',
          header: 'Comentarios',
          label: 'Comentarios',
          sortOrder: null,
          sortFn: (email: string, item: any) => item.email.indexOf(email) !== -1
        }
      ]

    }


}

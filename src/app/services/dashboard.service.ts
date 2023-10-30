import { BaseService } from './base.service';
import { Injectable, EventEmitter, NgZone} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { User } from '../core/interfaces';
import { countryConfig } from 'src/country-config/country-config';
import { Storage } from '../core/storage';
import * as _ from 'underscore';
import { Observable} from 'rxjs';
import {map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
  })

export class DashboardService extends BaseService {
    paymentsMethod = [];
    vehiclesType = [];
    statusTypes = [
        {label:'Emitida', value: 'EMITIDA', id: 1},
        {label:'Enviada', value: 'ENVIADA', id: 2},
        {label:'Asignada', value: 'ASIGNADA', id: 3},
        {label:'Picking', value: 'PICKING', id: 4},
        {label:'Facturada', value: 'FACTURADA', id: 5},
        {label:'Finalizada', value: 'FINALIZADA', id: 7},
        {label:'Cancelada', value: 'CANCELADA', id: 14},
    ];
    
    urls = {
        saveObs: `${this.gateway30Dashboard}/saveOrderObservation20`,
        getObs: `${this.gateway30Dashboard}/getOrderObservations20`,
        action: `${this.gateway30}/insertActionOrderMonitor`,
        insertWapp: `${this.gateway30Dashboard}/insertClickWhatsApp`,
        getBillingNumber: `${this.gateway30Dashboard}/getOrderTicketStore`,
        getOrderCoordinates: `${this.gateway30Dashboard}/getOrderCoordinates20`,
        getCloserStoreName: `${this.gateway30Dashboard}/getCloserStoreNameCustomerByOrderId/:id`,
        orders: `${this.gateway30Dashboard}/getOrdersJSON/:type`,
        curiers: `${this.gateway30}/getCouriers`,
        sendMailNoExpress: `${this.gateway}/orderMonitorEndpoint/sendMailNoExpress`,
        searchOrders: `${this.gateway30Reports}/${countryConfig.isColombia ? 'searchOrders' : 'searchOrders20'}`,
        ordersNoExpressReport: `${this.gateway30Reports}/getOrdersNoExpressReport`,
        searchOrdersId: `${this.gateway30Reports}/searchIdOrders20`,
        searchOrdersProvider: `${this.gateway30}/searchOrdersProvider`,
        searchOrdersNoExpress: `${this.gateway30Reports}/searchOrdersNoExpress`,
        detailNoExpress: `${this.gateway30Dashboard}/getOrderDetailNoExpress`,
        getDeliveryValueProvider: `${this.gateway30}/getDeliveryValueProvider/:id`,
        searchOrdersReports: `${this.gateway30Reports}/${countryConfig.isColombia ? 'searchOrdersReports20' : 'searchOrdersReport'}` ,
        getDetailNoExpressIncompleted: `${this.gateway30Dashboard}/getOrderDetailNoExpressIncompleted`,
        getOrdersMessengersAssigned: `${this.gateway30Dashboard}/getOrdersMessengersAssigned20`,
        getIdOrdersEmitidas: `${this.gateway30}/getIdOrdersEmitidas20`,
        searchIdOrdersReports: `${this.gateway30Reports}/searchIdOrdersReports20`,
        searchIdOrdersProviders: `${this.gateway30}/searchIdOrdersProviders`,
        reportWhitDetail: `${this.gateway30}/getDataOrderReportWhitDetail`,
        getOrdersSummaryByType: `${this.gateway30}/getOrdersSummaryByType`,
        banks: `${this.payments}/getBanks`,
        observationTacking: `${this.gateway30Dashboard}/getFullOrderTracking/`,
        getQueueCities: `${this.gateway30Dashboard}/getQueueCities/:type`,
        getQueueStores: `${this.gateway30Dashboard}/getQueueStores/:type`,
        getStatesAndMunicipalities: `${this.gateway30}/getStatesAndMunicipalities`,
        getBlockReasons: `${this.gateway30Reports}/getBlockMessengerReasson`,
        discardRefundOrder: `${this.gateway30}/discardRefundOrder/:orderId`,
        validateSuccessfulReturn: `${this.gateway30Dashboard}/validateSuccessfulReturn/:orderId/:status`,
        manageNegativeRating: `${this.gateway30}/manageNegativeRating`,
    }

    observationEvent: EventEmitter<{action:string, params:any}> = new EventEmitter();

    constructor(
      http:HttpClient, 
      private db : AngularFireDatabase,
      private zone: NgZone
    ){
      super(http);
      this.addFilters();
      this.getPaymentMethods();
      this.getVehiclesType();
    }

    addFilters() {
      if(countryConfig.isVenezuela) {
        this.statusTypes.push({label:'Reasignada Manual', value: 'REASIGNADA MANUAL', id: 23});
        this.statusTypes.push({label: 'En Camino', value: 'EN CAMINO', id: 32});
        this.statusTypes.push({label: 'Entregada', value: 'ENTREGADA', id: 6});
        this.statusTypes.push({label: 'Punto de entrega', value: 'EN PUNTO DE ENTREGA', id: 33});
        this.statusTypes.push({label: 'Captura BOUCHER', value: 'CAPTURA BOUCHER', id: 39});
        this.statusTypes.push({label: 'Escaneado Datafono', value: 'ESCANEANDO DATAFONO', id: 38});
        this.statusTypes.push({label: 'Devolución', value: 'DEVOLUCION', id: 48});
        this.statusTypes.push({label: 'Picking Terminado', value: 'PICKING TERMINADO', id: 37});
      }
    }
    getBlockReasons() {
      return this.get(this.urls.getBlockReasons);
    }

    getDashboardRealtime(type:string) {
      return this.db.database.app.database(this.dbMonitorUrl).ref(`/dashboards/${type}`);
    }

    getObsDashboardRealtime(type:string, eventType: firebase.default.database.EventType): Observable<string> {
      const ref = this.db.database.app.database(this.dbMonitorUrl).ref(`/dashboards/${type}`);
      let listener;
      return new Observable<string>(observer => {
        listener = ref.on(eventType,(res:any)=>{
          this.zone.run(() => {
            observer.next(res.val());
          });
        });
        return {
          unsubscribe() {
            ref.off(eventType, listener);
          }
        };
      });
    }

    getInfOpticalRoute(order:any){
      if (order.orderDelayed != null) {
        if (order.multiStore > 1 && order.orderDelayed === 'FALSE') return 'fa-plus';
        else if (order.orderDelayed === 'TRUE') return 'fa-minus';
      }
      else if (order.multiStore > 1) return 'fa-plus';
      else return '';
    }

    getPaymentMethod(order:any){
      if (order.paymentMethod === 'Transacciones en línea' || order.paymentMethod === 'Transacción en línea') return 'Trx en línea';
      else return order.paymentMethod;
    }

    orderByStatus(status:string):number {
      switch(status){
        case 'RECIBIDA':
          return 1;
        case 'EMITIDA':
          return 2;
        case 'ENVIADA':
          return 3;
        case 'ASIGNADA':
          return 4;
        case 'FACTURADA':
          return 5;
        case 'PICKING':
        default:
          return 6;
      }
    }

    getStatesAndMunicipalities() {
      return this.get(this.urls.getStatesAndMunicipalities);
    }

    getObservationTacking(orderId: string) {
      return this.get(this.urls.observationTacking + orderId)
      .pipe(map((o: any) => o.data));
    }

    guardarObservacion(data){
        return this.post(this.urls.saveObs, data);
    }

    insertClickWhatsApp(orderId:number){
        return this.post(this.urls.insertWapp, {orderId,employeeNumber: this.getLocalUser().employeeNumber});
    }

    getCloserStoreNameCustomerByOrderId(orderId:string){
        return this.get(this.urls.getCloserStoreName.replace(':id', orderId));
    }

    getOrderObservations(orderId){
        return this.post(this.urls.getObs, {orderId});
    }

    getTracking(orderId){
        return this.db.database.app.database(this.dbTrackingUrl).ref(`/server/order/tracking/${orderId}`);
    }

    getBillingNumber(orderId, deliveryType){
        return this.post(this.urls.getBillingNumber, {orderId,deliveryType});
    }

    getOrderCoordinates(orderId){
        return this.post(this.urls.getOrderCoordinates, {orderId});
    }

    postManageNegativeRating(data){
        return this.post(this.urls.manageNegativeRating, data);  
    }

    offEventsFirebase(){
        this.db.database.ref().off()
    }

    actionRead(orderId:string){
      this.put(this.urls.action, {orderId, action:'READ', employeeNumber:this.getLocalUser().employeeNumber}).subscribe(res=>{});
    }

    actionCancel(orderId:string){
      this.put(this.urls.action, {orderId, action:'CANCEL', employeeNumber:this.getLocalUser().employeeNumber}).subscribe(res=>{});
    }
    
    actionPhone(orderId: string){
      this.put(this.urls.action, {orderId, action:'CUSTOMER_PHONE', employeeNumber:this.getLocalUser().employeeNumber}).subscribe(res=>{});
    }

    actionWhatsapp(orderId: string){
      this.put(this.urls.action, {orderId, action:'OPEN_WHATSAPP', employeeNumber:this.getLocalUser().employeeNumber}).subscribe(res=>{});
    }

    actionToken(orderId:string){
      this.put(this.urls.action, {orderId, action:'READ_TOKEN', employeeNumber:this.getLocalUser().employeeNumber}).subscribe(res=>{});
    }

    actionCopyLink(orderId:string){
      this.put(this.urls.action, {orderId, action:'COPY_LINK_ARMIRENE', employeeNumber:this.getLocalUser().employeeNumber}).subscribe(res=>{});
    }


    getOrders20JSON(orderType) {
      return this.get(this.urls.orders.replace(':type', orderType))
        .pipe(map(ord => this.transformOrders(ord)));
    }

    getQueueCities(orderType) {
      return this.get(this.urls.getQueueCities.replace(':type', orderType))
      .pipe(map( (d:any) => d.data));
    }

    getQueueStores(orderType) {
      return this.get(this.urls.getQueueStores.replace(':type', orderType))
      .pipe(map( (d:any) => d.data));
    }

    private transformOrders(resp: any) {
      const user: User = this.getLocalUser();
      let orders = resp.data.map(
        (order: any) => JSON.parse(order.JSON ? order.JSON : order.json)
      );
      if (user.storeId !== 0 || user.rolUser == 'OPERADOR') {
        const storesAllowed = !!user.listStoresId ? [user.storeId].concat(user.listStoresId) : [user.storeId];
        orders = orders.filter( (order: any) => !!_.find(storesAllowed, (stg: any) => order.storeId === String(stg)));        
      }
      return {...resp, data: orders}
    }

    getBanks() {
      return this.get(this.urls.banks);
    }

    sendMailNoExpress(order, orderGuide, courierId){
        const data = {
          orderId: order,
          orderGuide,
          courierId,
          employeeNumber: this.getLocalUser().employeeNumber
        };
        return this.post(this.urls.sendMailNoExpress, data);
    }

    searchOrders(orders){
      return this.post(this.urls.searchOrders, {employeeNumber: this.getLocalUser().employeeNumber, orders});
    }

    searchOrdersProvider(orders){
      const data = {orders, employeeNumber: this.getLocalUser().employeeNumber};
      return this.post(this.urls.searchOrdersProvider, data);
    }

    getDetailOrdersNoExpress(orderId: number){
      return this.post(this.urls.detailNoExpress, {orderId});
    }

    getDeliveryValueProvider(orderId){
      return this.get(this.urls.getDeliveryValueProvider.replace(':id', orderId));
    }

    getDetailNoExpressIncompleted(orderId: string){
      return this.post(this.urls.getDetailNoExpressIncompleted, {orderId});
    }

    getOrdersMessengersAssigned(){
      return this.post(this.urls.getOrdersMessengersAssigned, {employeeNumber: this.getLocalUser().employeeNumber});
    }

    getIdOrdersEmitidas(){
      return this.post(this.urls.getIdOrdersEmitidas, {employeeNumber: this.getLocalUser().employeeNumber});
    }

    getJsonOrderIds(init, arrayOrder, pagination){
      return arrayOrder.map(item => {return {orderId: item.orderId}}).slice(init, (init + pagination));
    }

    searchOrdersReportsImproved(jsonData){
      return this.post(this.urls.reportWhitDetail, jsonData);
    }

    searchIdOrders(startDate, endDate, filters: string[] = []){
      let params: any = {employeeNumber: this.getLocalUser().employeeNumber,startDate, endDate};
      if(filters?.length>0){
        params.filters = {
          orderStatus: filters.map( o => { return {"orderStatus": o} })
        }
      }
      return this.post(this.urls.searchOrdersId, params);
    }



    private getPaymentMethods(){
      const paymentsMethod = Storage.getAll('paymentsMethod2');
      if(paymentsMethod) {
        this.paymentsMethod = paymentsMethod;
        this.event.emit({type:'init-paymentsMethod', data: this.paymentsMethod});
        return;
      }
      this.get(this.gateway30 + '/getPaymentMethods').subscribe((res:any)=>{
          this.paymentsMethod = res.data;
          this.paymentsMethod.push({description: 'Trx en línea'});
          this.event.emit({type:'init-paymentsMethod', data: this.paymentsMethod});
          Storage.setAll('paymentsMethod2', this.paymentsMethod);
        })
    }

    private getVehiclesType(){
      const vehiclesType = Storage.getAll('vehiclesType2');
      if(vehiclesType) {
        this.vehiclesType = vehiclesType;
        this.event.emit({type:'init-vehicles-type', data: this.vehiclesType});
        return;
      }
      this.get(this.gateway30 + '/getVehiclesType').subscribe((res:any)=>{
        this.vehiclesType = res.data.map( item => {return {label: item.vehicleName, value: item.vehicleTypeId}});
        this.event.emit({type:'init-vehicles-type', data: this.vehiclesType});
        Storage.setAll('vehiclesType2', this.vehiclesType);
      })
    }

    getCols(){
      const columns:Array<any> = [
        {
          name: 'orderId',
          header: 'Número de Pedido',
          key: 'id',
          label: 'Pedido',
          sortFn: (a: any, b: any) => Number(a.orderId) - Number(b.orderId)
        },
        {
          name: 'createDate',
          header: 'Fecha de Creación',
          label: 'Fecha',
          key: 'createDate',
          sortOrder: null,
          sortFn: (a: any, b: any) => new Date(a.createDate) > new Date(b.createDate)
        },
        {
          name: 'totalMins',
          header: 'Tiempo',
          label: 'Tp',
          sortOrder: null,
          sortFn: (a: any, b: any) => Number(a.totalMins) - Number(b.totalMins)
        },
        {
          name: 'status',
          header: 'Estado',
          label: 'Estado',
          key: 'orderStatus',
          keyLocal: 'statusId',
          sortOrder: null,
          sortFn: (a: any, b: any) => String(a.status).localeCompare(String(b.status)),
          filterMultiple: true,
          listOfFilter: this.statusTypes.map(x=>{ return { text: x.label, value: x.value }}),
          filterFn: (status: string, item: any) => item.status.indexOf(status) !== -1
        },
        {
          name: 'pm',
          header: 'Método de Pago',
          label: 'MP',
          key: 'paymentMethodId',
          keyLocal: 'paymentMethods',
          sortOrder: null,
          sortFn: (a: any, b: any) => String(a.name).localeCompare(String(b.name)),
          filterMultiple: true,
          listOfFilter: this.paymentsMethod.map(x=>{ return { text: x.description, value: x.description }}),
          filterFn: (pm: string, item: any) => item.pm.indexOf(pm) !== -1
        },
        {
          name: 'realKm',
          header: 'KM',
          label: 'KM',
          sortFn: (a:any, b: any) => Number(a.realKm) - Number(b.realKm),
        },
        {
          name: 'storeName',
          header: 'Tienda',
          label: 'Tienda',
          key:'storeId',
          keyLocal: 'stores',
          sortOrder: null,
          sortFn: (a: any, b: any) => String(a.storeName).localeCompare(String(b.storeName)),
          filterMultiple: true,
          listOfFilter: this.stores.map(x=>{ return { text: x.name, value: x.name }}),
          filterFn: (storeName: string, item: any) => item.storeName.indexOf(storeName) !== -1
        },
        {
          name: 'city',
          header: 'Ciudad',
          label: 'Ciudad',
          key:'cityId',
          keyLocal: 'cities',
          sortOrder: null,
          sortFn: (a: any, b: any) => String(a.city).localeCompare(String(b.city)),
          filterMultiple: true,
          listOfFilter: this.cities.map(x=>{ return { text: x.name, value: x.name }}),
          filterFn: (city: string, item: any) => item.city.indexOf(city) !== -1
        },
        {
          name: 'courierName',
          header: 'Operador',
          label: 'Op',
          key:'courierId',
          keyLocal: 'couriers',
          sortOrder: null,
          sortFn: (a: any, b: any) => String(a.courierName).localeCompare(String(b.courierName)),
          filterMultiple: true,
          listOfFilter: this.couriers.map(x=>{ return { text: x.name, value: x.name }}),
          filterFn: (courierName: string, item: any) => item.courierName.indexOf(courierName) !== -1
        },
        {
          name: 'messenger',
          header: 'Domiciliario',
          label: 'Domiciliario',
          sortOrder: null,
          sortFn: (a: any, b: any) => String(a.messenger).localeCompare(String(b.messenger))
        },
        {
          name: 'customerName',
          header: 'Cliente',
          label: 'Cliente',
          sortOrder: null,
          sortFn: (a: any, b: any) => String(a.customerName).localeCompare(String(b.customerName))
        },
        {
          name: 'opticalRoute',
          header: 'Ruta Óptima',
          label: 'RO',
        },
        // {
        //   name: 'callCenterComments',
        //   header: 'Observaciones',
        //   label: 'Obs',
        //   textPos: 'rigth',
        //   sortOrder: null,
        //   sortFn: (a: any, b: any) => Number(a.callCenterComments) - Number(b.callCenterComments)
        // },
        {
          name: 'totalObservationsOrder',
          header: 'Observaciones',
          label: 'Obs',
          textPos: 'rigth',
          sortOrder: null,
          sortFn: (a: any, b: any) => Number(a.totalObservationsOrder) - Number(b.totalObservationsOrder)
        },
      ];
      columns.splice(4,0, {
        name: 'currentStatusTime',
        header: 'Tiempo del estado actual de la orden',
        label: 'TAO',
        textPos: 'rigth',
        sortOrder: null,
        sortFn: (a: any, b: any) => Number(a.currentStatusTime) - Number(b.currentStatusTime)
      });      
      if (countryConfig.isVenezuela) {
        columns.splice(6, 0, {
          name: 'messengerProvider',
          header: 'Proveedor',
          label: 'Pv',
          key:'courierId',
          keyLocal: 'couriers',
          sortOrder: null,
          sortFn: (a: any, b: any) => String(a.messengerProvider).localeCompare(String(b.messengerProvider)),
        });
      }

      return columns;
  }

  setfilters(filters: any[] | null, typeReport: string) {
    if(!!typeReport){
      Storage.setAll(`${typeReport}_filters`, filters)
    }
  }

  getfilters(typeReport: string) : any[] | null {
    return Storage.getAll(`${typeReport}_filters`) || [];
  }

  getPort(){
    return  Storage.getAll('portAgent');
  }
  
  discardRefundOrder(orderId) {
    return this.get(this.urls.discardRefundOrder.replace(':orderId', orderId));
  }

  validateSuccessfulReturn(orderId, status): Observable<any> {
    return this.get(this.urls.validateSuccessfulReturn?.replace(':orderId', orderId)?.replace(':status', status));
  }
}

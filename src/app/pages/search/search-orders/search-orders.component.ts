import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { OrderService } from '../../../services/order.service';
import { NzI18nService, es_ES } from 'ng-zorro-antd/i18n';
import * as moment from 'moment-mini-ts';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CustomerService } from '../../../services/customer.service';
import { countryConfig } from 'src/country-config/country-config';
@Component({
  selector: 'app-search-orders',
  templateUrl: './search-orders.component.html',
  styleUrls: ['./../search.component.scss']
})
export class SearchOrdersComponent implements OnInit, OnDestroy {

  lstOrders = []
  lstOrdersId = []
  dataExport:any
  dataExportDetail:any;
  dataSearch:any;
  upoladGuideConf:any;
  activeNumber = 1;
  dateRange:any = [];
  number = '';
  
  cols = [];
  valuesTable = {
    loading : false, 
    total: null, 
    paginate: 50, 
    pageIndex: 1, 
    filter: [], 
    orderBy: null, 
    orderByType: null
  }
  toast:any;
  subscription:Subscription;
  customer:any;
  openDetailSubscription = false;
  permissions;

  constructor(private _dS:DashboardService,
              private i18n: NzI18nService,
              private _oS:OrderService,
              private _cS:CustomerService,
              private toastr: ToastrService) {
                this.initMode();
                this.permissions = this._dS.getPermissions('search');
              }

  ngOnInit(): void {
    this.i18n.setLocale(es_ES);
    this.initConfOptions();
    this.initCols();
  }

  ngOnDestroy(): void {
    if(this.subscription) this.subscription.unsubscribe();
    if(this.toast) this.toast.toastRef.manualClose();
  }

  changeTab($event){
    this.activeNumber = $event.index + 1;
    this.number = '';
    this.dateRange = [];
    this.lstOrdersId = [];
  }

  validateSearch(){
    return (this.activeNumber === 1 && this.dateRange.length > 0) ||
    (this.activeNumber === 5 && this.dateRange.length > 0 && String(this.number).length > 0) ||
    (this.activeNumber !== 1 && String(this.number).length > 0);
  }

  changeValues(){
    this.dataSearch.req_list = this.getRequest();
  }

  search(valuesTable?:boolean){
    this.toast = this.toastr.info('Buscando ordenes...', null, {
      tapToDismiss: false,
      disableTimeOut: true
    });
    this.valuesTable.loading = true;
    if(this.activeNumber === 3){
      this.searchOrders([{orderId:this.number}])
      return;
    }
    this.subscription = this._dS.post(this._dS.urls.searchIdOrdersReports,this.getRequest())
      .subscribe({
        next: (rta:any) => {
          this.valuesTable.total = rta.data.length;
          this.lstOrdersId = rta.data;
          let orders = [];
          if(valuesTable) orders = this._dS.getJsonOrderIds(
            (this.valuesTable.pageIndex - 1) * this.valuesTable.paginate, this.lstOrdersId, this.valuesTable.paginate
            );
          else orders = this._dS.getJsonOrderIds(0, this.lstOrdersId, this.valuesTable.paginate);

          this.searchOrders(orders)
        },
        error: (error) => {
          this.valuesTable.loading = false;
          this.toast.toastRef.manualClose();
          this.toastr.error('Se produjo un error buscando ordenes', null)
        }
      }
    );
  }

  refresh(event){
    //console.log('refresh(event)', event);
    if(event?.type === 'page'){
      this.valuesTable.pageIndex = event.data.pageIndex;
      this.valuesTable.paginate = event.data.pageSize;
      this.valuesTable.filter = event.data.filter;
      if (event.data.sortField) {
        this.valuesTable.orderBy = event.data.sortField;
        this.valuesTable.orderByType = event.data.sortOrder === 'ascend' ? 'ASC' : 'DESC';
      } else {
        this.valuesTable.orderBy = null;
        this.valuesTable.orderByType = null;
      }
    }
    this.search(true);
  }

  searchSubscriptions(){
    this.customer = {};
    Promise.all([this._cS.getDiscountSAS(this.number).toPromise(),
      this._cS.getSubscriptions(Number(this.number)).toPromise()])
      .then((res:any)=>{
        if(res[0].code === 'OK'){
          // tslint:disable-next-line: radix
          const discountNumber = parseInt(((1 - parseFloat(res[0].data.addOneItemPercentage)) * 100).toString());
          this.customer.discount =  discountNumber + '%';
          if(res[1].code === 'OK') this.customer.subscriptions = res[1].data;
        }
      }).catch((error:any)=>{
        this.customer.subscriptions  = [];
      })
  }

  subscriptionDetails(subscription){
    this.openDetailSubscription = true;
    this.customer.lstProductsSubs = undefined;
    this._cS.getSubscriptionDetails(subscription.id, subscription.deliveryStore).subscribe((res:any)=>{
        this.customer.lstProductsSubs = res.data;
      },(error:any)=>{
        this.customer.lstProductsSubs = [];
      })
  }

  getTotalPriceSubscription(){
    let total = 0;
    if(this.customer.lstProductsSubs.length > 0){
      this.customer.lstProductsSubs.forEach(x => {
        total += (+x.fullPrice * +x.quantity);
      });
    }else{
      total = 0;
    }
    return this._dS.formatMoney(total, 0, '.', ',');
  }


  private searchOrders(orders){
    if(orders.length === 0){
      this.lstOrders = [];
      this.valuesTable.loading = false;
      this.toast.toastRef.manualClose();
      this.toastr.warning('No se encontraron ordenes', null)
      return;
    }
    this.lstOrders = [];
    this.valuesTable.loading = true;
    const req = {employeeNumber: this._dS.getLocalUser().employeeNumber, orders};
    this.subscription = this._dS.post(this._dS.urls.searchOrders, req ).subscribe((rta2:any) => {
      let lstOrders = rta2.data.map((x:any) =>{
          if (x.pickingHour == null) x.pickingHour = '';
          // tslint:disable-next-line: no-unused-expression
          x.pickingDate != null ? `${x.pickingDate} ${x.pickingHour}` : x.pickingDateTime = null;
          x.storeNameCity = '<u>'+ x.storeName + '</u> ' + x.city;
          x.messengerPhoneCountry = x.messengerPhone != null? '57'+x.messengerPhone : '';
          x.opticalRoute = this._dS.getInfOpticalRoute(x);
          x.pm = this._dS.getPaymentMethod(x);
          x.countObs = x.totalObservationsOrder ?
          // tslint:disable-next-line: radix
          !isNaN(parseFloat(x.totalObservationsOrder)) && isFinite(x.totalObservationsOrder) ? parseInt(x.totalObservationsOrder) : 0 : 0;
          return x;
        });
          if (this._dS.getLocalUser().rolUser === 'PICKER'){
            lstOrders = lstOrders.filter(x => x.storeId.trim() === String(this._dS.getLocalUser().storeId));
          }
        this.toast.toastRef.manualClose();
        if(this.lstOrders.length === 0) this.toastr.success(this.valuesTable.total + ' ordenes encontradas', null);
        this.lstOrders = lstOrders;
        // this.lstOrdersId = rta.data;
        this.valuesTable.loading = false;
  },
  error => {
    this.valuesTable.loading = false;
    this.toast.toastRef.manualClose();
    this.toastr.error('Se produjo un error buscando ordenes', null)
  })
  }

  private getRequest(){
    const req:any = {employeeNumber: this._dS.getLocalUser().employeeNumber};
    const filters:any = {}
    switch(this.activeNumber){
      case 1:
        req.startDate = moment(this.dateRange[0]).format('YYYY/MM/DD') + ' 00:00:00';
        req.endDate = moment(this.dateRange[1]).format('YYYY/MM/DD') + ' 23:59:59';
        this.valuesTable.paginate = 20;
        break;
      case 2:
        req.documentNumberClient = this.number;
        break;
      case 3:
        req.orderId = this.number;
        this.lstOrdersId = [{orderId: this.number}]
        break;
      case 4:
        req.messengerId = this.number;
        break;
      case 5:
        filters.orderGuide = this.number;
        break;
      case 6:
        req.startDate = moment(this.dateRange[0]).format('YYYY/MM/DD') + ' 00:00:00';
        req.endDate = moment(this.dateRange[1]).format('YYYY/MM/DD') + ' 23:59:59';
        req.agentId = this.number;
        break;
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.valuesTable.filter.length; i++) {
      const fl = this.valuesTable.filter[i];
      if (fl.keyLocal === 'statusId') fl.keyLocal = 'orderStatus';
      if(fl.value.length > 0)
        filters[fl.keyLocal] = fl.value.map(vl =>{return {[fl.key] : this.getDataFilter(fl.key, vl)};})
    }

    if(Object.keys(filters).length > 0) req.filters = filters;

    if(this.valuesTable.orderBy) {
      req.orderBy = this.valuesTable.orderBy;
      req.orderByType = this.valuesTable.orderByType;
    }

    return req;
  }

  private getDataFilter(key:string, value:string){
    if(key === 'storeId') return this._dS.stores.slice(0).filter(s=> s.name === value)[0].id;
    else if(key === 'courierId') return this._dS.providers.slice(0).filter(s=> s.label === value)[0].value;
    else if(key === 'paymentMethodId') return this._dS.paymentsMethod.slice(0).filter(s=> s.description === value)[0].id;
    else if(key === 'cityId') return this._dS.cities.slice(0).filter(s=> s.name === value)[0].city;
    else return value;
  }


  initMode(){
      this.upoladGuideConf = {
          urlSearch: this._dS.urls.searchOrdersReports,
          urlAdd: this._oS.urls.addOrderGuide,
          urlSendMail: this._dS.urls.sendMailNoExpress,
          urlFinalize: this._oS.urls.finish,
          linesUpload: 4,
          statusId: 25
      }
      this.dataSearch = {
        url: countryConfig.isColombia ? this._dS.urls.searchOrders : this._dS.urls.searchOrdersReports,
        url_detail: this._dS.urls.reportWhitDetail,
        url_list: this._dS.urls.searchIdOrdersReports,
        req_list: {},
        req: {employeeNumber: this._dS.getLocalUser().employeeNumber },
      }
    if(this.validateSearch() && this.lstOrdersId.length > 0) this.search();
  }

  private initCols(){
    this.cols = this._dS.getCols();
  }

  private initConfOptions(){
    this.dataExport = {
        object: this.getDataReportNormal(),
        modifications: [
            {
              field: 'dateOrderGuide',
              promise: async (x) => {
                const rta:any =  await this._dS.getDetailOrdersNoExpress(x.orderId).toPromise();
                if (rta.code === 'OK' && rta.data != null && rta.data.dateOrderGuide != null && rta.data.dateOrderGuide !== '')
                  return rta.data.dateOrderGuide
                else return '';
              }
            }
        ],
        nameReport: 'Ordenes_'
    }
    if (countryConfig.isColombia) {
      this.dataExportDetail = {
          extras: [],
          object: {
            'Número de Pedido': {field: 'orderId'},
            'Fecha de Creación': {field: 'createDate'},
            'Fecha de Entrega': {field: 'pickingDate'},
            'Fecha de actualización de guía': {detail: 'statusDate'},
            'Tipo de Orden': {field: 'deliveryType', func: (data)=>{ return data.deliveryType ? data.deliveryType : 'No registra'}},
            Estado: {field: 'status'},
            'Método de Pago': {field: 'paymentMethod'},
            Tienda: {field: 'storeName'},
            'Ciudad/Municipio': {field: 'city'},
            Operador: {field: 'courierName'},
            'Número de guía': {field: 'idTracking'},
            'Nombre del Cliente': {field: 'customerName'},
            'Cédula del Cliente': {field: 'customerDocument'},
            'Teléfono del Cliente': {field: 'customerPhone'},
            'Dirección del Cliente': {field: 'customerAddress'},
            Item: {field: 'itemId'},
            'Código de barras': {field: 'itemBarcode'},
            Descripción: {field: 'itemDescription'},
            Unidades: {field: 'quantity'},
            'Precio Unitario': {field: 'unitPrice'},
            Total: {field: 'totalPrice'},
            'Valor de domicilio': {field : 'deliveryValue'},
            'Observaciones totales de la orden' : {field : 'totalObservationsOrder'},
            Observations : {field : 'observations'},
            'Cancelada por' : {field : 'employeeName'},
            'Razón de cancelación' : {field : 'reason'},
            'Número de Factura' : {field : 'ticketNumber'},
            'Número Nota Crédito' : {field : 'creditNoteticketNumber'},
            'Kms' : {field : 'kmOrder'},
            'Número LifeMiles' : {field : 'lifeMiles'},
            'Estado Transacción PayU' : {field : 'transactionStatusPayU'},
            'Valor Transacción PayU' : {field : 'transactionValuePayU'},
            'Número de Pedido Proveedor Asociado' : {field : 'orderIdProvider'},
            'Usuario Canceló Orden': {field: 'orderCancellationUserName', func: (data)=>{ return data.orderCancellationUserName ? data.orderCancellationUserName : 'No registra'}},
            'Razón Transferencia': {field: 'transferReason', func: (data)=>{ return data.orderTransfersRelation.transferReason}},
            'Número de Traslados': {field: 'transferQuantity', func: (data)=>{ return data.orderTransfersRelation.transferQuantity}},
        },
          modifications: [],
          nameReport: 'OrdersDetalle'
      }
    }
    this.dataSearch = {
        url: countryConfig.isColombia ? this._dS.urls.searchOrders : this._dS.urls.searchOrdersReports,
        url_detail: this._dS.urls.reportWhitDetail,
        url_list: this._dS.urls.searchIdOrdersReports,
        req_list: {},
        req: {employeeNumber: this._dS.getLocalUser().employeeNumber }, 
    }
  }

  private getDataReportNormal() {
    if (countryConfig.isColombia) {
      return {
        'Número de Pedido': {field: 'orderId'},
        'Fecha de Creación': {field: 'createDate'},
        'Fecha de Entrega': {field: 'pickingDate'},
        'Tipo de Entrega': {field: 'deliveryType', func: (data)=>{ return data.deliveryType ? data.deliveryType : 'No registra'}},
        'Tiempo Transcurrido': {field: 'totalMins'},
        Estado: {field: 'status'},
        'Método de Pago': {field: 'paymentMethod'},
        Tienda: {field: 'storeName'},
        Operador: {field: 'courierName'},
        'Ciudad/Municipio': {field: 'city'},
        'Nombre del Cliente': {field: 'customerName'},
        'Cédula del Cliente': {field: 'customerDocument'},
        'Teléfono del Cliente': {field: 'customerPhone'},
        'Dirección del Cliente': {field: 'customerAddress'},
        'Nombre del Domiciliario': {field: 'messenger'},
        'Teléfono del Domiciliario': {field: 'messengerPhone'},
        'Número de guía': {field: 'idTracking'},
        'Kms' : {field : 'kmOrder'},
        'Id Tracking': {field: 'idTracking'},
        'Fecha de actualización de guía': {detail: 'dateOrderGuide'},
        // tslint:disable-next-line: radix
        'Ruta Óptima': {fun: (x)=>{ return parseInt(x.multiStore) > 1 ? 'SI' : 'NO'}},
        'Usuario Canceló Orden': {field: 'orderCancellationUserName', func: (data)=>{ return data.orderCancellationUserName ? data.orderCancellationUserName : 'No registra'}},
        'Razón Transferencia': {field: 'transferReason', func: (data)=>{ return data.orderTransfersRelation.transferReason}},
        'Número de Traslados': {field: 'transferQuantity', func: (data)=>{ return data.orderTransfersRelation.transferQuantity}},
      }
    } else {
      return {
        'Número de Pedido': {field: 'orderId'},
        'Fecha de Creación': {field: 'createDate'},
        'Fecha de Entrega': {field: 'pickingDate'},
        'Tiempo Transcurrido': {field: 'totalMins'},
        'Hora Toma Pedido': {field: 'assignmentHour'},
        'Hora Fac Caja': {field: 'invoiceHour'},
        'Hora Finalización Pedido': {field: 'finishedHour'},
        Estado: {field: 'status'},
        'Tipo de pedido': {field: 'tipoOrden'},
        'Método de Pago': {field: 'paymentMethod'},
        Tienda: {field: 'storeName'},
        'Ciudad/Municipio': {field: 'city'},
        'Valor therorico': {field: 'theoricalValue'},
        'Valor real': {field: 'realValue'},
        'Nombre del Cliente': {field: 'customerName'},
        'Cédula del Cliente': {field: 'customerDocument'},
        'Teléfono del Cliente': {fun: (x)=>{ this.permissions.customer_phone ? x.customerPhone : 'XXX'}},
        'Dirección del Cliente': {field: 'customerAddress'},
        Proveedor: {field: 'providerMessengerName'},
        'Nombre del Domiciliario': {field: 'messenger'},
        'Teléfono del Domiciliario': {field: 'messengerPhone'},
        'Número de guía': {field: 'idTracking'},
        'Id Tracking': {field: 'idTracking'},
        'Kms' : {field : 'kmOrder'},
        'Fecha de actualización de guía': {detail: 'dateOrderGuide'},
        // tslint:disable-next-line: radix
        'Ruta Óptima': {fun: (x)=>{ return parseInt(x.multiStore) > 1 ? 'SI' : 'NO'}},
        'Comentarios call': {field: 'callCenterComments'},
        'Razón de cancelación': {field: 'orderCancellationReason'},
        'Observación': {field: 'orderCancellationObservation'},
        'Usuario Canceló Orden': {field: 'orderCancellationUserName', func: (data)=>{ return data.orderCancellationUserName ? data.orderCancellationUserName : 'No registra'}},
        'Razón Transferencia': {field: 'transferReason', func: (data)=>{ return data.orderTransfersRelation.transferReason}},
        'Número de Traslados': {field: 'transferQuantity', func: (data)=>{ return data.orderTransfersRelation.transferQuantity}},
      }
    }
  }

}

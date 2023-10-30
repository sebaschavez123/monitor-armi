import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import { NzI18nService, es_ES } from 'ng-zorro-antd/i18n';
import { OrderService } from '../../../services/order.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment-mini-ts';
import { countryConfig } from 'src/country-config/country-config';

@Component({
  selector: 'search-providers',
  templateUrl: './search-providers.component.html',
  styleUrls: ['./../search.component.scss']
})
export class SearchProvidersComponent implements OnInit {

  lstOrders = []
  lstOrdersId = []
  dataExport:any
  dataExportDetail:any;
  dataSearch:any;
  upoladGuideConf:any;
  active_number:number = 1;
  dateRange:any = [];
  number:string = '';
  
  cols = [];
  valuesTable = {loading : false, total: null, paginate: 50, pageIndex: 1, filter: []}
  toast:any;
  subscription:Subscription;

  private fieldFieltesName = {'stores': 'storeId', 'couriers': 'courierId', 'orderStatusFilters': 'orderStatus', 'paymentMethods': 'paymentMethodId'}

  constructor(private _dS:DashboardService,
              private i18n: NzI18nService,
              private _oS:OrderService,
              private toastr: ToastrService) {
                this.initMode();
              }

  ngOnInit(): void {
    this.i18n.setLocale(es_ES);
    this.initConfOptions();
    this.initCols();
  }

  ngOnDestroy(): void {
    if(this.subscription) this.subscription.unsubscribe();
  }

  changeTab($event){
    this.active_number = $event.index + 1;
    this.number = '';
  }

  validateSearch(){
    return this.active_number == 1 && this.dateRange.length > 0 ||  this.active_number != 1 && String(this.number).length > 0;
  }

  changeValues(){
    this.dataSearch.req_list = this.getRequest();
  }

  search(valuesTable?:boolean){
    this.toast = this.toastr.info("Buscando ordenes...", null, {
      tapToDismiss: false,
      disableTimeOut: true
    });
    this.valuesTable.loading = true;
    if(this.active_number == 3){
      this.searchOrders([{orderId:this.number}])
      return;
    }
    this.subscription = this._dS.post(this._dS.urls.searchIdOrdersProviders,this.getRequest()).subscribe((rta:any) => {
      this.valuesTable.total = rta.data.length;
      this.lstOrdersId = rta.data;
      let orders = [];
      if(valuesTable) orders = this._dS.getJsonOrderIds((this.valuesTable.pageIndex - 1) * this.valuesTable.paginate, this.lstOrdersId, this.valuesTable.paginate);
      else orders = this._dS.getJsonOrderIds(0, this.lstOrdersId, this.valuesTable.paginate);

      this.searchOrders(orders)
    },
    error => {
      this.valuesTable.loading = false;
      this.toast.toastRef.manualClose();
      this.toastr.error("Se produjo un error buscando ordenes", null)
    })

  }

  refresh($event){
      if($event.type == 'page'){
        this.valuesTable.pageIndex = $event.data.pageIndex;
        this.valuesTable.paginate = $event.data.pageSize;
        this.valuesTable.filter = $event.data.filter;
      }
      this.search(true)
  }

  private searchOrders(orders){
    if(orders.length == 0){
      this.lstOrders = [];
      this.valuesTable.loading = false;
      this.toast.toastRef.manualClose();
      this.toastr.warning("No se encontraron ordenes", null)
      return;
    }
    this.valuesTable.loading = true;
    let req = {employeeNumber: this._dS.getLocalUser().employeeNumber, orders};
    this.subscription = this._dS.post(this._dS.urls.searchOrdersProvider, req ).subscribe((rta2:any) => {
      let lstOrders = rta2.data.map(x =>{
          if (x.pickingHour == null) x.pickingHour == "";
          x.pickingDate != null ? x.pickingDate + ' '+ x.pickingHour : x.pickingDateTime = null;
          x.storeNameCity = "<u>"+ x.storeName + "</u> " + x.city;
          x.messengerPhoneCountry = x.messengerPhone != null? countryConfig.phoneCode+x.messengerPhone : "";
          x.opticalRoute = this._dS.getInfOpticalRoute(x);
          x.pm = this._dS.getPaymentMethod(x);
          x.countObs = x.totalObservationsOrder ? !isNaN(parseFloat(x.totalObservationsOrder)) && isFinite(x.totalObservationsOrder) ? parseInt(x.totalObservationsOrder) : 0 : 0;
          return x;
        });
        this.toast.toastRef.manualClose();
        if(this.lstOrders.length == 0) this.toastr.success(this.valuesTable.total + " ordenes encontradas", null);
        this.lstOrders = lstOrders;
        this.valuesTable.loading = false;
  },
  error => {
    this.valuesTable.loading = false;
    this.toast.toastRef.manualClose();
    this.toastr.error("Se produjo un error buscando ordenes", null)
  })
  }

  private getRequest(){
    let req = {employeeNumber: this._dS.getLocalUser().employeeNumber};
    let filters = {}
    if (this.active_number == 1) {
      req['startDate'] = moment(this.dateRange[0]).format('YYYY/MM/DD');
      req['endDate'] = moment(this.dateRange[1]).format('YYYY/MM/DD');
    }else if (this.active_number == 2) {
      req['documentNumberClient'] = this.number;
    } else if (this.active_number == 3) {
      req['orderId'] = this.number;
    } else if (this.active_number == 4) {
      filters['orderGuide'] = this.number;
    }
    for (let i = 0; i < this.valuesTable.filter.length; i++) {
      const fl = this.valuesTable.filter[i];
      if(fl.value.length > 0) filters[fl.key] = fl.value.map(vl =>{return {[this.fieldFieltesName[fl.key]] : this.getDataFilter(fl.key, vl)};})
    }
    if(Object.keys(filters).length === 0 && this.active_number == 1) req['filters'] = filters;

    return req;
  }

  private getDataFilter(key:string, value:string){
    if(key == 'stores') return this._dS.stores.slice(0).filter(s=> s.name == value)[0].id;
    else if(key == 'couriers') return this._dS.couriers.slice(0).filter(s=> s.name == value)[0].id;
    else if(key == 'paymentMethods') return this._dS.paymentsMethod.slice(0).filter(s=> s.description == value)[0].id;
    else return value;
  }


  initMode(){
      this.upoladGuideConf = {
        urlSearch: this._dS.urls.searchOrdersProvider,
        urlAdd: this._oS.urls.addOrderGuideProvider,
        urlSendMail: this._dS.urls.sendMailNoExpress,
        urlFinalize: this._oS.urls.finishProvider,
        linesUpload: 3,
        statusId: 4
      }
      this.dataSearch = {
        url: this._dS.urls.searchOrdersProvider,
        url_list: this._dS.urls.searchIdOrdersProviders,
        req_list: {},
        req: {'employeeNumber': this._dS.getLocalUser().employeeNumber },
      }
    if(this.validateSearch() && this.lstOrdersId.length > 0) this.search();
  }

  private initCols(){
    this.cols = this._dS.getCols();
  }

  private initConfOptions(){
    this.dataExport = {
        object: {
          'Número de Pedido': {field: 'orderId'},
          'Fecha de Creación': {field: 'createDate'},
          'Fecha de Entrega': {field: 'pickingDate'},
          'Tipo de Entrega': {field: 'deliveryType', func: (data)=>{ return data.deliveryType ? data.deliveryType : "No registra"}},
          'Tiempo Transcurrido': {field: 'totalMins'},
          'Estado': {field: 'status'},
          'Método de Pago': {field: 'paymentMethod'},
          'Tienda': {field: 'storeName'},
          'Operador': {field: 'courierName'},
          'Ciudad/Municipio': {field: 'city'},
          'Nombre del Cliente': {field: 'customerName'},
          'Cédula del Cliente': {field: 'customerDocument'},
          'Teléfono del Cliente': {field: 'customerPhone'},
          'Dirección del Cliente': {field: 'customerAddress'},
          'Nombre del Domiciliario': {field: 'messenger'},
          'Teléfono del Domiciliario': {field: 'messengerPhone'},
          'Número de guía': {field: 'idTracking'},
          'Id Tracking': {field: 'idTracking'},
          'Fecha de actualización de guía': {detail: 'dateOrderGuide'},
          'Ruta Óptima': {fun: (x)=>{ return parseInt(x.multiStore) > 1 ? "SI" : "NO"}},
        },
        modifications: [
            {
              field: 'dateOrderGuide',
              promise: async (x) => {
                let rta:any =  await this._dS.getDetailOrdersNoExpress(x.orderId).toPromise();
                if (rta.code == "OK" && rta.data != null && rta.data.dateOrderGuide != null && rta.data.dateOrderGuide != "") return rta.data.dateOrderGuide
                else return "";
              }
            }
        ],
        nameReport: 'Ordenes_'
    }
    this.dataExportDetail = {
        extras: [],
        object: {
          'Número de Pedido': {field: 'orderId'},
          'Fecha de Creación': {field: 'createDate'},
          'Fecha de Entrega': {field: 'pickingDate'},
          'Fecha de actualización de guía': {detail: 'statusDate'},
          'Tipo de Orden': {field: 'deliveryType', func: (data)=>{ return data.deliveryType ? data.deliveryType : "No registra"}},
          'Estado': {field: 'status'},
          'Método de Pago': {field: 'paymentMethod'},
          'Tienda': {field: 'storeName'},
          'Ciudad/Municipio': {field: 'city'},
          'Operador': {field: 'courierName'},
          'Número de guía': {field: 'idTracking'},
          'Nombre del Cliente': {field: 'customerName'},
          'Cédula del Cliente': {field: 'customerDocument'},
          'Teléfono del Cliente': {field: 'customerPhone'},
          'Dirección del Cliente': {field: 'customerAddress'},
          'Item': {field: 'itemId'},
          'Código de barras': {field: 'itemBarcode'},
          'Descripción': {field: 'itemDescription'},
          'Unidades': {field: 'quantity'},
          'Precio Unitario': {field: 'unitPrice'},
          'Total': {field: 'totalPrice'},
          'Valor de domicilio': {field : 'deliveryValue'},
          'Comentarios Call Center' : {field : 'callCenterComments'},
          'Observations' : {field : 'observations'},
          'Cancelada por' : {field : 'employeeName'},
          'Razón de cancelación' : {field : 'reason'},
          'Número de Factura' : {field : 'ticketNumber'},
          'Número Nota Crédito' : {field : 'creditNoteticketNumber'},
          'Número LifeMiles' : {field : 'lifeMiles'},
          'Estado Transacción PayU' : {field : 'transactionStatusPayU'},
          'Valor Transacción PayU' : {field : 'transactionValuePayU'},
          'Número de Pedido Proveedor Asociado' : {field : 'orderIdProvider'},
      },
        modifications: [],
        nameReport: 'OrdersDetalle'
    }
    this.dataSearch = {
        url: this._dS.urls.searchOrders,
        url_detail: this._dS.urls.reportWhitDetail,
        url_list: this._dS.urls.searchIdOrdersReports,
        req_list: {},
        req: {'employeeNumber': this._dS.getLocalUser().employeeNumber },
    }
  }
}

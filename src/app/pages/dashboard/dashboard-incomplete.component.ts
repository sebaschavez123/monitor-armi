import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { SoundsService } from '../../services/sounds.service';
import { OrderService } from '../../services/order.service';
import { deliveryTypes } from 'src/app/core/const';
import { countryConfig } from 'src/country-config/country-config';

@Component({
  selector: 'app-dashboard-incomplete',
  template: `
  <general-data-options [uploadGuide]="upoladGuideConf"></general-data-options>

  <general-orders-table [cols]="cols" [listOfAllData]="lstOrders" (refresh)="getData()" [typeReport]="'incomplete'"
  [exportPdf]="false" [editCourier]="{couriers:true}" [missings]="true"></general-orders-table>`,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardImcompleteComponent implements OnInit, OnDestroy {

  cols:Array<any> = [];
  lstOrders:Array<any> = [];
  subTimeout:any;
  
  dataExport:any
  dataExportDetail:any;
  dataSearch:any;
  upoladGuideConf:any;
  types = [
    {label: 'Nacional', value: 'Nacional'},
    {label: 'Envíalo ya', value: 'Envialo ya'},
  ]



  constructor(private _dS:DashboardService,
              private _oS:OrderService,
              private sounds:SoundsService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.initCols();
    this.getData();
    this.initConfOptions();
  }

  ngOnDestroy(): void {
    clearInterval(this.subTimeout);
  }

  getData() {
    clearInterval(this.subTimeout);
    this.searchData();
    this.subTimeout = setInterval(()=>{this.searchData();},60000);
  }

  private searchData(){
    let toast = this.toastr.info("Sincronizando Dashboard...", null, {
      tapToDismiss: false,
      disableTimeOut: true
    });
    this._dS.getOrders20JSON('INCOMPLETED_NO_EXPRESS').subscribe(
    (rta:any) => {
        let lstOrders = rta.data.map(x =>{
            x.pickingDateTime = x.pickingDate + ' '+ x.pickingHour;
            x.storeNameCity = "<u>"+ x.storeName + "</u> " + x.city;
            x.messengerPhoneCountry = x.messengerPhone != null? countryConfig.phoneCode+x.messengerPhone : "";
            x.opticalRoute = this._dS.getInfOpticalRoute(x);
            x.pm = this._dS.getPaymentMethod(x);
            x.countObs = x.totalObservationsOrder ? !isNaN(parseFloat(x.totalObservationsOrder)) && isFinite(x.totalObservationsOrder) ? parseInt(x.totalObservationsOrder) : 0 : 0;
            return x;
          });
          if (this._dS.getLocalUser().rolUser == "PICKER") lstOrders = lstOrders.filter(x => x.storeId.trim() == String(this._dS.getLocalUser().storeId));
          this.lstOrders = lstOrders;
          toast.toastRef.manualClose();
          // this.sounds.notification();
          this.toastr.success("Dashboard Sincronizando", null);
    },
    error => {
      toast.toastRef.manualClose();
      this.toastr.error("No se pudo sincronizar dashboard", null)
    });
  }

  private initCols(){
    this.cols = this._dS.getCols();
    this.cols.splice(3, 0, {
      name: 'deliveryType',
      header: 'Tipo',
      label: 'Tipo',
      sortOrder: null,
      sortFn: (a: any, b: any) => String(a.deliveryType).localeCompare(String(b.deliveryType)),
      filterMultiple: true,
      listOfFilter: deliveryTypes.map(x=>{ return { text: x.label, value: x.value }}),
      filterFn: (value: string, item: any) => item.deliveryType.indexOf(value) !== -1
    })
    this.cols.splice(10, 1)
  }

  private initConfOptions(){
    this.upoladGuideConf = {
        urlSearch: this._dS.urls.searchOrdersReports,
        urlAdd: this._oS.urls.addOrderGuide,
        urlSendMail: this._dS.urls.sendMailNoExpress,
        urlFinalize: this._oS.urls.finish,
        linesUpload: 4,
        statusId: 25
    }
    this.dataExport = {
        object: {
            'Número de Pedido': {field: 'orderId'},
            'Fecha de Creación': {field: 'createDate'},
            'Tipo de Entrega': {field: 'deliveryType', func: (data)=>{ return data.deliveryType ? data.deliveryType : "No registra"}},
            'Tiempo Transcurrido': {field: 'totalMins'},
            'Estado': {field: 'status'},
            'Método de Pago': {field: 'paymentMethod'},
            'Tienda': {field: 'storeName'},
            'Ciudad/Municipio': {field: 'city'},
            'Operador': {field: 'courierName'},
            'Número de guía': {field: 'idTracking'},
            'Fecha de actualización de guía': {field: 'dateOrderGuide'},
            'Nombre del Domiciliario': {field: 'messenger'},
            'Teléfono del Domiciliario': {field: 'messengerPhone'},
            'Nombre del Cliente': {field: 'customerName'},
            'Cédula del Cliente': {field: 'customerDocument'},
            'Teléfono del Cliente': {field: 'customerPhone'},
            'Dirección del Cliente': {field: 'customerAddress'},
            'Comentario de cliente' : {field: 'countObs'}
        },
        modifications: [
            {
                field: 'countObs',
                func: (x)=> { return x.totalObservationsOrder ? !isNaN(parseFloat(x.totalObservationsOrder)) && isFinite(x.totalObservationsOrder) ? parseInt(x.totalObservationsOrder) : 0 : 0 }
            },
            {
              field: 'dateOrderGuide',
              promise: async (x) => {
                let rta:any =  await this._dS.getDetailOrdersNoExpress(x.orderId).toPromise();
                if (rta.code == "OK" && rta.data != null && rta.data.dateOrderGuide != null && rta.data.dateOrderGuide != "") return rta.data.dateOrderGuide
                else return "";
              }
            }
        ],
        nameReport: 'IncompletosDomicilio'
    }
    this.dataExportDetail = {
        extras: [
            {
                name: 'detail',
                for: 'orderDetail',
                object: {
                  'Número de Pedido': {field: 'orderId'},
                  'Fecha de Creación': {field: 'createDate'},
                  'Tipo de Entrega': {field: 'deliveryType', func: (data)=>{ return data.deliveryType ? data.deliveryType : "No registra"}},
                  'Tiempo Transcurrido': {field: 'totalMins'},
                  'Estado': {field: 'status'},
                  'Método de Pago': {field: 'paymentMethod'},
                  'Tienda': {field: 'storeName'},
                  'Ciudad/Municipio': {field: 'city'},
                  'Operador': {field: 'courierName'},
                  'Número de guía': {field: 'idTracking'},
                  'Fecha de actualización de guía': {detail: 'dateOrderGuide'},
                  'Nombre del Domiciliario': {field: 'messenger'},
                  'Teléfono del Domiciliario': {field: 'messengerPhone'},
                  'Nombre del Cliente': {field: 'customerName'},
                  'Cédula del Cliente': {field: 'customerDocument'},
                  'Teléfono del Cliente': {field: 'customerPhone'},
                  'Dirección del Cliente': {field: 'customerAddress'},
                    'Item Faltante': 'SI',
                    'Item': {item: 'id'},
                    'Código de barras': {item: 'barcode'},
                    'Descripción': {item: 'itemName'},
                    'Unidades': {item: 'units'},
                    'Precio Unitario': {item: 'price'},
                    'Total':  { fun: (order,item) => { return parseFloat(item.price) * parseFloat(item.units)}}
                }
            },
            {
              name: 'missingItems',
              object: {
                'Número de Pedido': {field: 'orderId'},
                'Fecha de Creación': {field: 'createDate'},
                'Tipo de Entrega': {field: 'deliveryType', func: (data)=>{ return data.deliveryType ? data.deliveryType : "No registra"}},
                'Tiempo Transcurrido': {field: 'totalMins'},
                'Estado': {field: 'status'},
                'Método de Pago': {field: 'paymentMethod'},
                'Tienda': {field: 'storeName'},
                'Ciudad/Municipio': {field: 'city'},
                'Operador': {field: 'courierName'},
                'Número de guía': {field: 'idTracking'},
                'Fecha de actualización de guía': {detail: 'dateOrderGuide'},
                'Nombre del Domiciliario': {field: 'messenger'},
                'Teléfono del Domiciliario': {field: 'messengerPhone'},
                'Nombre del Cliente': {field: 'customerName'},
                'Cédula del Cliente': {field: 'customerDocument'},
                'Teléfono del Cliente': {field: 'customerPhone'},
                'Dirección del Cliente': {field: 'customerAddress'},
                  'Item Faltante': 'SI',
                  'Item': {item: 'id'},
                  'Código de barras': {item: 'barcode'},
                  'Descripción': {item: 'itemName'},
                  'Unidades': {item: 'units'},
                  'Precio Unitario': {item: 'price'},
                  'Total':  { fun: (order,item) => { return parseFloat(item.price) * parseFloat(item.units)}}
              }
          }
        ],
        object: {
          'Número de Pedido': {field: 'orderId'},
          'Fecha de Creación': {field: 'createDate'},
          'Tipo de Entrega': {field: 'deliveryType', func: (data)=>{ return data.deliveryType ? data.deliveryType : "No registra"}},
          'Tiempo Transcurrido': {field: 'totalMins'},
          'Estado': {field: 'status'},
          'Método de Pago': {field: 'paymentMethod'},
          'Tienda': {field: 'storeName'},
          'Ciudad/Municipio': {field: 'city'},
          'Operador': {field: 'courierName'},
          'Número de guía': {field: 'idTracking'},
          'Fecha de actualización de guía': {detail: 'dateOrderGuide'},
          'Nombre del Domiciliario': {field: 'messenger'},
          'Teléfono del Domiciliario': {field: 'messengerPhone'},
          'Nombre del Cliente': {field: 'customerName'},
          'Cédula del Cliente': {field: 'customerDocument'},
          'Teléfono del Cliente': {field: 'customerPhone'},
          'Dirección del Cliente': {field: 'customerAddress'},
          'Item Faltante': '',
          'Item': 'Domicilio',
          'Código de barras': '',
          'Descripción': '',
          'Unidades': '',
          'Precio Unitario': '',
          'Total': {field: 'delivery'}
      },
        modifications: [
            {
              field: 'delivery',
              promise: async (x) => {
                let rta:any = await this._dS.getDeliveryValueProvider(parseInt(x.orderId)).toPromise();
                return rta.data.message;
              }
            },
            {
                field: 'detail',
                promise: async (x) => {
                    let rta:any =  await this._dS.getDetailOrdersNoExpress(x.orderId).toPromise();
                    if (rta.code == "OK" && rta.data != null) return rta.data
                    else return;
                }
            },
            {
              field: 'missingItems',
              promise: async (x) => {
                  let rta:any =  await this._dS.getDetailNoExpressIncompleted(x.orderId).toPromise();
                  return rta.data.orderDetail
              }
          }
        ],
        nameReport: 'IncompletosDetalleDomicilio'
    }
    this.dataSearch = {
        url: this._dS.urls.searchOrdersNoExpress,
        req: {'employeeNumber': this._dS.getLocalUser().employeeNumber }
    }
  }



}

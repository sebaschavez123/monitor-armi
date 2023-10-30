import { Component, OnInit, OnDestroy, AfterContentChecked } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { SoundsService } from '../../services/sounds.service';
import { OrderService } from '../../services/order.service';
import { countryConfig } from 'src/country-config/country-config';

@Component({
  selector: 'app-dashboard-provider',
  template: `

  <general-data-options [uploadGuide]="upoladGuideConf"
   [listData]="lstOrders" [dataSearch]="dataSearch"></general-data-options>

  <general-orders-table class="mt-3" [cols]="cols" orderType="PROVIDER" [listOfAllData]="lstOrders" (refresh)="getData()" [typeReport]="'no-express'"
  [exportPdf]="false" [editCourier]="{couriers:true}"></general-orders-table>

  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardProviderComponent implements OnInit, OnDestroy {

  cols:Array<any> = [];
  lstOrders:Array<any> = [];
  subTimeout:any;
  
  dataExport:any
  dataExportDetail:any;
  dataSearch:any;
  upoladGuideConf:any;


  constructor(private _dS:DashboardService,
              private _oS:OrderService,
              private sounds:SoundsService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.initCols();
    this.initConfOptions();
    this.getData();
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
    this._dS.getOrders20JSON('PROVIDER').subscribe(
    (rta:any) => {
        let lstOrders = rta.data.map(x => {
            x.pickingDateTime = x.pickingDate + ' '+ x.pickingHour;
            x.storeNameCity = "<u>"+ x.storeName + "</u> " + x.city;
            x.messengerPhoneCountry = x.messengerPhone != null? countryConfig.phoneCode+x.messengerPhone : "";
            x.opticalRoute = this._dS.getInfOpticalRoute(x);
            x.pm = this._dS.getPaymentMethod(x);
            x.countObs = x.totalObservationsOrder ? !isNaN(parseFloat(x.totalObservationsOrder)) && isFinite(x.totalObservationsOrder) ? parseInt(x.totalObservationsOrder) : 0 : 0;
            if (x.idTracking == "http://svc1.sipost.co/trazawebsip2/default.aspx?Buscar=") x.idTracking = "";
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
    this.cols.splice(5, 0, {
      name: 'providerName',
      header: 'Proveedor',
      label: 'Proveedor',
      sortOrder: null,
      sortFn: (a: any, b: any) => String(a.name).localeCompare(String(b.name)),
    })
  }

  private initConfOptions(){
    this.upoladGuideConf = {
        urlSearch: this._dS.urls.searchOrdersProvider,
        urlAdd: this._oS.urls.addOrderGuideProvider,
        urlSendMail: this._dS.urls.sendMailNoExpress,
        urlFinalize: this._oS.urls.finishProvider,
        linesUpload: 3,
        statusId: 4
    }
    this.dataExport = {
        object: {
            'Número de Pedido': {field: 'orderId'},
            'Fecha de Creación': {field: 'createDate'},
            'Tiempo Transcurrido': {field: 'totalMins'},
            'Estado': {field: 'status'},
            'Método de Pago': {field: 'paymentMethod'},
            'Proveedor': {field: 'providerName'},
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
            'Ruta Óptima': {field: 'multiStore', func: (data)=>{ return parseInt(data.multiStore) > 1 ? "SI" : "NO"}},
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
        nameReport: 'ProveedoresDomicilio2.0'
    }
    this.dataExportDetail = {
        extras: [
            {
                name: 'detail',
                for: 'orderDetail',
                object: {
                    'Número de Pedido': {field: 'orderId'},
                    'Fecha de Creación': {field: 'createDate'},
                    'Estado': {field: 'status'},
                    'Método de Pago': {field: 'paymentMethod'},
                    'Proveedor': {field: 'providerName'},
                    'Tienda': {field: 'storeName'},
                    'Ciudad/Municipio': {field: 'city'},
                    'Operador': {field: 'courierName'},
                    'Número de guía': {field: 'idTracking'},
                    'Fecha de actualización de guía': {detail: 'dateOrderGuide'},
                    'Nombre del Cliente': {field: 'customerName'},
                    'Cédula del Cliente': {field: 'customerDocument'},
                    'Teléfono del Cliente': {field: 'customerPhone'},
                    'Dirección del Cliente': {field: 'customerAddress'},
                    'Item Faltante': 'NO',
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
            'Estado': {field: 'status'},
            'Método de Pago': {field: 'paymentMethod'},
            'Proveedor': {field: 'providerName'},
            'Tienda': {field: 'storeName'},
            'Ciudad/Municipio': {field: 'city'},
            'Operador': {field: 'courierName'},
            'Número de guía': {field: 'idTracking'},
            'Fecha de actualización de guía': {detail: 'dateOrderGuide'},
            'Nombre del Cliente': {field: 'customerName'},
            'Cédula del Cliente': {field: 'customerDocument'},
            'Teléfono del Cliente': {field: 'customerPhone'},
            'Dirección del Cliente': {field: 'customerAddress'},
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
            }
        ],
        nameReport: 'ProveedoresDetalleDomicilio2.0'
    }
    this.dataSearch = {
        url: this._dS.urls.searchOrdersProvider,
        req: {'employeeNumber': this._dS.getLocalUser().employeeNumber }
    }
  }



}

import { Component, OnInit } from '@angular/core';
import { NzI18nService, es_ES } from 'ng-zorro-antd/i18n';
import { ReportsService } from '../../../services/reports.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import * as moment from 'moment-mini-ts';
import { ExportsService } from 'src/app/services/exports.service';

@Component({
  selector: 'app-report-orders-corrupted',
  templateUrl: './report-orders-corrupted.component.html',
  styleUrls: ['./report-orders-corrupted.component.scss']
})
export class ReportOrdersCorruptedComponent implements OnInit {

  dateRange:any = [];
  dataExport: any;
  dataSearch: any;

  constructor(private i18n: NzI18nService,
              private _dS:DashboardService,
              private _eS:ExportsService,
              private _rS:ReportsService) { }

  ngOnInit(): void {
    this.i18n.setLocale(es_ES);
    this.initConfOptions();
  }

  reportGenerate(){
    this.dataSearch.req_list = {
      employeeNumber : this._rS.getLocalUser().employeeNumber,
      startDate: moment(this.dateRange[0]).format('YYYY/MM/DD'),
      endDate: moment(this.dateRange[1]).format('YYYY/MM/DD'),
    };
    this._eS.generate(this.dataSearch, false, this.dataExport);

  }

  private initConfOptions(){
    this.dataExport = {
        object: {
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
          Valor: {field: ''},
          'Nombre del Cliente': {field: 'customerName'},
          'Cédula del Cliente': {field: 'customerDocument'},
          'Teléfono del Cliente': {field: 'customerPhone'},
          'Dirección del Cliente': {field: 'customerAddress'},
          Proveedor: {field: 'providerMessengerName'},
          'Nombre del Domiciliario': {field: 'messenger'},
          'Teléfono del Domiciliario': {field: 'messengerPhone'},
          'Número de guía': {field: 'idTracking'},
          'Id Tracking': {field: 'idTracking'},
          'Fecha de actualización de guía': {detail: 'dateOrderGuide'},
          // tslint:disable-next-line: radix
          'Ruta Óptima': {fun: (x)=>{ return parseInt(x.multiStore) > 1 ? 'SI' : 'NO'}},
          'Comentarios call': {field: 'callCenterComments'},
        },
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
        nameReport: 'Ordenes_Corruptas'
    }
    this.dataSearch = {
      url: this._dS.urls.searchOrders,
      url_list: this._rS.urls.ordersCorrupted,
      method: 'post',
      req_list: {},
      req: {employeeNumber: this._dS.getLocalUser().employeeNumber}
    }
  }

}

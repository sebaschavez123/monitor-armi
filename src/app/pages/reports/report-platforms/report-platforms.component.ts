import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { ExportsService } from '../../../services/exports.service';
import { ReportsService } from '../../../services/reports.service';
import * as moment from 'moment-mini-ts';

@Component({
  selector: 'app-report-platforms',
  templateUrl: './report-platforms.component.html',
  styleUrls: ['./report-platforms.component.scss']
})
export class ReportPlatformsComponent implements OnInit {

  startDate: Date =  new Date();
  endDate: Date =  new Date();
  dataExport:any;
  dataSearch:any;

  constructor(public _dS:DashboardService,
              private _rS:ReportsService,
              private _eS:ExportsService) { }

  ngOnInit(): void {
    this.initConfOptions()
  }

  reportGenerate(){
    this.dataSearch.direct.req = {
      employeeNumber : this._dS.getLocalUser().employeeNumber,
      startDate: moment(this.startDate).format('YYYY/MM/DD'),
      endDate: moment(this.endDate).format('YYYY/MM/DD'),
    }
    this._eS.generateDirect(this.dataSearch, this.dataExport);
  }

  private initConfOptions(){
    this.dataExport = {
      extras: [],
      object: {
        'Id domicilios': {field: 'idDomiciliosCom'},
        'Nota credito': {field: 'creditNote'},
        'Número factura': {field: 'ticketNumber'},
        'Número de Pedido': {field: 'orderId'},
        'Fecha': {field: 'date'},
        'Tipo de orden': {field: 'deliveryType', func: (data)=>{ return data.deliveryType ? data.deliveryType : "No registra"}},
        'Detalle': {field: 'observations'},
        'Comentarios': {field: 'customerReviewComments'},
        'Estado': {field: 'status'},
        'Subtotal': {field: 'subtotalOrder'},
        'Domicilio': {field: 'deliveryValue'},
        'Descuento': {field: 'discountValue'},
        'Total': {field: 'totalOrder'},
        'Nombres de cliente': {field: 'customerFirstName'},
        'Apellidos de cliente': {field: 'customerLastName'},
        'Cédula de cliente': {field: 'customerDocument'},
        'Dirección de cliente': {field: 'customerAddress'},
        'Detalle dirección de cliente': {field: 'customerAddressDetails'}
    },
      modifications: [],
      nameReport: 'ReporteDomiciliosCom'
    }
    this.dataSearch = {
        direct: {
          url: this._rS.urls.domiciliosCom,
          method: 'post',
          req: {}
        },
        req: {'employeeNumber': this._dS.getLocalUser().employeeNumber },
    }
  }

}

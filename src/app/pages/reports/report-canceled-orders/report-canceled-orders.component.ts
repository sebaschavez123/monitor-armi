import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';
import * as moment from 'moment-mini-ts';
import { ExportsService } from '../../../services/exports.service';

@Component({
  selector: 'app-report-canceled-orders',
  templateUrl: './report-canceled-orders.component.html',
  styleUrls: ['./report-canceled-orders.component.scss']
})
export class RreportCanceledOrdersComponent implements OnInit {

  dateRange:any = [];
  dataExport:any;
  dataSearch:any;

  constructor(private _rS:ReportsService,
              private _eS:ExportsService) { }

  ngOnInit(): void {
    this.initConfOptions();
    this.dateRange[0] = new Date();
    this.dateRange[1] = new Date();
  }

  reportGenerate(){
    this.dataSearch.direct.req = {
      employeeNumber : this._rS.getLocalUser().employeeNumber,
      startDate: moment(this.dateRange[0]).format('YYYY/MM/DD'),
      endDate: moment(this.dateRange[1]).format('YYYY/MM/DD'),
    }
    this._eS.generateDirect(this.dataSearch, this.dataExport);
  }

  private initConfOptions(){
    this.dataExport = {
      extras: [],
      object: {
        'Número de Pedido': {field: 'orderId'},
        Fecha: {field: 'date'},
        'Fecha de cancelación': {field: 'cancelledDate'},
        'Cancelado por': {field: 'employeeName'},
        "Razón": {field: 'reason'},
        "Canal de cancelación": {field: 'cancelChannel'},
        "Método de pago": {field: 'paymentMethod'},
        "Canal de creación": {field: 'creationChannel'},
        "Total": {field: 'total'},
        "Cédula": {field: 'documentNumber'},
        "Ordenes asociadas": {field: 'associatedOrders'}
    },
      modifications: [],
      nameReport: 'Ordenes_Canceladas'
    }
    this.dataSearch = {
        direct: {
          url: this._rS.urls.ordersCanceled,
          method: 'post',
          req: {}
        },
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { NzI18nService, es_ES } from 'ng-zorro-antd/i18n';
import { ReportsService } from '../../../services/reports.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import * as moment from 'moment-mini-ts';
import { ExportsService } from 'src/app/services/exports.service';


@Component({
  selector: 'app-report-refund',
  templateUrl: './report-refund.component.html',
  styleUrls: ['./report-refund.component.scss']
})
export class ReportRefundComponent implements OnInit {
  startDate: Date =  new Date();
  endDate: Date =  new Date();
  dataExport: any;
  dataSearch: any;

  constructor(private i18n: NzI18nService,
              private _dS:DashboardService,
              private _eS:ExportsService,
              private _rS:ReportsService) { }

  ngOnInit(): void {
   
    this.initConfOptions();
    
  }
  reportGenerate(){
    this.dataSearch.direct.req = {
      employeeNumber : this._dS.getLocalUser().employeeNumber,
      startDate: moment(this.startDate).format('YYYY/MM/DD'),
      endDate: moment(this.endDate).format('YYYY/MM/DD'),
    };
    this._eS.generateDirect(this.dataSearch, this.dataExport);
  }
  private initConfOptions(){
    this.dataExport = {
       extras: [],
        object:{
          'Fecha de Creación': {field: 'createDate'},
          'Número de orden': {field: 'orderId'},
          'Tienda': {field: 'storeName'},
          'Nombre del Cliente': {field: 'customerName'},
          'Cédula del Cliente': {field: 'documentNumber'},
          'Teléfono del Cliente': {field: 'customerPhone'},
          'Número de factura' : {field: 'ticket'},
          'Nota crédito' : {field: 'creditNote'},
          'Referencia de entrada': { field: 'referenceInbound'},
          'Referencia de salida' : {field : 'referenceOutbound'},
          'Valor' : {field:'amout'},
          'Banco' : {field: 'bank'}
        },
        modifications: [],
        nameReport: 'Reembolso exitoso PAGOMOVIL'
    }
    this.dataSearch = {
      direct:{
        url: this._rS.urls.reportRefund,
        method: 'post',
        req: {},
      },
      req: {'employeeNumber': this._dS.getLocalUser().employeeNumber} 
    }
  }
}

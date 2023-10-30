import { Component, OnInit } from '@angular/core';
import { ExportsService } from 'src/app/services/exports.service';
import { ReportsService } from 'src/app/services/reports.service';
import * as moment from 'moment-mini-ts';

@Component({
  selector: 'app-report-call-aware',
  templateUrl: './report-call-aware.component.html',
  styleUrls: ['./report-call-aware.component.scss']
})
export class ReportCallAwareComponent implements OnInit {
  dateRange:any = [];
  dataExport:any;
  dataSearch:any;
  constructor(private _rS:ReportsService,
              private _eS:ExportsService) { }

  ngOnInit() {
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
        'Número de Orden': {field: 'orderId'},
        'Nombre Agente': {field: 'employeeName'},
        Fecha: {field: 'createDate'},
        "Extención": {field: 'extension'},
        "Tipificación": {field: 'callType'},
        "Número de télefono": {field: 'phone'},
        "Resultado de llamada":{field: 'resultCall'},
        "Duracion de la Llamada" : {field: 'callDuration'},
        'Estado en que estaba la orden cuando se tipifico': {field: 'statusName'},
        "Area de gestión": {field:'managementArea'},
        "Tipificación Razón.": {field: 'typification'},
        "Observaciones" : {field: 'observation'},
        "Link grabación de la llamada": {field: 'recording'}
    },
      modifications: [],
      nameReport: 'Reporte_gestion_agentes'
    }
    this.dataSearch = {
        direct: {
          url: this._rS.urls.reportAware,
          method: 'post',
          req: {}
        },
    }
  }

}

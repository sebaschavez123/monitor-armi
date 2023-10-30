import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { NzI18nService, es_ES } from 'ng-zorro-antd/i18n';
import { ReportsService } from '../../../services/reports.service';
import * as moment from 'moment-mini-ts';
import { ExportsService } from '../../../services/exports.service';

@Component({
  selector: 'app-report-messengers',
  templateUrl: './report-messengers.component.html',
  styleUrls: ['./report-messengers.component.scss']
})
export class ReportMessengersComponent implements OnInit {

  dateRange:any = [];
  providerSelected: any;
  messengers = false;
  dataExport: any;
  dataSearch: any;

  constructor(public _dS:DashboardService,
              private i18n: NzI18nService,
              private _rS:ReportsService,
              private _eS:ExportsService) { }

  ngOnInit(): void {
    this.i18n.setLocale(es_ES);
    this.dateRange[0] = new Date();
    this.dateRange[1] = new Date();
    this.initConfOptions();
  }

  reportGenerate() {
    const indexProv = this._dS.providers.slice(0).findIndex(i => i.value === this.providerSelected);
    this.dataSearch.direct.req = {
      employeeNumber : this._rS.getLocalUser().employeeNumber,
      startDate: moment(this.dateRange[0]).format('YYYY/MM/DD'),
      endDate: moment(this.dateRange[1]).format('YYYY/MM/DD'),
      courierProvider:{
        provider: this._dS.providers[indexProv].label,
        emails: this._dS.providers[indexProv].email.split(',')
      },
      typeReport: this.messengers ? 'messenger' : 'provider'
    }
    if (this.messengers) {
      this.dataExport.object = {
        'Nombre del provedor': {field: 'courierName'},
        'Nombre del mensajero': {field: 'nameMessenger'},
        'Id del mensajero': {field: 'idMessenger'},
        Ciudad: {field: 'city'},
        'Ordenes canceladas': {field: 'orderCanceled'},
        'Porcentaje cancelado': {field: 'percentCanceled'},
        'Ordenes sin finalizar': {field: 'orderUnfinalized'},
        'Porcentaje sin finalizar': {field: 'percentUnfinalized'},
        'Ordenes finalizadas': {field: 'orderFinalized'},
        'Porcentaje finalizadas': {field: 'percentFinalized'},
        'Promedio de tiempo': {field: 'timeAverage'},
      }
    } else {
      this.dataExport.object = {
        'Nombre del provedor': {field : 'courierName'},
        'Ordenes canceladas': {field : 'orderCanceled'},
        'Porcentaje cancelado': {field : 'percentCanceled'},
        'Ordenes sin finalizar': {field : 'orderUnfinalized'},
        'Porcentaje sin finalizar': {field : 'percentUnfinalized'},
        'Ordenes finalizadas': {field : 'orderFinalized'},
        'Porcentaje finalizadas': {field : 'percentFinalized'},
        'Promedio de tiempo': {field : 'timeAverage'}
      }
    }
    this._eS.generateDirect(this.dataSearch, this.dataExport);
  }

  private initConfOptions(){
    this.dataExport = {
      extras: [],
      object: {},
      modifications: [],
      nameReport: 'Rendimiento_de_mensajeros'
    }
    this.dataSearch = {
        direct: {
          url: this._rS.urls.messengers,
          method: 'post',
          req: {}
        }
    }
  }

}

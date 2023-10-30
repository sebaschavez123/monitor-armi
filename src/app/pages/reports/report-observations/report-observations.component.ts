import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';
import { NzI18nService, es_ES } from 'ng-zorro-antd/i18n';
import { DashboardService } from '../../../services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../../services/order.service';
import * as moment from 'moment-mini-ts';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ExportsService } from 'src/app/services/exports.service';

@Component({
  selector: 'app-report-observations',
  templateUrl: './report-observations.component.html',
  styleUrls: ['./report-observations.component.scss']
})
export class ReportObservationsComponent implements OnInit {

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
    const url = this._rS.urls.reportObservations;
    const startDate = moment(this.dateRange[0]).format('DD/MM/YYYY');
    const finalDate = moment(this.dateRange[1]).format('DD/MM/YYYY');
    this.dataSearch.direct.url = `${url}?startDate=${startDate}&finalDate=${finalDate}`;
    this._eS.generateDirect(this.dataSearch, this.dataExport);
  }

  private initConfOptions(){
    this.dataExport = {
      extras: [],
      object: {
        'Número de Pedido': {field: 'orderId'},
        'Fecha notificación': { field: 'notificationDate' },
        'Hora notificación': { field: 'notificationTime' },
        'Observación': { field: 'observation' },
        'Id': { field: 'userId' },
        'usuario': { field: 'userName' },
        'Fecha de Creación': { field: 'createDateOrder' },
        'Estado': { field: 'StatusName' },
        'Tienda': { field: 'store' },
        'Ciudad': { field: 'city' },
        'Tiempo Asignada (mm:ss)': { field: 'assignmentTime' },
        'Tiempo Picking (mm:ss)': { field: 'pickingTime' },
        'Tiempo Facturada (mm:ss)': { field: 'billingTime' },
        'Tiempo Entregada (mm:ss)': { field: 'customerArrival' },
        'Operador': { field: 'courier' }
    },
      modifications: [],
      nameReport: 'Ordenes_No_Express'
    }
    this.dataSearch = {
        direct: {
          url: '',
          method: 'get',
          req: {}
        },
    }
  }
}

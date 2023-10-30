import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';
import * as moment from 'moment-mini-ts';
import { ExportsService } from 'src/app/services/exports.service';

@Component({
  selector: 'app-report-incentives',
  templateUrl: './report-incentives.component.html',
  styleUrls: ['./report-incentives.component.scss']
})
export class ReportIncentivesComponent implements OnInit {

  dateRange:any = [];
  dataExport:any;
  dataSearch:any;

  constructor(private _rS:ReportsService,
              private _eS:ExportsService) { }

  ngOnInit(): void {
    this.dateRange[0] = new Date();
    this.dateRange[1] = new Date();
  }

  reportGenerate(){
    this._eS.generateDirect({
        direct: {
          url: this._rS.urls.reportIncentives,
          method: 'post',
          req: {
            startDate: moment(this.dateRange[0]).format('YYYY-MM-DD'),
            endDate: moment(this.dateRange[1]).format('YYYY-MM-DD')
          }
        },
    }, {
        extras: [],
        object: {
            'Fecha creación': { field: 'createDate'},
            'Empledo': { field: 'employeeName'},
            'Tipo de Incentivo': { field: 'incentiveType'},
            'Tienda': { field: 'store'},
            'Ciudad': { field: 'city'},
            'Courier': { field: 'courier'},
            'Fecha Inicio': { field: 'startDate'},
            'Fecha fin': { field: 'endDate'},
            'Valor': { field: 'valuee'},
            'Order Id': { field: 'orderId'}
        },
        modifications: [],
        nameReport: 'Incentives_Report'
    });
  }

}

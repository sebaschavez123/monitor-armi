import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';
import * as moment from 'moment-mini-ts';
import { ExportsService } from 'src/app/services/exports.service';

@Component({
  selector: 'app-report-return-success',
  templateUrl: './report-return-success.component.html',
  styleUrls: ['./report-return-success.component.scss']
})
export class ReportReturnSuccessComponent implements OnInit {
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
          url: this._rS.urls.reportReturnSuccess,
          method: 'post',
          req: {
            startDate: moment(this.dateRange[0]).format('YYYY-MM-DD'),
            endDate: moment(this.dateRange[1]).format('YYYY-MM-DD')
          }
        },
    }, {
        extras: [],
        object: {
            'Orden': { field: 'orderId'},
            'Hora y Fecha': { field: 'createDate'},
            'Estado': { field: 'status'},
            'Medio de Pago': { field: 'paymentMethod'},
            'Monto del pedido': { field: 'orderValue'},
            'Tienda': { field: 'store'},
            'Ciudad': { field: 'city'},
            'Operador': { field: 'courier'},
            'Nombre mensajero': { field: 'messengerName'},
            'Número de mensajero': { field: 'messengerPhone'},
            'Nombre del cliente': { field: 'customerName'},
            'Número del cliente': { field: 'customerPhone'}
        },
        modifications: [],
        nameReport: 'ReturnSuccess_Report'
    });
  }

}

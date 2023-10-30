import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';
import * as moment from 'moment-mini-ts';
import { ExportsService } from 'src/app/services/exports.service';
import { BaseService } from 'src/app/services/base.service';

@Component({
  selector: 'app-report-canceled-without-stock',
  templateUrl: './report-canceled-without-stock.component.html',
  styleUrls: ['./report-canceled-without-stock.component.scss']
})

export class ReportsCanceledWithoutStockComponent implements OnInit {

  dateRange:any = [];
  dataExport:any;
  dataSearch:any;

  constructor(private _rS:ReportsService,
              private _eS:ExportsService,
              private _bS: BaseService) { }

  ngOnInit(): void {
    this.initConfOptions();
    this.dateRange[0] = new Date();
    this.dateRange[1] = new Date();
  }
  reportGenerate(){
    const url = this._rS.urls.reportCanceledWithoutStock;
    const startDate = moment(this.dateRange[0]).format('YYYY-MM-DD');
    const finalDate = moment(this.dateRange[1]).format('YYYY-MM-DD');
    this.dataSearch.direct.url = url;
    this.dataSearch.direct.req = {startDate: startDate, endDate: finalDate, employeeNumber: this._bS.getLocalUser().employeeNumber};
    this._eS.generateDirect(this.dataSearch, this.dataExport);
  }

  private initConfOptions(){
    this.dataExport = {
      extras: [],
      object: {
        'Número de Pedido': {field: 'orderId'},
        'Fecha de creación': { field: 'createDate' },
        'Tienda': { field: 'storeName' },
        'Número de tienda': { field: 'storeId' },
        'Razón': { field: 'reason' },
        'Usuario': { field: 'userName' },
        'Id de item': { field: 'itemId' },
        'Productos': { field: 'productName' },
        'Productos de la orden': { field: 'quantity' },
        'Cantidad del producto': { field: 'productQuantity' },
    },
      modifications: [],
      nameReport: 'Ordenes_No_Express'
    }
    this.dataSearch = {
        direct: {
          url: '',
          method: 'post',
          req: {}
        },
    }
  }
}

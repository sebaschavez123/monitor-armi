import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';
import * as moment from 'moment-mini-ts';
import { ExportsService } from '../../../services/exports.service';

@Component({
  selector: 'app-report-no-express',
  templateUrl: './report-no-express.component.html',
  styleUrls: ['./report-no-express.component.scss']
})
export class ReportNoExpressComponent implements OnInit {

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
        'Nota credito': {field: 'creditNote'},
        'Número factura': {field: 'ticketNumber'},
        'Número guía': {field: 'guideNumber'},
        'Fecha': {field: 'date'},
        'Tipo de orden': {field: 'deliveryType', func: (data)=>{ return data.deliveryType ? data.deliveryType : "No registra"}},
        'Detalle': {field: 'observations'},
        'Comentarios': {field: 'customerReviewComments'},
        'Estado': {field: 'status'},
        'Descripcion': {field: 'mediaDescription'},
        'Id item': {field: 'itemId'},
        'Código de barras': {field: 'barcode'},
        'Cantidad teorica': {field: 'theoricalQuantity'},
        'Cantidad real': {field: 'realQuantity'},
        'Precio unitario': {field: 'unitPrice'},
        'Total teorico': {field: 'totalTheorical'},
        'Total real': {field: 'totalReal'},
        'Descuento teorico': {field: 'theoricalDiscount'},
        'Descuento real': {field: 'realDiscount'},
        'Nombres de cliente': {field: 'customerFirstName'},
        'Apellidos de cliente': {field: 'customerLastName'},
        'Cédula de cliente': {field: 'customerDocument'},
        'Dirección de cliente': {field: 'customerAddress'},
        'Detalle dirección de cliente': {field: 'customerAddressDetails'},
        'Ciudad dirección de cliente': {field: 'customerAddressCityId'},
        'Id Tienda': {field: 'storeId'},
        'Nombre tienda': {field: 'storeName'},
        'Nombre del Proveedor': {field: 'providerName'},
    },
      modifications: [],
      nameReport: 'Ordenes_No_Express'
    }
    this.dataSearch = {
        direct: {
          url: this._rS.urls.ordersNoExpressReport,
          method: 'post',
          req: {}
        },
    }
  }

}

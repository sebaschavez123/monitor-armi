import { Component, OnInit } from '@angular/core';
import { ReportsService } from 'src/app/services/reports.service';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-report-assings',
  templateUrl: './report-assings.component.html',
  styleUrls: ['./report-assings.component.scss']
})
export class ReportAssingsComponent implements OnInit {

  dataAssigned:any;
  dataByAssigned:any;
  dataExport:any;
  dataSearch:any;
  dataSearchByAssgined:any;
  labelsPieOptions = {
    labelInterpolationFnc(value) {
      return value[0]
    },
  }
  responsiveOptions = [
    [
      'screen and (min-width: 640px)',
      {
        chartPadding: 30,
        labelOffset: 100,
        labelDirection: 'explode',
        labelInterpolationFnc(value) {
          return value
        },
      },
    ],
    [
      'screen and (min-width: 1024px)',
      {
        labelOffset: 80,
        chartPadding: 20,
      },
    ],
  ]

  constructor(public _rS:ReportsService,
              private _dS:DashboardService) { }

  ngOnInit(): void {
    this.initConfOptions();
    this._rS.getCountResumenOrders().subscribe((res:any)=>{
      this.dataAssigned = this.buildDataChart(res.assigned.couriers);
      this.dataByAssigned = this.buildDataChart(res.byAssigning.couriers);
    })
  }

  getTotal(series:Array<number>){
    let total = 0;
    for (let i = 0; i < series.length; i++) {
      total += series[i];      
    }
    return total;
  }

  private buildDataChart(data:Array<any>):any{
    let labels = [];
    let series = [];
    for (let i = 0; i < data.length; i++) {
      const el = data[i];
      if(el.total > 0){
        labels.push(el.courierName);
        series.push(el.total);
      }
    }
    return {labels, series};
  }

  private initConfOptions(){
    this.dataExport = {
      object: {
        'Número de Pedido': {field: 'orderId'},
        'Fecha de Creación': {field: 'createDate'},
        'Tiempo Transcurrido': {field: 'totalMins'},
        'Estado': {field: 'status'},
        'Método de Pago': {field: 'paymentMethod'},
        'Tienda': {field: 'storeName'},
        'Operador': {field: 'courierName'},
        'Ciudad/Municipio': {field: 'city'},
        'Nombre del Cliente': {field: 'customerName'},
        'Cédula del Cliente': {field: 'customerDocument'},
        'Teléfono del Cliente': {field: 'customerPhone'},
        'Nombre del Domiciliario': {field: 'messenger'},
        'Teléfono del Domiciliario': {field: 'messengerPhone'},
        'Id Tracking': {field: 'idTracking'},
        'Ruta Óptima': {fun: (x)=>{ return parseInt(x.multiStore) > 1 ? "SI" : "NO"}},
        'Comentario de cliente' : {field: 'countObs'}
      },
        modifications: [],
        nameReport: 'Ordenes_Asignadas'
    }
    this.dataSearch = {
      url: this._dS.urls.searchOrders,
      req: {'employeeNumber': this._dS.getLocalUser().employeeNumber },
      url_list: this._rS.urls.countOrder,
      req_list: {'_method': 'get'},
      method: 'get',
      mapList: (data)=>{ 
       let listArray =  data.assigned.couriers.map(x=>{return x.ordersId});
       let dataList = [];
       for (const listId of listArray) {
        dataList = dataList.concat(listId)
       }
       return dataList.map(x=> {return {orderId: x}});
      }
  }
  this.dataSearchByAssgined = {
    url: this._dS.urls.searchOrders,
    req: {'employeeNumber': this._dS.getLocalUser().employeeNumber },
    url_list: this._rS.urls.countOrder,
    req_list: {'_method': 'get'},
    method: 'get',
    mapList: (data)=>{ 
     let listArray =  data.byAssigning.couriers.map(x=>{return x.ordersId});
     let dataList = [];
     for (const listId of listArray) {
      dataList = dataList.concat(listId)
     }
     return dataList.map(x=> {return {orderId: x}});
    }
}
  }

}

import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { ExcelService } from '../../../services/excel.service';
import { ReportsService } from '../../../services/reports.service';

@Component({
  selector: 'app-report-cashier-detail',
  templateUrl: './report-cashier-detail.component.html',
  styleUrls: ['./report-cashier-detail.component.scss']
})
export class ReportCashierDetailComponent implements OnInit {

  fechaInicial: Date =  new Date();
  fechaFinal: Date =  new Date();
  es = {
    firstDayOfWeek: 1,
    dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
    dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
    dayNamesMin: [ "D","L","M","X","J","V","S" ],
    monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
    monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ],
    today: 'Hoy',
    clear: 'Borrar'
  }
  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Seleccionar todos',
    unSelectAllText: 'Quitar todos',
};
  stores:Array<any> = [];
  storesSelected:Array<any> = [];
  lstOrdersExcel = [];

  constructor(public _dS:DashboardService,
              private _rS:ReportsService,
              private excelService: ExcelService) { }

  ngOnInit() {
  }

  generarReporte(){
    this.lstOrdersExcel = [];
    let startDate = this.getDateFind(this.fechaInicial);
    let endDate = this.getDateFind(this.fechaFinal);

    this._rS.getOrdersDeclinedPayUReport(startDate, endDate, this.storesSelected.map(s=> {return {"storeId":s.id}}))
    .subscribe(async (res:any)=>{
      res.data = await Promise.all( res.data.map(async i =>{
        let res2:any = await this._rS.getEvidencesCahsDetail(i.orderId, i.cashierId).toPromise();
        i['evidences'] = res2.data ? res2.data.map(d =>{ return d.url_photo}).join(', ') : '';
        return i;
      }));
      for (let i = 0; i < res.data.length; i++) {
        const x = res.data[i];
        this.lstOrdersExcel.push({
          'Número de Pedido': x.orderId,
          'Fecha de Creación': x.createDate,
          'Dia': x.dia,
          'Nombre del Domiciliario': x.messengerName,
          'Teléfono del Domiciliario': x.messengerPhone,
          'Empresa de mensajería': x.courierName,
          'Tienda': x.storeName,
          'Nombre del cajero': x.cashierName,
          'Total': x.totalFacturaCaja,
          'Payu Teórico': x.mongoPayUTeorico,
          'Payu Real': x.montoPayUReal,
          'Dif payu': x.difPayU,
          'Resp payu': x.responsePayU,
          'Número de ticket': x.cashierId,
          'Facturado': x.esFacturado,
          'Evidencias': x.evidences
      })
      }
      this.generateXLS();
    })
    

    


  }

  generateXLS(){

    this.excelService.exportAsExcelFile(this.lstOrdersExcel, "DetalleCajero__");

  }

  getDateFind(fecha) {
    if(fecha === ""){
      var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('/');
    }else{
      var d = new Date(fecha),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('/');
    }
}

}

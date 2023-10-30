import { Component, OnInit } from '@angular/core';
import { ReportsService } from 'src/app/services/reports.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-report-sms',
  templateUrl: './report-sms.component.html',
  styleUrls: ['./report-sms.component.scss']
})
export class ReportSmsComponent implements OnInit {

  constructor(private _rS:ReportsService,
              private _eS:ExcelService) { }

  ngOnInit(): void {
  }

  reportGenerate(){

    this._rS.basicLoadPromise(
      this._rS.getReportSms().toPromise(),
      'Reporte Sms',
      'Se ha descargado exitosamente el reporte',
      'Error descagando reporte',
      (result, value) => {
        if(result) {
          this._eS.exportAsExcelFile(
            value.data.map(e => {
              return {
                'id cliente': e.customerId,
                'cliente': e.customerName,
                'documento': e.documentNumber,
                'email': e.email,
                'telefono': e.phone,
                'tienda': e.storeName,
                'orden': e.orderId,
                'fecha de creación': e.orderCreateDate,
                'orden status': e.orderStatusId,
                'comentarios de orden': e.orderDetails
              }
            }),
            'sms_report'
          )
        }
      }
    )
  }

}

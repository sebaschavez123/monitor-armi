import { Component, Input, OnInit } from '@angular/core';
import { ExcelService } from '../../../services/excel.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UtilsService } from '../../../services/utils.service';
import * as XLSX from 'xlsx';
import * as moment from 'moment-mini-ts';

@Component({
  selector: 'app-utils-massive-actions',
  templateUrl: './utils-massive-actions.component.html',
  styleUrls: ['./utils-massive-actions.component.scss']
})
export class UtilsMassiveActionsComponent implements OnInit {

  uploading = false;
  @Input() disabled:boolean = false;
  file: File;
  active_number:number = 1;
  private dataCsv:any;

  constructor(
    private _uS:UtilsService,
    private msg: NzMessageService,
    private excelService: ExcelService) { }

  ngOnInit(): void {
  }

  changeTab($event){
    this.active_number = $event.index + 1
  }

  get actionNameFuture():string {
    switch(this.active_number) {
      case 1:
        return 'Reprogramando';
      case 2:
        return 'Relanzando';
    }
  }

  get actionNamePast():string {
    switch(this.active_number) {
      case 1:
        return 'reprogramadas';
      case 2:
        return 'relanzadas';
    }
  }

  mapData(data:any):any {
    switch(this.active_number) {
      case 1:
        return data.map(x => {
            return {orderId: x[0], pickingDate: moment(x[1]).format('YYYY/MM/DD H:mm:ss')};
        });
      case 2:
        return data.map(x => {
            return {orderId: x[0]};
        });
    }
  }

  actionPromise(data:any):Promise<any> {
    switch(this.active_number) {
      case 1:
        return this._uS.scheduleMultiple(data).toPromise();
      case 2:
        return this._uS.launchMultiple(data).toPromise();
    }
  }

  validateData(data:any):boolean {
    switch(this.active_number) {
      case 1:
        return this.validateDataCsvReprog(data);
      case 2:
        return this.validateDataCsvRel(data);
    }
  }

  beforeUpload = (file: File): boolean => {
    if(this.disabled){
      this.msg.info('Esta acción no es permitida en este momento');
      return;
    }
    if(file.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
      this.msg.error('Solo puedes cargar archivos excel');
      return false;
    } 
    if (file.size / 1024 / 1024 > 10) {
      this.msg.error('Archivo muy pesado, solo se permiten hasta 10MB!');
      return false;
    }


    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e: any) => { 
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary', cellDates: true, dateNF: 'yyyy/mm/dd;@'});

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0]; 
      const ws: XLSX.WorkSheet = wb.Sheets[wsname]; 

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws, {header: 1}); // to get 2d array pass 2nd parameter as object {header: 1}
      if(this.validateData(data)){
        this.dataCsv = this.mapData(data);
        this._uS.basicLoadPromise(
          this.actionPromise(this.dataCsv),
          `${this.actionNameFuture} lista ordenes`,
          `Las ordenes han sido ${this.actionNamePast}`,
          `Ha ocurrido un error ${this.actionNameFuture} ordenes`,
          (success:boolean, res:any) => {
            if(success) this.downloadExcel(res.data);
          }
        )
      } else { 
        this.dataCsv = undefined;
        this.msg.error('El archivo presenta errores de datos');
      }
    }
    return;
  }

  private downloadExcel(data:any) {
    this.excelService.exportAsExcelFile(
      data.map((r:any) => {
        return {
          'Orden anterior': r.oldOrderId,
          'Orden Nueva': r.newOrderId,
          'Mensaje': r.message,
        }
      }),
      `Ordenes_${this.actionNamePast}`
    )
  }

  private validateDataCsvReprog(content) {
    var valid = true;

    var BreakException = {};

    try {
      content.forEach(function(line) {
        
        if (line == null || line.length == 0) {
          valid = false;
          throw BreakException;
        }
        
        if (line[0] == null) {
          valid = false;
          throw BreakException;
        }
        
        if (!line[1].getMonth()) {
          valid = false;
          throw BreakException;
        }

        if (!moment(line[1]).isAfter(moment(new Date()))) {
          valid = false;
          throw BreakException;
        }
      });
    } catch (e) {
      valid = false;
      if (e !== BreakException) throw e;
    }

    return valid;
  }

  private validateDataCsvRel(content) {
    var valid = true;

    var BreakException = {};

    try {
      content.forEach(function(line) {
        
        if (line == null || line.length == 0) {
          valid = false;
          throw BreakException;
        }
        
        if (line[0] == null) {
          valid = false;
          throw BreakException;
        }
      });
    } catch (e) {
      valid = false;
      if (e !== BreakException) throw e;
    }

    return valid;
  }

}

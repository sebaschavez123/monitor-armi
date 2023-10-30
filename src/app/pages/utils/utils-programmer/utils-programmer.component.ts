import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as XLSX from 'xlsx';
import * as moment from 'moment-mini-ts';
import { UtilsService } from '../../../services/utils.service';
import { ExcelService } from '../../../services/excel.service';

@Component({
  selector: 'app-utils-programmer',
  templateUrl: './utils-programmer.component.html',
  styleUrls: ['./utils-programmer.component.scss']
})
export class UtilsProgrammerComponent implements OnInit {

  uploading = false;
  @Input() disabled:boolean = false;
  file: File;
  private dataCsv:any;

  constructor(
    private _uS:UtilsService,
    private msg: NzMessageService,
    private excelService: ExcelService,
  ) { }

  ngOnInit(): void {
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
      if(this.validateDataCsv(data)){
        this.dataCsv = data.map(x => {
          return {orderId: x[0], pickingDate: moment(x[1]).format('YYYY/MM/DD H:mm:ss')};
        });
        this._uS.basicLoadPromise(
          this._uS.scheduleMultiple(this.dataCsv).toPromise(),
          'Reprogramando lista ordenes',
          'Las ordenes han sido reprogramadas',
          'Ha ocurrido un error reprogramando ordenes',
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
  };

  private downloadExcel(data:any) {
    this.excelService.exportAsExcelFile(
      data.map((r:any) => {
        return {
          'Orden anterior': r.oldOrderId,
          'Orden Nueva': r.newOrderId,
          'Mensaje': r.message,
        }
      }),
      'Ordenes_Reprogramadas'
    )
  }

  private validateDataCsv(content) {
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

}

import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { UtilsService } from '../../../services/utils.service';
import { countryConfig } from 'src/country-config/country-config';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ExcelService } from '../../../services/excel.service';
import * as XLSX from 'xlsx';
import * as moment from 'moment-mini-ts';

@Component({
  selector: 'app-utils-market-place',
  templateUrl: './utils-market-place.component.html',
  styleUrls: ['./utils-market-place.component.scss']
})
export class UtilsMarketPlaceComponent implements OnInit {

  formSwValidate = false;
  uploading = false;
  file: File;
  private dataCsv:any;
  disabled:boolean = false
  items: Array<any> = [];
  form = {
    delete: false,
    allStores: false,
    algolia: true,
    oracle: true,
    value: null,
  }

  countryConfig = countryConfig;

  constructor(public _dS:DashboardService,
              private _uS:UtilsService,
              private msg: NzMessageService,
              private excelService: ExcelService,) {

  }

  ngOnInit() {
    this.addItem();
  }

  addItem(){
    this.items.push({
      store: '',
      id: null
    });
  }

  deleteItem(index:number){
    this.items.splice(index, 1);
  }

  changeDelete(value: boolean) {
    if (countryConfig.isVenezuela) {
      this.form.allStores = value;
    }
  }

  save(){
    this.formSwValidate = true;
    if(this.validateItems()){
      this._uS.basicLoadPromise(
        this._uS.updateStock(this.items, this.form).toPromise(),
        'Actualizando stock',
        'Se ha actualizado correctamente el stock',
        'Error actualizado servicio'
      );
    }
  }

  delete(){
    this.formSwValidate = true;
    if(this.validateItems()){
      this._uS.basicLoadPromise(
        this._uS.deleteListProduct(this.items.map(i=>{return i.id})).toPromise(),
        'Actualizando stock',
        'Se ha actualizado correctamente el stock',
        'Error actualizado servicio'
      );
    }
  }

  validateItems():boolean{
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if(this.form.delete && item.id == null) return false;
      else if(!this.form.delete && ((!this.form.allStores && item.store === '') || item.id == null || this.form.value == null))
        return false;
    }
    return true;
  }

  private setInf(){
    this.items = [];
    this.form = {
      delete: false,
      allStores: false,
      algolia: true,
      oracle: true,
      value: null,
    }
    this.addItem();
    this.formSwValidate = false;
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
      data.splice(0,1);
      if(this.validateDataCsv(data)){
        this.dataCsv = data.map(x => {
          return {
            form: {
              // delete: false,
              allStores: x[1] == null,
              algolia: x[2] == 1,
              oracle: x[3] == 1,
              value: x[4],
            }, 
            items: x[1] == null ? [{id: x[0]}] : x[1].split(',').map((store) => {
              return {id: x[0], store: store.trim()}
            }
            )
          }
        });
        this._uS.basicLoadPromise(
          Promise.all(this.dataCsv.map((data)=> this._uS.updateStock(data.items, data.form).toPromise())),
          'Actualizando stock',
          'Los items han sido actualizados exitosamente',
          'Ha ocurrido un error actualizando items',
        )
      } else { 
        this.dataCsv = undefined;
        this.msg.error('El archivo presenta errores de datos');
      }
    }
    return;
  };

  private validateDataCsv(content) {
    var valid = true;

    var BreakException = {};

    try {
      content.forEach(function(line, i) {
          if (line == null || line.length == 0) {
            valid = false;
            throw BreakException;
          }
          
          if (line[0] == null) {
            valid = false;
            throw BreakException;
          }
          
          if (line[2] > 1) {
            valid = false;
            throw BreakException;
          }

          if (line[3] > 1) {
            valid = false;
            throw BreakException;
          }
          
          if (line[4] == null || line[4] < 0) {
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

  private downloadExcel(data:any) {
    this.excelService.exportAsExcelFile(
      data.map((r:any) => {
        return {
          'Orden anterior': r.oldOrderId,
          'Orden Nueva': r.newOrderId,
          'Mensaje': r.message,
        }
      }),
      'items_modificados'
    )
  }
}

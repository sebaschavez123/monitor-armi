import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
	providedIn: 'root'
  })
export class ExcelService {

	constructor() { }

	public exportAsExcelFile(json: any[], excelFileName: string): void {
	  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
	  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
	  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
	  this.saveAsExcelFile(excelBuffer, excelFileName);
	}

	public exportAsExcelFileCustomize(json: any, excelFileName: string): void {
	  
	  var sheets = {};
	  var titles = [];
	  var index = 0;
	  for (index = json.length - 1; index >= 0; --index) {
	  }

	  json.forEach((x, key) =>{
	  	var keyJson = Object.keys(x)[0];
	  	const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(x[keyJson]);
	  	sheets[keyJson] = worksheet;
	  	titles.push(keyJson);
	  });
	  const workbook: XLSX.WorkBook = { Sheets: sheets, SheetNames: titles };
	  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
	  this.saveAsExcelFile(excelBuffer, excelFileName);
	}

	private saveAsExcelFile(buffer: any, fileName: string): void {
	   const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
	   FileSaver.saveAs(data, fileName +  new  Date().getTime() + EXCEL_EXTENSION);
	}

}
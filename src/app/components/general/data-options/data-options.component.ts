import { Component, OnInit, Input } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import { OrderService } from '../../../services/order.service';
import { ExportsService } from 'src/app/services/exports.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { read, utils } from 'xlsx';

@Component({
  selector: 'general-data-options',
  templateUrl: './data-options.component.html',
  styleUrls: ['./data-options.component.scss']
})
export class DataOptionsComponent implements OnInit {

  uploading = false;
  file: File;
  private dataCsv:any;

  @Input() uploadGuide:any;
  @Input() export:Object;
  @Input() exportDetail:Object;
  @Input() exportDirect:Object;
  @Input() dataSearch:any;
  @Input() disabled:boolean = false;
  @Input() listData:Array<any>;
  @Input() contentUploadFull:boolean = false;
  @Input() btnLg:boolean = false;



  constructor(private _dS:DashboardService,
              private _eS:ExportsService,
              private msg: NzMessageService) { }

  ngOnInit(): void {}

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
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      const arrayBuffer = fileReader.result as ArrayBufferLike;
      const data = new Uint8Array(arrayBuffer);
      let arr = new Array();
      for(let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      const bstr = arr.join('');
      const workbook = read(bstr, {type:'binary'});
      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      const sheet_to_csv = utils.sheet_to_csv(worksheet);

      const arrayContentCsv = this.csvToArray(sheet_to_csv);
      if (arrayContentCsv == null) {
        this.msg.error('Archivo sin data');
        return false;
      }
      if (!this.validateDataCsv(arrayContentCsv)) {
        this.msg.error('Archivo contiene error en la data');
        return false;
      }
      this.dataCsv = arrayContentCsv;
      this.file = file;
      this.mergeDuplicate();
      this.handleUpload();
    }
    return true;
  };

  async handleUpload() {
    let ordersError = [];

    const ordersToSearch: any[] = this.dataCsv.filter(line => line[3] == 1);
    const ordersToFinalize: any[] = this.dataCsv.filter(line => line[3] != 1);

    const resSearch = await this.search(ordersToSearch.map(line => { return {orderId: line[0]} })) as any;

    if(resSearch?.data?.length > 0) {
      const arrayOrders: any[] = resSearch.data;

      ordersToSearch.forEach(async line => {
        const result = arrayOrders.find(order => order.orderId == line[0]);
        
        if(result){
          await this.add(line, result.customerPhone).then(
            (res: any) => {
            }, error => {
              ordersError.push(line[0]);
            });
        } else {
          return ordersError.push(line[0]);
        }
      });
    } else {
      return ordersError.push(null);
    }
    
    ordersToFinalize?.forEach(async line => {
      await this.finalize(line).then(
        (res: any) => {
        }, 
        error => {
          ordersError.push(line[0]);
        }
      );
    });

    if (ordersError.length > 0) {
      this.msg.error('Error actualizando algunas órdenes');
    } else {
      this.msg.success('Guías actualizadas exitosamente');
    }

    this.file = undefined;  

  }

  exportExcel(){
    this._eS.generate(this.dataSearch, false, this.export, this.listData)
  }

  exportDeatilExcel(){
    this._eS.generate(this.dataSearch, true, this.exportDetail, this.listData)
  }

  exportDirectExcel(){
    this._eS.generateDirect(this.dataSearch, this.exportDirect);
  }

  private csvToArray(csvString) {
    var lines = csvString.split('\n');
    if (lines.length == 0) 
      return null;

    var data = lines.splice(0).map(function (dataLine) { 
      return dataLine.split(','); 
    }).filter((dataLine) => dataLine != null && dataLine != "");

    if (data.length == 0) 
      return null;
    return data;
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
        
        if (line[0] == null || line[3] == null) {
          valid = false;
          throw BreakException;
        }

        if (line[3] != 1 && line[3] != 2) {
          valid = false;
          throw BreakException;
        }

        if (line[3] == 1) {
          if (line[1] == null || line[1] == '' || line[2] == null || line[2] == '') {
            valid = false;
            throw BreakException;
          }
        }
      });
    } catch (e) {
      valid = false;
      if (e !== BreakException) throw e;
    }

    return valid;
  }

  private mergeDuplicate() {
    for (var i = 0;i < this.dataCsv.length; i++) {
      for (var j = this.dataCsv.length - 1 ;j > i; j--) {
        if (this.dataCsv[i][0] == this.dataCsv[j][0] && this.dataCsv[i][3] == '1' && this.dataCsv[j][3] == '1') {
           this.dataCsv[i][1] = this.dataCsv[i][1] + "," + this.dataCsv[j][1];
           this.dataCsv.splice(j, 1);
         }

      }
    } 
  }

  private search(orders){
    return this._dS.post(this.uploadGuide.urlSearch, {orders, 'employeeNumber': this._dS.getLocalUser().employeeNumber}).toPromise();
  }

  private add(line, phoneCustomer){
    let data = {
      'orderId': line[0],
      'orderGuide': line[1],
      'courierId': line[2],
      phoneCustomer,
      'employeeNumber': this._dS.getLocalUser().employeeNumber,
      "rol": this._dS.getLocalUser().rolUser,
      "correoUsuario": this._dS.getLocalUser().email,
      "observation": '',
      "statusId": this.uploadGuide.statusId
    };
    if(this.uploadGuide.statusId == 25) data['update'] = line[4];
    return this._dS.post(this.uploadGuide.urlAdd, data).toPromise();
  }

  private sendMail(line){
    let data = {
      'orderId': line[0],
      'orderGuide': line[1],
      'courierId': line[2],
      'employeeNumber': this._dS.getLocalUser().employeeNumber
    };
    return this._dS.post(this.uploadGuide.urlSendMail, data).toPromise();   
  }

  private finalize(line){
    let data = {
      'orderId': line[0],
      "observation": '',
      "rol": this._dS.getLocalUser().rolUser,
      "correoUsuario": this._dS.getLocalUser().email,
      'employeeNumber':  this._dS.getLocalUser().employeeNumber,
      "statusId": 5,
    };
    return this._dS.post(this.uploadGuide.urlFinalize, data).toPromise(); 
  }

}

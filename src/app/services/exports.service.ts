import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { DashboardService } from './dashboard.service';
import { OrderService } from './order.service';
import { ExcelService } from './excel.service';
import { DownloadStatusEvent } from '../event-listeners/download-status.event';
import { firstValueFrom } from 'rxjs';
declare var $:any;

@Injectable({
  providedIn: 'root'
})
export class ExportsService extends BaseService{

  private detail:boolean;
  private list:Array<any>
  private loadNumber:number = 0;
  private lstOrdersExcel:Array<any> = [];
  private dataExport:any;
  private dataSearch:any;
  private pagination:number = 50
  private swalRef;


  constructor(http:HttpClient,
                private _dS:DashboardService,
                private downloadStatus : DownloadStatusEvent,
                private excelService: ExcelService) {
      super(http)
  }

  generate(dataSearch:any, detail:boolean, dataExport:Object, list?:Array<any>){
    this.dataSearch = dataSearch;
    this.detail = detail;
    this.list = list ? list : null;
    this.dataExport = dataExport;
    this.loadNumber = 0;
    this.lstOrdersExcel = [];
    this.list && this.list.length > 0 ? this.reportNormal() : this.loadList();
  }

  generateDirect(dataSearch:any, dataExport:Object){
    console.log(dataSearch, dataExport);
    this.dataSearch = dataSearch;
    this.dataExport = dataExport;
    this.loadNumber = 0;
    this.lstOrdersExcel = [];
    this.reportDirect();
  }

  private reportDirect(){
    console.log('tambien entro aki!!');
    Swal.fire({
      title: 'Buscando datos',
      text: 'El sistema está buscando la información',
      showCancelButton: false,
      showConfirmButton:false,
      onBeforeOpen: ()=>{
        Swal.showLoading();
        return firstValueFrom(
          this.getMethod(this.dataSearch.direct.method, this.dataSearch.direct.url, this.dataSearch.direct.req)
        ).then((rta:any)=>{
          setTimeout(() => {
            Swal.hideLoading();
            Swal.close();            
          }, 1500);
          let data = rta.data;
          if(this.dataExport.filter) data = this.dataExport.filter(data);
          this.lstOrdersExcel = data.map(i =>{return this.getObject(i)});
          this.generateXLS();
        }, error=>{
          console.log('tambien entro aca', error); 
          Swal.close();
          this.retry();
        })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((res:any)=>{}); 
  }

  private reportNormal(){
    Swal.fire({
        title: 'Exportar',
        text: 'Se encontraron ' + this.list.length + ' registro(s), la exportación puede demorar tiempo dependiendo de la cantidad de registros. ¿Desea exportalos?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.value) {
          if(this.dataSearch.url || this.dataSearch.url_detail) this.loadPromise( this.detail ? this.getOrdersDetailArray() : this.getOrdersArray(), "Exportación exitosa");
          else this.loadPromise(this.getDataArray(), "Exportación exitosa");
        }
     });
  }

  private loadList(){
    Swal.fire({
      title: 'Buscando registros',
      text: 'El sistema está buscando los registros',
      showCancelButton: false,
      showConfirmButton:false,
      onBeforeOpen: ()=>{
        Swal.showLoading();
        return this.getMethod(this.dataSearch && this.dataSearch.method ? this.dataSearch.method : 'post', this.dataSearch.url_list, this.dataSearch.req_list).toPromise().then((rta:any)=>{
          Swal.hideLoading();
          Swal.close();
          this.list = this.dataSearch.mapList ? this.dataSearch.mapList(rta) : rta.data;
          if(this.dataSearch.url) this.loadPromise( this.detail ? this.getOrdersDetailArray() : this.getOrdersArray(), "Exportación exitosa");
          else this.loadPromise(this.getDataArray(), "Exportación exitosa");
        }, error=>{
          Swal.close();
          this.retry();
        })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((res:any)=>{});
  }

  private loadPromise(promise:Promise<any>, successMjs:string){ 
    this.swalRef = Swal.fire({
      title: 'Generando reporte!',
      text: 'Generando '+this.loadNumber+' de '+ this.list.length,
      showCancelButton: false,
      showConfirmButton:false,
      onBeforeOpen: ()=>{
        Swal.showLoading();
        return promise.then((rta:any)=>{
          Swal.hideLoading();
          Swal.close();
          Swal.fire("", successMjs, "success");
          this.generateXLS();
        }, error=>{
          Swal.close();
          this.retry();
        })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((res:any)=>{});
  }

  

  private retry(){
    if(this.lstOrdersExcel.length == 0){
      Swal.fire('Error', 'Ha ocurriedo un error, vuelva a intentarlo o reportelo.', 'error');
      return;
    }
    Swal.fire({
        title: 'Confirmación',
        text: 'Se generaron '+(this.lstOrdersExcel.length)+' de '+ this.list.length +' registro(s), ¿Desea exportalos?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Reintentar',
        showCloseButton: true,
      }).then((result) => {
        if (result.value) {
          this.generateXLS();
        }else if(result.dismiss === Swal.DismissReason.cancel){
            this.loadNumber = 0;
            this.lstOrdersExcel = [];
            this.loadPromise( this.detail ? this.getOrdersDetailArray() : this.getOrdersArray(), "Exportación exitosa");
        }
      });
}

async getDataArray():Promise<any> {
  return new Promise(async (resolve, reject) => {
      while(this.loadNumber < this.list.length){
          let data = this._dS.getJsonOrderIds(this.loadNumber, this.list, this.pagination);
          let jsonOrder = await Promise.all(data.map(async x =>{
            for (let i = 0; i < this.dataExport.modifications.length; i++) {
                const m = this.dataExport.modifications[i];
                if(m.func) x[m.field] = m.func(x);
                else if(m.promise && typeof x == 'object') x[m.field] = await m.promise(x);
                else if(m.promise && (typeof x == 'string' || typeof x == 'number')) x = await m.promise(x);
            }
            return this.getObject(x);
         }));
         this.lstOrdersExcel = this.lstOrdersExcel.concat(jsonOrder);   
          this.loadNumber+=this.pagination;
          $('#swal2-content').html('Generando '+this.loadNumber+' de '+ this.list.length);
      }
      resolve(this.lstOrdersExcel)
  });
}

  async getOrdersArray():Promise<any> {
    let req = this.dataSearch.req;
    return new Promise(async (resolve, reject) => {
        while(this.loadNumber < this.list.length){
            req['orders'] = this._dS.getJsonOrderIds(this.loadNumber, this.list, this.pagination);
            await this.post(this.dataSearch.url, req).toPromise().then(
                async (rta:any) => {
                    let jsonOrder = await Promise.all(rta.data.map(async x =>{
                        for (let i = 0; i < this.dataExport.modifications.length; i++) {
                            const m = this.dataExport.modifications[i];
                            if(m.func) x[m.field] = m.func(x);
                            else if(m.promise && typeof x == 'object') x[m.field] = await m.promise(x);
                            else if(m.promise && (typeof x == 'string' || typeof x == 'number')) x = await m.promise(x);
                        }
                        return this.getObject(x);
                     }));
                     this.lstOrdersExcel = this.lstOrdersExcel.concat(jsonOrder);
                }, error =>{
                    reject();
                });    
            this.loadNumber+=this.pagination;
            $('#swal2-content').html('Generando '+this.loadNumber+' de '+ this.list.length);
        }
        resolve(this.lstOrdersExcel)
    });
  }

  async getOrdersDetailArray():Promise<any> {
    let req = this.dataSearch.req;
    let url = this.dataSearch.url_detail ? this.dataSearch.url_detail : this.dataSearch.url;
    return new Promise(async (resolve, reject) => {
        while(this.loadNumber < this.list.length){
            req['orders'] = this._dS.getJsonOrderIds(this.loadNumber, this.list, this.pagination);
            await this.post(url, req).toPromise().then(
                async (rta:any) => {
                    let jsonOrder = [];
                     let orders = await Promise.all(rta.data.map(async x =>{
                        for (let i = 0; i < this.dataExport.modifications.length; i++) {
                            const m = this.dataExport.modifications[i];
                            if(m.func) x[m.field] = m.func(x);
                            else if(m.promise) x[m.field] = await m.promise(x);
                        }
                        return x;
                    }));
                    for (let z = 0; z < orders.length; z++) {
                        const x = orders[z];
                        for (let i = 0; i < this.dataExport.extras.length; i++) {
                            let extra = this.dataExport.extras[i];
                            if(extra.for){
                                for (let j = 0; j < x[extra.name][extra.for].length; j++) {
                                    const item =  x[extra.name][extra.for][j];
                                    jsonOrder.push(this.getObjectDetail(x, item, extra.object, x[extra.name]));
                                }
                                jsonOrder.push(this.getObject(x));  
                            }else{
                                for (let j = 0; j < x[extra.name].length; j++) {
                                    const item = x[extra.name][j];
                                    jsonOrder.push(this.getObjectDetail(x, item, x[extra.name].object));
                                }
                                jsonOrder.push(this.getObject(x));  
                            }                          
                        }                        
                    }
                    this.lstOrdersExcel = this.lstOrdersExcel.concat(jsonOrder);
                }, error =>{
                    reject();
                });  
                this.swalRef  
            this.loadNumber+=this.pagination;
            $('#swal2-content').html('Generando '+this.loadNumber+' de '+ this.list.length);
        }
        resolve(this.lstOrdersExcel)
    });
  }

    private getObject(x){
        let obj = {};
        Object.keys(this.dataExport.object).forEach((i)=>{
            let data = this.dataExport.object[i];
            if(data == null || data == undefined) obj[i] = "";
            else if(data.fun) obj[i] = data.fun(x);
            else if(data.field) obj[i] = x[data.field];
            else obj[i] = data;
        })
        return obj;
    }

    private getObjectDetail(x, item, object, detail?){
        let obj = {};
        Object.keys(object).forEach((i)=>{
            let data = object[i];
            if(data.fun) obj[i] = data.fun(x,item);
            else if(data.field) obj[i] = x[data.field];
            else if(data.item) obj[i] = item[data.item];
            else if(data.detail && detail) obj[i] = detail[data.detail];
            else obj[i] = data;
        })
        return obj;
    }

    private generateXLS(){
      this.excelService.exportAsExcelFile(this.lstOrdersExcel, this.dataExport.nameReport+"__");    
    }

    private getMethod(method:string = 'post', url, params){
      switch(method){
        case 'get':
          return this._dS.get(url);
        case 'post':
          return this._dS.post(url, params);
      }

    }
}

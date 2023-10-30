import { Component, OnInit } from '@angular/core';
import { NzI18nService, es_ES } from 'ng-zorro-antd/i18n';
import { CustomerService } from '../../../services/customer.service';
import * as moment from 'moment-mini-ts';
import { Customer } from '../../../core/interfaces';

@Component({
  selector: 'app-customer-removed',
  templateUrl: './customer-removed.component.html',
  styleUrls: ['./customer-removed.component.scss']
})
export class CustomerRemovedComponent implements OnInit {

  dateRange:Array<any> = [];
  dataExport:any;
  dataSearch:any;
  customers:Array<Customer>;
  loading_search:boolean = false;
  cols = [];

  constructor(private _cS:CustomerService,
              private i18n: NzI18nService) { }

  ngOnInit(): void {
    this.i18n.setLocale(es_ES);
    this.initConfOptions();
    this.cols = this._cS.getCols();
    this.cols.splice(7,0, {
        name: 'comments',
        header: 'Comentario',
        label: 'Comentario',
        sortOrder: null,
        sortFn: (firstName: string, item: any) => item.firstName.indexOf(firstName) !== -1
    })
  }

  changeValues(){
    this.dataSearch.req_list = this.getRequest();
  }

  private getRequest(){
    let req = {};
    req['startDate'] = moment(this.dateRange[0]).format('YYYY/MM/DD');
    req['endDate'] = moment(this.dateRange[1]).format('YYYY/MM/DD');
    
    return req;
  }

  search(){
    this.loading_search = true;
    this._cS.getDeletedCustomers(this.getRequest()).subscribe((res:any)=>{
      this.loading_search = false;
      this.customers = res.data.map((x)=>{return JSON.parse(x.reason)})
    }, error =>{this.loading_search = false;})
  }

  private initConfOptions(){
    this.dataExport = {
        object: {
          'Id': {field: 'id'},
          'Fecha de eliminación': {field: 'deletedDate'},
          'Nombre': {fun: (x)=>{ return x.customer.firstName+' '+x.customer.lastName}},
          'Documento': {fun: (x)=>{ return x.customer.documentNumber}},
          'Correo': {fun: (x)=>{ return x.customer.email}},
          'Telefono': {fun: (x)=>{ return x.customer.phone}},
          'atomId': {fun: (x)=>{ return x.customer.atomId}},
          'Comentario': {field: 'comments'},
        },
        modifications: [
          {
            field: 'customer',
            promise: async (x) => {
              return JSON.parse(x.reason)
            }
          }
        ],
        nameReport: 'Clientes_Eliminados'
    }
    this.dataSearch = {
      url_list: this._cS.urls.listDeletedCustomer,
      req_list: {},
  }
  }

}

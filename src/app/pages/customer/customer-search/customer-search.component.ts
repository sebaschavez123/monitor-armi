import { Component, OnInit } from '@angular/core';
import { Customer } from '../../../core/interfaces';
import { CustomerService } from '../../../services/customer.service';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.scss']
})
export class CustomerSearchComponent implements OnInit {

  searchOptions:Array<any> = [];
  customers:Array<Customer>;
  searchParams = {option: 'documentNumber', text:''};
  loadingSearch = false;
  openDetailSubscription = false;
  noCustomer = false;
  urlImageError = 'https://lh3.googleusercontent.com//exTrlxb4DDDXvPfaRL_RJL0cncl69eWW1vUf2J_DiIf2b7mstsK1Haj7vrfmhI7dcKUV5dsVC15tvm1llwJ_4DdNDBV8tvpP5A'


  constructor(private _cS:CustomerService,
              private _dS:DashboardService) {
    this.searchOptions = [
      {name:'Documento', field:'documentNumber'},
      {name:'Correo', field:'email'},
      {name:'Télefono', field:'phone'}
    ];
  }

  ngOnInit(): void {
  }

  search(){
    this.loadingSearch = true;
    this.noCustomer = false;
    this.customers = undefined;
    this._cS.getByParam(this.searchParams.option,this.searchParams.text).subscribe(async (res:any) => { 
      const customers = [];
      if(!res.data || res.data.length == 0) {
        this.loadingSearch = false;
        this.noCustomer = true;
        return;
      }
      for (let i = 0; i < res.data.length; i++) {
        const customer = res.data[i];
        if (customer.id) {
          let isBlocked = false;
          try {
            const resBlocked:any = await this._cS.isBlocked(customer.id).toPromise();
            isBlocked = resBlocked.confirmation;

            
          }catch(err){}
          customer.blocked = isBlocked;
          customers.push(customer);
        } 
      }
      this.customers = customers;
      this.loadingSearch = false;
    },
    error => {
        this.customers = [];
        this.loadingSearch = false;
    });
  }

  get customer(){
    return this.customers && this.customers.length > 0 ? this.customers[0] : null;
  }

  validateSearch(){
    return this.searchParams.option && this.searchParams.text !== '';
  }

}

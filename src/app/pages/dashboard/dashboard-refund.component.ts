import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { SoundsService } from '../../services/sounds.service';
import { countryConfig } from 'src/country-config/country-config';
import { data } from 'jquery';

@Component({
  selector: 'app-dashboard-refund',
  template: `
    <general-orders-table 
      [cols]="cols" orderType="REFUND"
      [listOfAllData]="lstOrders"
      (refresh)="getData()">
    </general-orders-table>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardRefundComponent implements OnInit, OnDestroy {

  cols:Array<any> = [];
  lstOrders:Array<any> = [];
  subTimeout:any;
  



  constructor(private _dS:DashboardService,
              private sounds:SoundsService,
              private toastr: ToastrService) {
    this._dS.event.subscribe(event=>{
      switch (event.type){
        case 'init-stores':
          const stores = this._dS.stores;
          if(!stores) {
            this.cols.filter(i => i.name === 'storeNameCity')[0].listOfFilter = 
              stores.map(x=>{ return { text: x.name, value: x.name }});
          }
          break;
          case 'init-paymentsMethod':
            this.cols.filter(i => i.name === 'pm')[0].listOfFilter = this._dS.paymentsMethod
            .map(x=>{ return { text: x.description, value: x.description }})
          break;
          case 'init-couriers':
            this.cols.filter(i => i.name === 'courierName')[0].listOfFilter = this._dS.couriers
            .map(x=>{ return { text: x.name, value: x.name }})
          break;
      }
    });
  }

  ngOnInit() {
    this.initCols();
    this.getData();
    
  }

  ngOnDestroy(): void {
    clearInterval(this.subTimeout);
  }

  getData() {
    clearInterval(this.subTimeout);
    this.searchData();
    this.subTimeout = setInterval(()=>{this.searchData();},30000);
  }

  private searchData(){
    const toast = this.toastr.info('Sincronizando Dashboard...', null, {
      tapToDismiss: false,
      disableTimeOut: true
    });
    this._dS.getOrders20JSON('REFUND').subscribe({
      next: (rta:any) => {
        let lstOrders = rta.data.map(x => {
          x.storeNameCity = '<u>'+ x.storeName + '</u> ' + x.city;
          x.orderDeliveryType = 'REFUND';
          x.messengerPhoneCountry = x.messengerPhone != null ? countryConfig.phoneCode+x.messengerPhone : '';
          x.opticalRoute = this._dS.getInfOpticalRoute(x);
          x.pm = this._dS.getPaymentMethod(x);
          x.countObs = x.totalObservationsOrder ? !isNaN(parseFloat(x.totalObservationsOrder)) &&
          // tslint:disable-next-line: radix
          isFinite(x.totalObservationsOrder) ? parseInt(x.totalObservationsOrder) : 0 : 0;
          return x;
        });
        this.lstOrders = lstOrders;
        toast.toastRef.manualClose();
        // this.sounds.notification();
        this.toastr.success('Dashboard Sincronizando', null);
      },
      error: () => {
        toast.toastRef.manualClose();
        this.toastr.error('No se pudo sincronizar dashboard', null);
      }
    });
  }

  indicatorsfilters(listOfItems: Array<any>, filters: any) {
    if(filters == undefined || filters.filter( (f) => f.key == 'indicators' ).length > 0) {
      return listOfItems;
    }
    return listOfItems.filter((element) => {
      return element.multiStore <=1
        && element.exceedKilometers != 'TRUE'
        && element.isHighPriceOrder != 'TRUE'
        && element.exceedWeight != 'TRUE'
        && element.exceedVolume != 'TRUE';
    });
  }

  private initCols(){
      this.cols = this._dS.getCols();
      this.cols.unshift(
        {
          name: 'Indicadores',
          header: 'Indicadores',
          label: 'Indicadores',
          key: 'indicators',
          filterMultiple: true,
          filterOnly: true,
          listOfFilter: [
            {text: 'Kilometraje excedido', value: 'km'},
            {text: 'Alto precio', value: 'price'},
            {text: 'Transferencia', value: 'transfer'},
            {text: 'Peso', value: 'weight'},
            {text: 'Volumen', value: 'valume'},
          ],
          filterFn: this.isIndicator
        }
      );
  }

  isIndicator (indicator: string, item: any) {
    switch(indicator){
      case 'km':
        return item.exceedKilometers == 'TRUE';
      case 'price':
        return item.isHighPriceOrder == 'TRUE';
      case 'transfer':
        return item.multiStore > 1;
      case 'weight':
        return item.exceedWeight == 'TRUE';
      case 'volume':
        return item.exceedVolume == 'TRUE';
    }
  }

}



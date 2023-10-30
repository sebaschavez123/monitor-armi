import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { countryConfig } from 'src/country-config/country-config';

@Component({
  selector: 'app-dashboard-negative-rating',
  template: `
    <general-orders-table 
      [cols]="cols" orderType="NEGATIVE_RATING"
      [listOfAllData]="lstOrders"
      (refresh)="getData()">
    </general-orders-table>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardNegativeRatingComponent implements OnInit, OnDestroy {

  cols:Array<any> = [];
  lstOrders:Array<any> = [];
  subTimeout:any;

  get userRol() {
    return this._dS.getLocalUser()?.rolUser;
  }
  
  constructor(private _dS:DashboardService,
              private toastr: ToastrService) {
    this._dS.event.subscribe(event=>{
      switch (event.type){
        case 'init-stores':
          const stores = this._dS.stores;
          if(!stores) {
            this.cols.filter(city => city.name === 'storeNameCity')[0].listOfFilter = 
              stores.map(store=>{ return { text: store.name, value: store.name }});
          }
          break;
          case 'init-paymentsMethod':
            this.cols.filter(payment => payment.name === 'pm')[0].listOfFilter = this._dS.paymentsMethod
            .map(paymentMethod=>{ return { text: paymentMethod.description, value: paymentMethod.description }})
          break;
          case 'init-couriers':
            this.cols.filter(courier => courier.name === 'courierName')[0].listOfFilter = this._dS.couriers
            .map(courierDescription=>{ return { text: courierDescription.name, value: courierDescription.name }})
          break;
          default:
          return false;
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
    this._dS.getOrders20JSON('NEGATIVE_RATING').subscribe({
      next: (rta:any) => {
        let seed = this.filterData(rta.data);
        let lstOrders = seed.map(order => { 
          order.storeNameCity = '<u>'+ order.storeName + '</u> ' + order.city;
          order.orderDeliveryType = 'NEGATIVE_RATING';
          order.messengerPhoneCountry = order.messengerPhone != null ? countryConfig.phoneCode+order.messengerPhone : '';
          order.opticalRoute = this._dS.getInfOpticalRoute(order);
          order.pm = this._dS.getPaymentMethod(order);
          order.countObs = order.totalObservationsOrder 
            ? (!isNaN(parseFloat(order.totalObservationsOrder)) && isFinite(order.totalObservationsOrder) )
              ? parseInt(order.totalObservationsOrder) : 0
            : 0;
          return order;
        });
        this.lstOrders = lstOrders;
        toast.toastRef.manualClose();
        this.toastr.success('Dashboard Sincronizando', null);
      },
      error: () => {
        toast.toastRef.manualClose();
        this.toastr.error('No se pudo sincronizar dashboard', null);
      }
    });
  }

  filterData(originalData: any[]) {
    if(countryConfig.isColombia && this.userRol == 'PICKER RAPPICARGO' ){
      return originalData.filter((ord) => ord.courierName == 'RAPPICARGO');
    }
    else {
      return [...originalData];
    }
  }

  indicatorsfilters(listOfItems: Array<any>, filters: any) {
    if(countryConfig.isVenezuela) { return listOfItems; }
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
        return item.exceedKilometers === 'TRUE';
      case 'price':
        return item.isHighPriceOrder === 'TRUE';
      case 'transfer':
        return item.multiStore > 1;
      case 'weight':
        return item.exceedWeight === 'TRUE';
      case 'volume':
        return item.exceedVolume === 'TRUE';
      default:
        return false;
    }
  }

}



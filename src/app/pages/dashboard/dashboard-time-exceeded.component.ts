import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { SoundsService } from '../../services/sounds.service';
import { countryConfig } from 'src/country-config/country-config';

@Component({
  selector: 'app-dashboard-time-exceeded',
  template: `<general-orders-table [cols]="cols" orderType="TIMES_EXCEEDED" [listOfAllData]="lstOrders" (refresh)="getData()" ></general-orders-table>`,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardTimeExceededComponent implements OnInit, OnDestroy {

  cols:Array<any> = [];
  lstOrders:Array<any> = [];
  subTimeout:any;
  



  constructor(private _dS:DashboardService,
              private sounds:SoundsService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.initCols();
    this.getData();
    this._dS.event.subscribe(event=>{
      switch (event.type){
        case 'init-stores':
          this.cols.filter(i => i.name === 'storeNameCity')[0].listOfFilter = this._dS.stores
          .map(x=>{ return { text: x.name, value: x.name }})
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
    })
  }

  ngOnDestroy(): void {
    clearInterval(this.subTimeout);
  }

  getData() {
    clearInterval(this.subTimeout);
    this.searchData();
    this.subTimeout = setInterval(()=>{this.searchData();},60000);
  }

  private searchData(){
    const toast = this.toastr.info('Sincronizando Dashboard...', null, {
      tapToDismiss: false,
      disableTimeOut: true
    });
    this._dS.getOrders20JSON('TIMES_EXCEEDED').subscribe(
    (rta:any) => {
      let lstOrders = rta.data.map(x =>{
        x.storeNameCity = '<u>'+ x.storeName + '</u> ' + x.city;
        x.messengerPhoneCountry = x.messengerPhone != null ? countryConfig.phoneCode+x.messengerPhone : '';
        x.opticalRoute = this._dS.getInfOpticalRoute(x);
        x.pm = this._dS.getPaymentMethod(x);
        x.countObs = x.totalObservationsOrder ? !isNaN(parseFloat(x.totalObservationsOrder)) &&
        isFinite(x.totalObservationsOrder) ? parseInt(x.totalObservationsOrder) : 0 : 0;
        return x;
      });
      if (this._dS.getLocalUser().rolUser === 'PICKER'){
        lstOrders = lstOrders.filter(x => x.storeId.trim() === String(this._dS.getLocalUser().storeId));
      }
      this.lstOrders = lstOrders;
      toast.toastRef.manualClose();
      // this.sounds.notification();
      this.toastr.success('Dashboard Sincronizando', null);
    },
    error => {
      toast.toastRef.manualClose();
      this.toastr.error('No se pudo sincronizar dashboard', null)
    });
  }

  private initCols(){
    this.cols = this._dS.getCols();
  }



}



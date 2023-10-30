import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { SoundsService } from '../../services/sounds.service';
import { countryConfig } from 'src/country-config/country-config';

@Component({
  selector: 'app-dashboard-optimal-route',
  template: `<general-orders-table [cols]="cols" orderType="SPECIALS" [listOfAllData]="lstOrders" (refresh)="getData()" [defaultFn]="defaultFn" ></general-orders-table>`,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardSpecialsComponent implements OnInit, OnDestroy {

  cols:Array<any> = [];
  lstOrders:Array<any> = [];
  subTimeout:any;
  
  filterIndicator:Array<any> = [];



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
          this.cols.filter(i => i.name == 'storeNameCity')[0].listOfFilter = this._dS.stores.map(x=>{ return { text: x.name, value: x.name }})
          break;
          case 'init-paymentsMethod':
            this.cols.filter(i => i.name == 'pm')[0].listOfFilter = this._dS.paymentsMethod.map(x=>{ return { text: x.description, value: x.description }})
          break;
          case 'init-couriers':
            this.cols.filter(i => i.name == 'courierName')[0].listOfFilter = this._dS.couriers.map(x=>{ return { text: x.name, value: x.name }})
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
    let toast = this.toastr.info("Sincronizando Dashboard...", null, {
      tapToDismiss: false,
      disableTimeOut: true
    });
    this._dS.getOrders20JSON('SPECIALS').subscribe(
    (rta:any) => {
      let lstOrders = rta.data.map(x => {
        x.storeNameCity = "<u>"+ x.storeName + "</u> " + x.city;
        x.messengerPhoneCountry = x.messengerPhone != null? countryConfig.phoneCode+x.messengerPhone : "";
        x.opticalRoute = this._dS.getInfOpticalRoute(x);
        x.pm = this._dS.getPaymentMethod(x);
        x.countObs = x.totalObservationsOrder ? !isNaN(parseFloat(x.totalObservationsOrder)) && isFinite(x.totalObservationsOrder) ? parseInt(x.totalObservationsOrder) : 0 : 0;
        return x;
      });
      if (this._dS.getLocalUser().rolUser == "PICKER") lstOrders = lstOrders.filter(x => x.storeId.trim() == String(this._dS.getLocalUser().storeId));
      this.lstOrders = lstOrders;
      toast.toastRef.manualClose();
      this.toastr.success("Dashboard Sincronizando", null);
    },
    error => {
      toast.toastRef.manualClose();
      this.toastr.error("No se pudo sincronizar dashboard", null)
    });
  }

  private initCols(){
    this.filterIndicator = [
        {text: 'Kilometraje excedido', value: 'km'},
        {text: 'Alto precio', value: 'price'},
        {text: 'Transferencia', value: 'transfer'},
        {text: 'Peso', value: 'weight'},
        {text: 'Volumen', value: 'volume'},
    ]
    this.cols = this._dS.getCols();
    this.cols.unshift({
      name: 'Indicadores',
      header: 'Indicadores',
      label: 'Indicadores',
      key: 'indicators',
      filterMultiple: true,
      filterOnly: true,
      byDefault: true,
      listOfFilter: this.filterIndicator,
      filterFn: (indicator: string, item: any) => {
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
    });
  }

  defaultFn(list: any[], filters: any[] = []) {
    return list.filter((item:any) => {
      return item.exceedKilometers == 'TRUE'
        || item.isHighPriceOrder == 'TRUE'
        || item.multiStore > 1
        || item.exceedWeight == 'TRUE'
        || item.exceedVolume == 'TRUE'
    });
  }
}

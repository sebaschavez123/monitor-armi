import { Component, OnInit, OnDestroy, AfterContentChecked } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { SoundsService } from '../../../services/sounds.service';
import { Subscription } from 'rxjs';
import { deliveryTypes } from 'src/app/core/const';
import { countryConfig } from 'src/country-config/country-config';

@Component({
  selector: 'app-dashboard-canceled-nat-send-now',
  template: `<general-orders-table [cols]="cols" [listOfAllData]="lstOrders" (refresh)="getData()" [typeReport]="'canceled'" ></general-orders-table>`,
  styleUrls: ['./../dashboard.component.scss']
})
export class DashboardCanceledNatSendNowComponent implements OnInit, OnDestroy {

  cols:Array<any> = [];
  lstOrders:Array<any> = [];
  subTimeout:any;
  
  types = [
    {label: 'Nacional', value: 'Nacional'},
    {label: 'Envíalo ya', value: 'Envialo ya'},
  ]
  promise: Subscription;


  constructor(private _dS:DashboardService,
              private sounds:SoundsService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.initCols();
    this.getData();
  }

  ngOnDestroy(): void {
    clearInterval(this.subTimeout);
    this.promise.unsubscribe();
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
    this.promise = this._dS.getOrders20JSON('CANCELED_NO_EXPRESS').subscribe(
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
          // this.sounds.notification();
          this.toastr.success("Dashboard Sincronizando", null);
    },
    error => {
      toast.toastRef.manualClose();
      this.toastr.error("No se pudo sincronizar dashboard", null)
    });
  }

  private initCols(){
    this.cols = this._dS.getCols();
    this.cols.splice(3, 0, {
      name: 'deliveryType',
      header: 'Tipo',
      label: 'Tipo',
      sortOrder: null,
      sortFn: (a: any, b: any) => String(a.deliveryType).localeCompare(String(b.deliveryType)),
      filterMultiple: true,
      listOfFilter: deliveryTypes.map(x=>{ return { text: x.label, value: x.value }}),
      filterFn: (value: string, item: any) => item.deliveryType.indexOf(value) !== -1
    })
    this.cols.splice(10, 1)
  }



}

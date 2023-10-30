import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { SoundsService } from '../../services/sounds.service';
import { deliveryTypes } from 'src/app/core/const';
import * as _ from 'underscore';
import { NzMessageService } from 'ng-zorro-antd/message';
import { countryConfig } from 'src/country-config/country-config';

@Component({
  selector: 'app-dashboard-rx',
  template: `<general-orders-table [cols]="cols" orderType="RX" [listOfAllData]="lstOrders" (refresh)="getData()" [typeReport]="'rx'" 
  [exportPdf]="false" [missings]="true"></general-orders-table>`,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardRxComponent implements OnInit, OnDestroy {

  cols:Array<any> = [];
  lstOrders:Array<any> = [];
  subTimeout:any;
  toast:any;
  



  constructor(private _dS:DashboardService,
              private sounds:SoundsService,
              private msg: NzMessageService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.initCols();
    this.getData();
  }

  ngOnDestroy(): void {
    clearInterval(this.subTimeout);
    this.toast.toastRef.manualClose();
  }

  getData() {
    clearInterval(this.subTimeout);
    this.searchData();
    this.subTimeout = setInterval(()=>{this.searchData();},60000);
  }

  private searchData(){
    this.toast = this.toastr.info("Sincronizando Dashboard...", null, {tapToDismiss: false,disableTimeOut: true});
    this._dS.getOrders20JSON('RX').subscribe(
    (rta:any) => {
        let lstOrders = rta.data.map(x => {
            x.pickingDateTime = x.pickingDate + ' '+ x.pickingHour;
            x.storeNameCity = "<u>"+ x.storeName + "</u> " + x.city;
            x.messengerPhoneCountry = x.messengerPhone != null? countryConfig.phoneCode+x.messengerPhone : "";
            x.opticalRoute = this._dS.getInfOpticalRoute(x);
            x.pm = this._dS.getPaymentMethod(x);
            x.countObs = x.totalObservationsOrder ? !isNaN(parseFloat(x.totalObservationsOrder)) && isFinite(x.totalObservationsOrder) ? parseInt(x.totalObservationsOrder) : 0 : 0;
            return x;
          });
          if (this._dS.getLocalUser().rolUser == "PICKER" || this._dS.getLocalUser().profile == 'rx') lstOrders = lstOrders.filter(x => x.storeId.trim() == String(this._dS.getLocalUser().storeId));
          this.hasNewOrderRX(lstOrders)
          this.lstOrders = lstOrders;
          this.toast.toastRef.manualClose();
          this.toastr.success("Dashboard Sincronizando", null);
    },
    error => {
      this.toast.toastRef.manualClose();
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

  private hasNewOrderRX(newOrders:Array<any>){
    let arrDif = _.difference(this.getSimpleOrderArray(newOrders), this.getSimpleOrderArray(this.lstOrders));
    if(arrDif.length > 0 && this.lstOrders.length > 0) {
      this.msg.info('Tienes ' + arrDif.length + ' ordenes nuevas', {nzDuration: 4000});
      this.sounds.notification();
    }
  }

  private getSimpleOrderArray(array){
    let simpleArray = array.slice();
    return simpleArray.map((el)=>{return el.orderId});
  }



}

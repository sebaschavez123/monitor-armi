import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { countryConfig } from 'src/country-config/country-config';
import { Subscription } from 'rxjs';
import * as _ from 'underscore';

@Component({
  selector: 'app-dashboard-express',
  template: `<general-orders-table [cols]="cols" [listOfAllData]="lstOrders" [realtime]="true" (refresh)="getData()"></general-orders-table>`,
  styleUrls: ['./../dashboard.component.scss']
})
export class DashboardRealtimeExpressComponent implements OnInit, OnDestroy {

  cols:Array<any> = [];
  lstOrders:Array<any> = [];
  subscribeAdd: Subscription;
  subscribeCh: Subscription; 
  subscribeRm: Subscription;
  refers = { add:undefined, ch: undefined}
  
  constructor(private _dS:DashboardService,
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
    this.subscribeAdd.unsubscribe();
    this.subscribeCh.unsubscribe();
    this.subscribeRm.unsubscribe();
  }

  getData() {
    this.subscribeAdd = this._dS.getObsDashboardRealtime('express', 'child_added')
    .subscribe((order: string) => {
      this.mergeData(this.mapOrder(order));
    });
    this.subscribeCh = this._dS.getObsDashboardRealtime('express', 'child_changed')
    .subscribe((order: string) => {
      this.mergeData(this.mapOrder(order));
    });
    this.subscribeRm = this._dS.getObsDashboardRealtime('express', 'child_removed')
    .subscribe((order: string) => {
      this.mergeData(this.mapOrder(order), true);
    });
  }

  private mergeData(order:any, del = false){
    let list = this.lstOrders.slice(0);
    const index = list.findIndex(x => x.orderId == order.orderId);
    if(del && index != -1) list.splice(index,1);
    else if(index == -1) list.push(order);
    else list.splice(index, 1, order);
    if (this._dS.getLocalUser().rolUser === 'PICKER') 
      list = list.filter(x => x.storeId.trim() === String(this._dS.getLocalUser().storeId));
    list = _.sortBy(list, (order) => order.indexOrder);
    this.lstOrders = list;
  }

  private initCols(){
    this.cols = this._dS.getCols();
  }

  private mapOrder(data:string):any {
    const x = JSON.parse(data);
    x.storeNameCity = '<u>'+ x.storeName + '</u> ' + x.city;
    x.orderDeliveryType = 'EXPRESS';
    x.messengerPhoneCountry = x.messengerPhone != null ? countryConfig.phoneCode+x.messengerPhone : '';
    x.opticalRoute = this._dS.getInfOpticalRoute(x);
    x.pm = this._dS.getPaymentMethod(x);
    x.indexOrder = this._dS.orderByStatus(x.status);
    x.countObs = x.totalObservationsOrder ? !isNaN(parseFloat(x.totalObservationsOrder)) &&
    // tslint:disable-next-line: radix
    isFinite(x.totalObservationsOrder) ? parseInt(x.totalObservationsOrder) : 0 : 0;
    return x;
  }



}



import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScanGoService } from '../../../services/scan-go.service';
import * as _ from 'underscore';
import * as moment from 'moment-mini-ts';
import { DashboardService } from '../../../services/dashboard.service';
import { SoundsService } from '../../../services/sounds.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-cancel-purchases',
  templateUrl: './cancel-purchases.component.html',
  styleUrls: ['./../scan-go.component.css']
})
export class CancelPurchasesComponent implements OnInit, OnDestroy {

  data:Array<any> = [];
  verifySearch = false;

  constructor(private _s:ScanGoService,
    private _dS:DashboardService,
    private sounds:SoundsService) { }

  ngOnInit() {
    this.setInformation();
    this._s.eventRefresh.subscribe(res=>{
      this.setInformation();
    })
  }

  ngOnDestroy(){
  }

  parse(json){
    return JSON.parse(json);
  }

  setInformation(sound:boolean = false){
    this.data = [];
    this._s.getAproved().subscribe((res:any)=>{
      res.data = res.data.filter(e => e.storeId == this._dS.getLocalUser().storeId);
      for (let i = 0; i < res.data.length; i++) {
        const element = res.data[i];
        const order = JSON.parse(element.JSON ?? element.json);
        if(order.statusId == 14 && moment(order.createDate, 'YYYY-MM-DD').format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')){
          const indexOrder = this.getIndexOrder(order.orderId);
            if(indexOrder == null){
              this.data.push(this.mapData(order));
            }else if(indexOrder != null && this.data[indexOrder] !== order){
              this.data.splice(indexOrder, indexOrder);
            }
        }
      }
      this.refreshData();
    }, err =>{});
  }

  getIndexOrder(idOrder){
    for (let i = 0; i < this.data.length; i++) {
      const element = this.data[i];
      if(idOrder === element.orderId || idOrder === element.status.orderId) return i;
    }
    return null;
  }

  private mapData(res){
      return {
        customer: res.customer,
        listOrderItem: res.orderDetail,
        status: {
          review: 4,
          createDate: res.createDate,
          orderId: res.orderId,
        }
      }
  }

  private refreshData(){
    this.data = _.sortBy(this.data, (el)=>{ return -new Date(el.status.createDate).getTime()});
  }
}

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScanGoService } from '../../../services/scan-go.service';
import * as _ from 'underscore';
import * as moment from 'moment-mini-ts';
import { DashboardService } from '../../../services/dashboard.service';
import { SoundsService } from '../../../services/sounds.service';

@Component({
  selector: 'app-approved-purchases',
  templateUrl: './approved-purchases.component.html',
  styleUrls: ['./../scan-go.component.css']
})
export class ApprovedPurchasesComponent implements OnInit, OnDestroy {

  data:Array<any> = [];
  private subObject: Subscription;
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
    if(this.subObject) this.subObject.unsubscribe();
    this._dS.offEventsFirebase();
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
        if(moment(order.createDate, 'YYYY-MM-DD').format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') 
          && order.statusId != 14){
          const indexOrder = this.getIndexOrder(order.orderId);
            if(indexOrder == null){
              this.data.push(this.mapData(order));
            }else if(indexOrder != null && this.data[indexOrder] !== order){
              this.data.splice(indexOrder, indexOrder);
            }
        }
      }
      this.refreshData();
      this.initEvent();
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
          review: 1,
          createDate: res.createDate,
          orderId: res.orderId,
        }
      }
  }

  private initEvent(){
    this.subObject = this._s.getTransactionOnline(this._s.getLocalUser().storeId, 'child_added').subscribe((res:any) => {
      const idOrder = res.val();
      this._s.getOneAproved(idOrder).subscribe((response:any)=>{
        const indexOrder = this.getIndexOrder(response.data.orderId);
        if(indexOrder == null && moment(response.data.createDate, 'YYYY-MM-DD').format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')){
          this.data.push(this.mapData(response.data));
          this.refreshData();
        }
      });
    });
  }

  private refreshData(){
    this.data = _.sortBy(this.data, (el)=>{ return -new Date(el.status.createDate).getTime()});
  }
}

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { ScanGoService } from '../../../services/scan-go.service';
import * as _ from 'underscore';
import { SoundsService } from '../../../services/sounds.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-purchases-process',
  templateUrl: './purchases-process.component.html',
  styleUrls: ['./../scan-go.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchasesProcessComponent implements OnInit, OnDestroy {

  dataUnaproved:Array<any>;
  private managementProcess:Array<number> = [];
  private timeoutReload;
  subscribeAdd: Subscription;
  subscribeCh: Subscription; 
  subscribeRm: Subscription;

  constructor(private _s:ScanGoService,
              private _cdr: ChangeDetectorRef,
              private sounds:SoundsService) { }

  ngOnInit() {
    this.manageData();
    this._s.eventRefresh.subscribe(res=>{
      this.dataUnaproved = undefined;
      this.refreshData();
      this.manageData();
    });
    if(!this.dataUnaproved) this.dataUnaproved = [];
    this._s.eventCardSAG.subscribe((res: any)=> {
      this.resultInDataStore(res.id, res.action, res.data);
    });
  }

  ngOnDestroy(){
    this.subscribeAdd?.unsubscribe();
    this.subscribeRm?.unsubscribe();
  }

  managementOrder(event:number){
    const index = this.managementProcess.indexOf(event);
    if(event && index === -1) this.managementProcess.push(event);
    else this.managementProcess.splice(index);
  }

  private manageData(){
    this.subscribeAdd = this._s.getPaymentActiveProcessByStore().subscribe((res:any) => this.resultInDataStore(res.key, 1, res.val()));
    this.subscribeRm = this._s.getPaymentProcessByStore('child_removed').subscribe((res:any) => this.resultInDataStore(res.key, 3));
  }

  private resultInDataStore(id:string, status:number, data?:any){
    if(!this.dataUnaproved) this.dataUnaproved = [];
    const index = this.dataUnaproved.slice(0).findIndex(i => i.customer.id === id);
    if(status === 2 && index !== -1){
      if(this.timeoutReload) clearTimeout(this.timeoutReload);
      this.timeoutReload = setTimeout(()=>{
        this._s.getUnaproved([id]).subscribe((res:any)=>{
        this._s.setAttribute(id, 'reload_cart', false).then(()=>{});
          res = this.mapDataDStore(res.data, data);
          this.updateReloadCart(index, res[0], data);
          this.refreshData();
          clearTimeout(this.timeoutReload);
        });
      },1000)


    }else if(status === 1 && data && index === -1){

      
      this._s.getUnaproved([id]).subscribe((res:any)=>{
        res = this.mapDataDStore(res.data, data);
        this._s.setAttribute(res[0].customer.id, 'reload_cart', false).then(()=>{})
        const index2 = this.dataUnaproved.slice(0).findIndex(i => i.customer.id === id);
        if(index2 === -1) this.dataUnaproved.push(res[0]);
        this.refreshData();
      })


    }else if(status === 3 && index !== -1){

      this.dataUnaproved.splice(index, 1);
      this.refreshData();

    }
  }

  private mapDataDStore(res, dataFirebase){
    return res.map((el)=>{
      return {
        customer: {
          id: el.customerId,
          firstname: el.firstName,
          lastname: el.lastName,
          gender: el.gender,
          documentNumber: el.documentNumber,
          documentType: el.documentType,
          email: el.email,
          phone: el.phone,
          blocked: el.blocked,
          // antifraud: el.antifraud ?? false,
        },
        deliveryOrder: {
          subTotalPrice: el.deliveryOrder.subTotalPrice,
          offerPrice: el.deliveryOrder.offerPrice,
          createDate: el.deliveryOrder.createDate,
          totalPrice: el.deliveryOrder.totalPrice
        },
        listOrderItem: el.deliveryOrder.items ? el.deliveryOrder.items : [],
        status: {
          review: 3,
          active: dataFirebase.active,
          reload_cart: dataFirebase.reload_cart,
          order: dataFirebase.order,
          lastUpdateDate: null,
          df: dataFirebase
        }
      }
    })
  }

  private updateReloadCart(index,res, data){
    if(res.deliveryOrder) this.dataUnaproved[index].deliveryOrder = res.deliveryOrder;
    if(res.listOrderItem) this.dataUnaproved[index].listOrderItem = res.listOrderItem;
    this.dataUnaproved[index].status = {
      // review: 3,
      review: data.review === true ? 2:3,
      active: data.active,
      reload_cart: data.reload_cart,
      lastUpdateDate: data.lastUpdateDate,
      order: data.order,
      df: data
    }
  }

  private refreshData(){
    this.sounds.notification();
    this.dataUnaproved = _.sortBy(this.dataUnaproved, (el) => { return -new Date(el.status.df.lastUpdateDate).getTime() });
    this._cdr.detectChanges();
  }


}

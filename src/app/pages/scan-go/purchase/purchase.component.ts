import { Component, OnInit, Input, OnChanges, Output,
  EventEmitter, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';
import { DashboardService } from '../../../services/dashboard.service';
import * as moment from 'moment-mini-ts';
import { ScanGoService } from '../../../services/scan-go.service';
import Swal from 'sweetalert2';
import { SoundsService } from '../../../services/sounds.service';
import { UserService } from '../../../services/user.service';
import { countryConfig } from 'src/country-config/country-config';
import { AntifraudService } from '../../../services/antifraud.service';
declare var $:any;

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseComponent implements OnInit, OnChanges, OnDestroy {

  expand = false;
  maxHeightContentProd:boolean = undefined;
  @Input() customer:any;
  @Input() deliveryOrder:any;
  @Input() listOrderItem:any;
  @Input() status:any;
  @Output() eventConfirm = new EventEmitter();
  @Output() eventManagement = new EventEmitter();
  userWarnning = false;
  checks: Array<boolean> = [];
  hide = false;
  intervalTime:any;
  subscription:any;
  private searchPhoto = false;
  isColombia = countryConfig.isColombia;
  symbolMoney = this.isColombia ? '$' : 'Bs.';

  constructor(private _sS:ScanGoService,
              private _aS:AntifraudService,
              private _cdr: ChangeDetectorRef,
              private sounds:SoundsService,
              private _uS:UserService) { }

  async ngOnInit() {
    this.loadPhoto();
    this.fraudVerify();
    this.purchaseValidate();
    if(!this.isPurchaseFinished) {
     this.subscription = this._sS.getEventPaymentProcessById(this.customer.id).valueChanges()
      .subscribe((res:any)=>{
        const statusReview = res.review === true ? 2:3;
        if(statusReview == 2 && this.status.review != statusReview) this.sounds.alert();
        this.status = {
          active : res.active,
          reload_cart : res.reload_cart,
          review : statusReview,
          irregular : false,
          order : res.order,
          status : res.status,
          df :  res
        }
        if (res.reload_cart === true) this.sendAction(this.customer.id, 2, this.status.df);
        if (res.active === false) this.sendAction(this.customer.id, 3);
        this._cdr.detectChanges();
      });
    }
  }

  ngOnDestroy(){
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

  ngOnChanges(change:SimpleChanges){
    if(
      this.status.review == 2 || 
      this.status.review == 3 || 
      change.listOrderItem && 
      !this.arraysEqual(change.listOrderItem.currentValue ?? [], change.listOrderItem.previousValue ?? [])
    ) this.purchaseValidate();
  }

  private async loadPhoto(){
    if(!this.customer.profileImageUrl && !this.searchPhoto){
      let res:any;
      try{
        res = await this._sS.getCustomerPhoto(this.customer.id).toPromise();
      }catch(err) {
        res = undefined;
      }
      if(res) this.customer.profileImageUrl = res.data.photos.filter(p => p.photoType === 1)[0].photoUrl;
      this.searchPhoto = true;
    }
  }

  private async fraudVerify(){
    let res:any;
    try{
      res = await this._sS.getCustomerAntifraud(this.customer.id).toPromise();
    }catch(err) {
      res = undefined;
    }
    if(res) this.customer.antifraud = res.data;
    if(this.isAntifraud) {
      this.checkPurchase(true);
    }
    this._cdr.detectChanges();
  }

  private async purchaseValidate(){
    this._sS.orderSAGValidate(this.customer.id,this.listOrderItem.map(p => { return {idItem: p.id, quantity: p.quantitySold} }),this.purchaseValueTotal)
      .subscribe((res:any)=>{
        this.customer.score = res.data.score;
        this.checkPurchase(res.data.checkPurchase);
      } 
    );
  }

  checkPurchase(status: Boolean){
    const newObject = Object.assign({}, this.status.df);
    newObject.review = this.isAntifraud ? true : status;
    newObject.irregular = false;
    newObject.reload_cart = false;
    this._sS.setAttributes(this.customer.id,newObject).then((res)=>{});
  }

  confirm(ok:boolean){
    this._sS.basicLoadPromise( this._sS.confirmOrder(null, this.customer.id, !ok, this.havePhoto).toPromise(),
    'Confirmando compra',
    ok ? 'Se ha confirmado la compra correctamente':'Se ha confirmado la compra de forma irregular',
    'No se pudo confirmar compra!',
    (ct, data)=>{
      if(ct){
        const newObject = Object.assign({}, this.status.df);
        newObject.review = false;
        newObject.irregular = !ok;
        this._sS.setAttributes(this.customer.id,newObject).then((res)=>{});
      }
    });
  }

  report(){
    const comentay = '';
    Swal.fire({
      title: '¿Estás seguro de bloquear este usuario?',
      text: 'Escribe un comentario acerca de lo sucedido con el usuario',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'SI',
      cancelButtonText:'NO',
      input: 'textarea',
      inputPlaceholder:'Escribir comentario...',
      preConfirm: (reason) =>{
        if (!reason || reason === '') Swal.showValidationMessage(`Por favor ingrese una razón`)
        else return true;
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if(result.value){
          return this._sS.basicLoadPromise( this._uS.blockUser(this.customer.id, comentay).toPromise(),
            'Bloqueando usuario',
            'La orden fue finalizada correctamente',
            'No es posible finalizar la orden',
            (ct, data)=>{
              if(ct) this._sS.setAttribute(data[0].customer.id, 'review', false).then((res)=>{});
            }
          );
        }
    });
  }

  onResizedContentProd(event: ResizedEvent) {
    if(event.newHeight >= 274 && this.maxHeightContentProd === undefined){
      this.maxHeightContentProd = true;
    }
  }

  get purchaseValueTotal():number{
    let sum = 0;
    if(this.isPurchaseFinished){
      this.listOrderItem.forEach(product => {
        sum += product.price * product.units;
      });
    }else{
      !this.listOrderItem || this.listOrderItem.length === 0 ? sum = 0 : sum = this.deliveryOrder.subTotalPrice;
    }
    return sum;
  }

  initCecks(){
    if(this.listOrderItem)
    for (const iterator of this.listOrderItem) {
      this.checks.push(false)
    }
  }

  changeCheck(){
    for (const check of this.checks) {
      if(!check){
        return;
      }
    }
    this.eventManagement.emit(null);
  }

  get havePhoto(){
    return this.customer.profileImageUrl ? true : false;
  }

  get isAntifraud(): boolean {
    return this.customer.antifraud && this.customer.antifraud.length > 0;
  }



  get isPurchaseFinished():boolean {
    return this.status.review === 1 || this.status.review === 4;
  }

  private sendAction(id,action, data?){
    this._sS.eventCardSAG.emit({id,action,data});
  }

  private arraysEqual(a1, a2):boolean {
    return a1.length === a2.length && a1.every((o, idx) => this.objectsEqual(o, a2[idx]));
  }   

  private objectsEqual(o1, o2):boolean {
    return typeof o1 === 'object' && Object.keys(o1).length > 0 
        ? Object.keys(o1).length === Object.keys(o2).length 
            && Object.keys(o1).every(p => this.objectsEqual(o1[p], o2[p]))
        : o1 === o2;
  }

}

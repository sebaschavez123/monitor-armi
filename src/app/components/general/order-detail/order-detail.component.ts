import { Component, OnInit, Input, Output, EventEmitter, ViewChild, SimpleChanges, OnChanges, OnDestroy, isDevMode } from '@angular/core';
import Swal from 'sweetalert2'
import { DashboardService } from '../../../services/dashboard.service';
import { User, Address } from '../../../core/interfaces';
import { UserService } from '../../../services/user.service';
import { ProductService } from '../../../services/product.service';
import * as _ from 'underscore';
import { typesSearchProduct, colsProduct, couriersEnvialoYa, courierNac, colsProductMissing } from '../../../core/const';
import { countryConfig } from 'src/country-config/country-config';
import { Ticket } from 'src/app/core/interfaces';
import { OrderDetail } from '../../../core/models/orderDetail.class';
import { OrderService } from 'src/app/services/order.service';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment-mini-ts';
import { firstValueFrom } from 'rxjs';
import { MapComponent } from './map/map.component';
import { ToastrService } from 'ngx-toastr';
import { LOADIPHLPAPI } from 'dns';
declare var $:any;
declare var window:any;

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit, OnChanges,OnDestroy {

  @Input() order:any;
  @Input() missings:boolean;
  @Input() typeReport:any;
  @Input() exportPdf:boolean = undefined;
  @Input() editCourier:any;
  @Input() pageMode = false;
  @Output() close = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() txtNumeroFactura: EventEmitter<string> = new EventEmitter();
  @Output() habilitarPago: EventEmitter<boolean> = new EventEmitter();
  @Output() esPago: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('orderMap') omap: MapComponent;

  user:User;
  stateCustomer = false;
  invoiceManually = false;
  addComment = false;
  medicalFormula:boolean = undefined;
  messengerEvidences:boolean = undefined;
  messengerEvidenceSelected:string = undefined;
  newCommnet = '';
  currentDate: number;
  errNewComment = '';
  coordinatesMap = {longitude: 0, latitude: 0};
  photoRX = undefined;
  formCourier:any;
  radioValue:any;
  time = {text:'', value:undefined};
  colsProduct:Array<any>;
  colsProductMissing:Array<any>;
  types:Array<any>;
  courierNac:Array<any>;
  couriersEnvialoYa:Array<any>;
  typesCouriers = [];
  ticketSelected:Ticket;
  ticketNumberSelected:any;
  countryConfig = countryConfig;
  maxHeightTableProducts: number = 0;
  orderDetail:OrderDetail;
  customerAddressSelected:Address;
  eventFirebaseChange:any;
  orderIdpayment:string;
  openToken:boolean = false;
  armireneLink = false;
  showCustomerPhone = false;
  cancelTimeout: any;
  orderValuesSubcription: any;
  reverseOrderStatus: any;
  orderPaymentReference:any;
  incentives: {relaunchIncentive:number,totalIncentives:number} = null;
  isVisible = false;
  orderSelect : any;
  sendForm: boolean = false;
  productListFull: any[] = null;
  localProductsTheoretical: any = [];
  RefundPaymentMobileStatuses: any = [];
  formSearchProd = { type : 'codigo', value: ''};
  formSearchProdMissing = { type : 'codigo', value: ''};
  opn = {products_real:false, products_theorical: false, picking:false, products_missing:false};
  permission = { picking : true, blockUser: true, edit:false, reassign: true, assign:true,
    cancel:true, repush:true,manager:true,finalize:true,activeOrder:true, relaunch: true,
    reschedule: false, zendesk: false, observations: true, token: false, customer_phone: true}
  showTransferModal: boolean = false;
  numberOfStores: number = 1;
  numberOfStoresMapping: {[k: string]: string} = {
    '=1': 'Crear transferencia',
    'other': 'Editar transferencias',
  };
  expands = {
    products_real: false,
    products_theorical: false,
    products_missing: false,
    cancel_evidences: false
  };
  messageCall : string = '';
  activeButton: boolean;
    
  get onMobile() {
    return ('onTouchStart' in document.documentElement);
  }

  private actionsM:any;
  private subscribes = [];
  typification = [];
  typeUser;
  dial_id : string;
  callActive: boolean = false;

  constructor(private _dS:DashboardService,
              private _uS:UserService,
              private _pS:ProductService,
              private _oS:OrderService,
              private toastr: ToastrService) {
    this.types = typesSearchProduct;
    this.colsProduct = colsProduct;
    this.colsProductMissing = colsProductMissing;
    this.courierNac = courierNac;
    this.couriersEnvialoYa = couriersEnvialoYa;
  }

  ngOnInit() {
    this.user = this._dS.getLocalUser();
    this.actionsM = this._dS.getPermissions('dashboard');
    this.initPermission();
    
    if(countryConfig.isColombia && 
      (this.user?.rolUser === 'ADMINISTRADOR' || this.user?.rolUser === 'AGENTE CHAT' 
    || this.user?.rolUser === 'ANTI-FRAUDE' || this.user?.rolUser === 'AGENTE'
    || this.user?.rolUser === 'LIDER CALL' || this.user?.rolUser === 'AGENTE CALL' 
    || this.user?.rolUser === 'ASESORES DE SAC' || this.user?.rolUser === 'MONITOR'
    || this.user?.rolUser === 'LÍDERES MONITOR' || this.user?.rolUser === 'ASESOR CALL')){
      this.getDataTypification(0);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.order){
      if(!this.order){
        this._dS.getTracking(this.orderDetail?.orderId).off('child_changed', this.eventFirebaseChange);
        this._dS.offEventsFirebase();
        this.clear();
        return;
      }
      //console.info('orderDetail', this.order);
      if(isDevMode) {
        window.globalDevOrder = this.order
      }
      if(this.orderDetail?.orderId == changes.order.currentValue.orderId) return;
      if(!this.orderDetail) this.orderDetail = new OrderDetail(this.order);
      this._dS.orderActive = new OrderDetail(this.order);
      this.getActivationAssociated();
      this.getDetailOrder();
      this.getStatusOrder();
      this.getOrderValues();
      this.getSatusCustomer();
      this.getBillingNumber();
      this.getDistance();
      this.getNameStore();
      this.getObservations();
      this.getTickets();
      this.getCreditNote();
      this.getReassingList();
      this.getincentivo();
      this.getReverseOrderStatus();
      this.getPaymentReference();
      setTimeout(() => {
        if(this.missings) this.getDetailIncomplete();
        this.updateCancelInfo();
        this.coordinatesMap = this.coordinatesMap = {longitude: 0, latitude: 0};
        if(this.orderDetail.status === 'FINALIZADA'){
          this.finalizeAssociation(); 
          this._oS.getEvidences(this.orderDetail.orderId).subscribe({
            next: (res:any)=>{
              const evd = res?.data;
              if(evd?.evidences) {
                this.orderDetail.messengerEvidences = evd.evidences ?? null;
              } 
              else if(evd?.message) {
                this.orderDetail.messengerEvidences = [evd.message] ?? null;
              }
            }
          });
        }
        if (
          this.order.status !== 'EMITIDA'
          && this.order.status !== 'ENVIADA'
          && this.order.status !== 'CANCELADA' 
          && this.order.status !== 'FINALIZADA'
          && this.order.status !== 'ENTREGADA'
        ) {
          this.getTracking();
        }
        if(countryConfig.isVenezuela) {
          if(this.order.paymentMethod === 'Pago en Línea') { this.getPaymentPayU(); }
          if(this.orderDetail.paymentMethod === 'Pago Movil') this.getDetailtPagoMovil();
          if( this.order.status === 'CANCELADA' || this.order.status == 'FINALIZADA') {
            this.getMultipleRefound(this.order.orderId);
          }
        } else {
          this.getProviderAssociated();
          this.paymentChange();
          if(this.order.paymentMethod === 'Transacciones en línea' || this.order.paymentMethod === 'Transacción en línea') this.getPaymentPayU();
          if(this.order.paymentMethod === 'pse') this.getPaymentPse();
          else if (this.order.paymentMethod === 'Datafonos' || this.order.paymentMethod === 'Datáfonos') this.getPaymentDataphone();
          if(this.typeReport === 'rx') this.getPrescriptionImage();
          if(this.editCourier !== undefined && this.permission.edit){
            if(this.editCourier.couriers) this.formCourier = { courier : '', value: ''}
            else this.formCourier = { courier : undefined, value: ''}
            if(this.typeReport === 'nacional-envialo-ya' && String(this.orderDetail.deliveryType).toLowerCase() !== 'national')
              this.typesCouriers = this.couriersEnvialoYa;
            else this.typesCouriers = this.courierNac;
          }
        }
        if(this.orderDetail.status === 'FACTURADA' || this.orderDetail.status === 'FINALIZADA' || this.orderDetail.status === 'CANCELADA') this.permission.edit = false;
      }, 500);
    }
  }

  getReverseOrderStatus() {
    firstValueFrom(
      this._oS.getReverseOrderStatus(this.orderDetail.orderId)
    ).then( (data) => {this.reverseOrderStatus = data.transactionStatus;} );
  }

  getincentivo() {
    if(!countryConfig?.isColombia) return;

    this._oS.incentiveInfo(this.orderDetail.orderId).subscribe({
      next: (resp:any) => {  this.incentives = resp.data; },
      error: error => {
       this.toastr.error(error)
      }
    });
  }

  getMultipleRefound(orderId:string) {
    firstValueFrom(this._oS.getRefundPaymentMobileStatus(orderId))
    .then( (resp:any) => {
      if(resp.data && Array.isArray(resp.data)){
        this.RefundPaymentMobileStatuses = resp.data;
        console.log('refound', this.RefundPaymentMobileStatuses);
      }
    });
  }

  getClassIcon(product) {
    return {
      'row-space': !product,
      'sending': product?.sending,
      'n-sending': product?.nsending,
      'opacity-0': !product?.sending && !product?.nsending,
    }
  }

  private updateCancelInfo() {
    if(!this.cancelTimeout) {
      this.cancelTimeout = true
      if (this.order.status === 'CANCELADA' || this.order.status === 'FINALIZADA') {
        setTimeout(() => {
          this.getInformationCanceled();
          this.canceledAssociation();
          this.cancelTimeout = false;
        }, 400);
      }
    }
  }

  ngOnDestroy(): void {
    this.clear();
  }

  private getActivationAssociated(){
    const subscribe = this._oS.getActivedAssociation(this.orderDetail.orderId).subscribe({
      next: (rta:any) => {
        if (rta.code === 'OK' && rta.data != null && rta.data.orderIdCanceled != null
          && rta.data.orderIdCanceled !== '') {
            this.orderDetail.idCanceled = rta.data.orderIdCanceled;
            if (rta.data.user) this.orderDetail.userCanceled = rta.data.user;
        }
      }
    });
    this.subscribes.push(subscribe);
  }

  private getDetailOrder(){
    const subscribe = this._oS.getDetail(this.orderDetail.orderId).subscribe({     
      next: (rta:any) => {
        this.orderDetail.productsReal = rta.data.orderDetail;
        this.orderDetail.token = rta.data.token;
        this.orderDetail.customerAddressDelivery = rta.data.address;
        console.log([this.orderDetail.customerAddressDelivery, rta.data.address]);
        this.orderDetail.store = rta.data.orderDetail[0]?.store;
        if (rta.data.couponDetail?.id) this.orderDetail.couponDetail = rta.data.couponDetail;
        this.invoiceManually = rta.data.invoice ?? false;
        this.getTheorical();
        this.setNumberOfStores(rta?.data?.orderDetail);
      }
    });
    this.subscribes.push(subscribe);
  }

  private getStatusOrder(){
    const subscribe = this._oS.getOrderStatusDetail(this.orderDetail.orderId).subscribe({
      next: (rta:any) =>  this.orderDetail.statusDet = rta.data
    });
    this.subscribes.push(subscribe);
  }

  private getOrderValues() {
    this.orderValuesSubcription = this._oS.getOrder(+this.orderDetail.orderId).subscribe({
      next: (rta:any) => {
        this.getTotal(rta.data.orderValue, rta.data.invoiceValue, rta.data.discountValue);
        this.orderDetail.ivaOrder = this._dS.formatMoney(0, 0,  '.', ',');
        this.orderDetail.totalDomicilio = this._dS.getFormatPrice(rta.data.deliveryValue);
        this.orderDetail.source = rta.data.source;
        this.orderDetail.urlArmIrene = rta.data.urlArmIrene;
        this.orderDetail.channelName = rta.data.channelName;
        this.orderDetail.billingChannel = rta.data.billingChannel;        
        this.orderDetail.status = rta.data.status;
        this.orderDetail.evidenceCanceled = rta.data.evidenceCanceled;
        this.orderDetail.nameUpdateAddress = rta.data.nameUpdateAddress;
        this.orderDetail.countRelaunched = rta.data.countRelaunched;
        if(countryConfig.isColombia){
          this.orderDetail.couponDiscount = this._dS.formatMoney(rta?.data?.offerDetailDomain?.couponDiscount, 0,  '.', ',');
          this.orderDetail.offerDiscount = this._dS.formatMoney(rta?.data?.offerDetailDomain?.offerDiscount, 0,  '.', ',');
          this.orderDetail.primeDiscount = this._dS.formatMoney(rta?.data?.offerDetailDomain?.primeDiscount, 0,  '.', ',');
          this.orderDetail.talonCouponDiscount = this._dS.formatMoney(rta?.data?.offerDetailDomain?.talonCouponDiscount, 0,  '.', ',');
          this.orderDetail.talonOfferDiscount = this._dS.formatMoney(rta?.data?.offerDetailDomain?.talonOfferDiscount, 0,  '.', ',');
        }
        this.updateCancelInfo();
      },
      error: error => {
        this.getTotal(0,0,0);
        this.orderDetail.ivaOrder = this._dS.formatMoney(0, 0,  '.', ',');
        this.orderDetail.totalDomicilio = this._dS.formatMoney(0, 0,  '.', ',');
        this.orderDetail.source = 'No registrado';
      }
    });
  }

  private getSatusCustomer(){
    try {
      const subscribe = this._uS.verify(this.orderDetail.customerId)
        .subscribe({ next: (rta:any) => {this.orderDetail.stateCustomer = rta.confirmation;}});
      this.subscribes.push(subscribe);
    } catch(e){}
  }

  private getDistance(){
    this.orderDetail.distanceKM = '0 Km'
    const subscribe = this._dS.getOrderCoordinates(this.orderDetail.orderId).subscribe({
      next: (rta:any) => {
        if (rta.code === 'OK' && rta.data != null && rta.data.distance != null && rta.data.distance !== '') {
          this.orderDetail.distanceKM = rta.data.distance + ' Km';
        }
      }
    });
    this.subscribes.push(subscribe);
  }

  private getNameStore(){
    const subscribe = this._dS.getCloserStoreNameCustomerByOrderId(this.orderDetail?.orderId.toString()).subscribe({
      next: (rta:any) => {
        return this.orderDetail.closerStoreName = rta?.data?.message;
      }
    });
    this.subscribes.push(subscribe);
  }

  private getObservations(){
    const subscribe = this._dS.getOrderObservations(this.orderDetail.orderId).subscribe({
      next: (rta:any) => {
        this.orderDetail.orderObservations = rta.data;
        if(this.orderDetail.orderObservations.length === 0) this.addComment = true;
      },
      error: error => {
        this.orderDetail.orderObservations = [];
      }
    });
    this.subscribes.push(subscribe);
  }

  private getBillingNumber(){
    const subscribe = this._dS.getBillingNumber(this.orderDetail.orderId, '2.0').subscribe({
      next: (rta:any) =>{
        if(rta.code === 'OK'){
            return this.orderDetail.billingNumber = rta.data.map((elem) => {
              if (elem.ticket !== 'undefined' && elem.ticket != null) {
                this.permission.edit = false;
                // this.colsProduct.splice(7,2);
                return elem.storeName + ' Fact.' + elem.ticket;
              }
              else{
                return 'No registra'
              }
            }).join(', ');
        }else{
          return this.orderDetail.billingNumber = 'No registra';
        }
      },
      error: error =>{
        return this.orderDetail.billingNumber = 'No registra';
      }
    });
    this.subscribes.push(subscribe);
  }

  private getTickets(){
    const subscribe = this._oS.getZendeskTickets(this.orderDetail.orderId).subscribe({
        next: (rta:any) => {
          if(rta.data) this.orderDetail.ticketZendesk = rta.data.map(i => {i.json = JSON.parse(i.json); return i}) || [];
          else this.orderDetail.ticketZendesk = [];
        }
      });
      this.subscribes.push(subscribe);
  }

  private getTheorical() {
    const subscribe = this._oS.getDetailTheoretical(this.orderDetail.orderId).subscribe({
      next: (rta:any) => {
        if(!this.orderDetail.productsTheoretical || _.difference(this.orderDetail.productsTheoretical.map(ot => {return ot.id}), rta.data.orderDetail.map(ot => {return ot.id})).length > 0) {
          this.localProductsTheoretical = rta.data.orderDetail;
          this.orderDetail.productsTheoretical = rta.data.orderDetail.map(p => { p.theorical = true; return p});
          this.getItemsStock(() =>{
            this.productListFull = this.orderDetail.productsManage();
          });
        }
      }
    });
    this.subscribes.push(subscribe);
  }

  private getDetailIncomplete(){
    const subscribe = this._dS.getDetailNoExpressIncompleted(this.orderDetail.orderId).subscribe({
      next: (rta:any) => {
        this.orderDetail.productsMissing = rta.data.orderDetail.map(p =>{p.unitsInitial = p.units;return p;});
      }
    });
    this.subscribes.push(subscribe);
  }

  private getInformationCanceled(){
    const subscribe = this._oS.getEmployeeCanceled(this.orderDetail.orderId).subscribe({
      next: (rta:any) => {
        if (rta.code === 'OK' && rta.data != null && rta.data.message != null && rta.data.message !== '') {
          this.orderDetail.employeeCanceledOrder = rta.data.message;          
          if(countryConfig.isColombia){
            this.activeButton = rta.data.message.includes('Braze');
          }
        }
      },
    });
    this.subscribes.push(subscribe);
  }

  private canceledAssociation(){
    const subscribe = firstValueFrom(this._oS.getCanceledAssociation(this.orderDetail.orderId))
      .then((rta:any) => {
        if (rta.code === 'OK' && rta.data?.orderIdActivated != null && rta.data?.orderIdActivated !== ''){
          this.orderDetail.idActivated = rta.data.orderIdActivated;
          if (rta.data.user) this.orderDetail.userActivated = rta.data.user;
        }
      });
    this.subscribes.push(subscribe);
  }

  private finalizeAssociation(){
    const subscribe = firstValueFrom(this._oS.getFinalizedAssociation(this.orderDetail.orderId)).then(
      (rta:any) => {
        if (rta.code === 'OK' && rta.data != null && rta.data.userName != null && rta.data.userName !== '') {
          this.orderDetail.employeeFinishedOrder = rta.data.userName;
        }
      });
      this.subscribes.push(subscribe);
  }

  private getPaymentPayU(){
    const subscribe = this._oS.getPayUResponse(this.orderDetail.orderId).subscribe({
      next: (rta:any) => {
        if (rta.code === 'OK') {
          this.orderDetail.orderPayment = rta.data;
          this.orderDetail.orderPayment.transactionValuePayU = this.orderDetail.orderPayment.transactionValuePayU || 'Sin información';
        }
      },
      error: error => {
        this.orderDetail.orderPayment.transactionStatusPayU = 'Sin información';
      }
    });
    this.subscribes.push(subscribe);
  }

  private getPaymentDataphone(){
    const subscribe = this._oS.getPOSNumber(this.orderDetail.orderId).subscribe({
      next: (rta:any) => {
        if (rta.code === 'OK' && rta.data != null && rta.data.message != null && rta.data.message !== '') {
          this.orderDetail.POSNumber = rta.data.message;
        }
      },
      error: error => {
        this.orderDetail.POSNumber = 'Sin información';
      }
    });
    this.subscribes.push(subscribe);
  }

  private getPaymentPse(){
    const subscribe = this._oS.getPseResponse(this.orderDetail.orderId).subscribe({
      next: (rta:any) => {
        this.orderDetail.orderPayment = rta.data;
        this.orderDetail.orderPayment.transactionValuePayU = rta.data?.transactionValuePayU
          ? this._dS.formatMoney(rta.data?.transactionValuePayU, 0,  '.', ',')
          : 'Sin información';
      },
      error: error => {
        this.orderDetail.orderPayment.transactionStatusPayU = 'Sin información';
      }
    });
    this.subscribes.push(subscribe);
  }

  private getCreditNote(){
    const subscribe = this._oS.getCreditNoteTicket(this.orderDetail.orderId).subscribe({
      next: (rta:any) => {
        this.orderDetail.creditNoteTicket = rta?.data?.ticket ?? rta?.data?.message;
        this.orderDetail.creditNoteTotal = rta?.data?.total;
      },
      error: error => {
        this.orderDetail.creditNoteTicket = 'Sin información';
      }
    });
    this.subscribes.push(subscribe);
  }

  private getDetailtPagoMovil() {
    const subscribe = this._oS.getPagoMovilPaymentList(this.orderDetail.orderId).subscribe({
      next: (res:any) => this.orderDetail.pagoMovilDetail = res.data });
    this.subscribes.push(subscribe);
  }
  private getProviderAssociated() {
    const subscribe = this._oS.providerAssociated(this.orderDetail.orderId).subscribe({
      next: (res:any) => {
        if(res.data.orderIdExpress) this.orderDetail.associatedIdExpress = res.data.orderIdExpress;
        if(res.data.orderIdProvider) this.orderDetail.associatedIdProvider = res.data.orderIdProvider;
      }
    });
    this.subscribes.push(subscribe);
  }

  private getReassingList() {
    const subscribe = this._oS.getReassingList(this.orderDetail.orderId).subscribe({
      next: (res:any) => {
        if(res.data) this.orderDetail.reassignments = this.orderDetail.reassignments = res.data;
      }
    });
    this.subscribes.push(subscribe);
  }

  private paymentChange() {
    const subscribe = this._oS.paymentChange(this.orderDetail.orderId).subscribe({
      next: (res:any) => {
        this.orderDetail.paymentChanges = res.data;
      }
    })
    this.subscribes.push(subscribe);
  }

  private getItemsStock(callback: Function = ()=>{}){
    const subscribe = this._pS.getItemsStock(
      this.orderDetail.storeId,
      this.orderDetail.productsId,
      ( (countryConfig.isVenezuela) && this.order.orderId )
    ).subscribe({
      next: (res:any) => {
        this.orderDetail.productsStock = res.data;
        callback();
      },
      error: (err) => {
        console.error('err', err);
        callback();
      }
    });
    this.subscribes.push(subscribe);
  }

  private getPaymentReference(){
    countryConfig.isVenezuela &&
    this._pS.getPaymentReference(this.order.orderId, this.orderDetail.paymentMethod,).subscribe({
        next: (res:any) => {
          this.orderPaymentReference=res.data.paymentReference
        },
        error: (err) => {
          this.toastr.error(err)
        }
      })
  }

  showPhone() {
    this.showCustomerPhone = true;
    this._dS.actionPhone(this.orderDetail.orderId);
  }

  openWapp(numberPhone, order: any) {
    if(order) this.gestionarClickWhatsapp(order);
    window.open(
      'https://api.whatsapp.com/send?phone=' + numberPhone,
      '_blank'
    );
    this._dS.actionWhatsapp(this.orderDetail.orderId);
  }

  viewToken() {
    this.openToken = true;
    this._dS.actionToken(this.orderDetail.orderId);
  }

  addCustomerWhiteList(id) {
    firstValueFrom(this._oS.addCustomerWhiteList(this.orderDetail.customerDocument))
    .then(()=>{
      this.orderDetail.fraudDescription = null;
      Swal.fire('', 'Usuario desmarcado', 'success');
    },()=>{
      Swal.fire('', 'No se pudo desmarcar Usuario en este momento.', 'error');
    })
  }

  showFinalChannel(){
    return this.orderDetail.status === 'FINALIZADA' && this.orderDetail?.channelName?.length > 0;
  }
  
  showBillingChannel(){
    return ( this.orderDetail.status === 'FACTURADA' || this.orderDetail.status === 'FINALIZADA' || this.orderDetail.status === 'ENTREGADA' )
      && this.orderDetail?.billingChannel?.length > 0;
  }

  copyLink(text:string) {
    Swal.fire('', '¡Link Copiado al portapapeles!', 'info');
    this._dS.copyTextToClipboard(text);
    this._dS.actionToken(this.orderDetail.orderId);
  }

  submitComment(){
    if(this.newCommnet.length > 0){
      const params = this.transformDataComment(this.orderDetail, this.newCommnet, this.user.employeeNumber);
      const subscribe = this._dS.guardarObservacion(params).subscribe({
        next: (rta:any) => {
          if (rta.code === 'OK') {
            this.orderDetail.orderObservations.push({
              employeeName: this.user.employeeName,
              rolName: this.user.rolUser,
              creationDate: `${Date.now()}`,
              observationId: 1,
              observation: this.newCommnet,
            })
            this.addComment = false;
            this.newCommnet = '';
            this.errNewComment = '';
          } else {
            this.errNewComment = 'No se pudo guardar la observación, por favor verifique.';
          }
        },
        error: error => this.errNewComment = 'No se pudo guardar la observación, por favor verifique.'
        });
      this.subscribes.push(subscribe);
    }
  }

  private transformDataComment(order, newCommnet, userId) {
    const createDate = moment(new Date()).format('DD/MM/YYYY hh:mm:ss a');
    const createDateOrder = moment(order.createDate).format('DD/MM/YYYY hh:mm:ss a');
    return {
      createDate, createDateOrder,
      "store": order.storeName,
      "city": order.city,
      "courier": order.courierName,
      "assignmentTime": this.getFormatTime(order.asignado) || 0,
      "pickingTime": this.getFormatTime(order.picking) || 0,
      "billingTime": this.getFormatTime(order.facturado) || 0,
      "customerArrival": this.getFormatTime(order.finalizado) || 0,
      "employeeNumber": userId,
      "observation": newCommnet, 
      "orderId": order.orderId
    }
  }

  private getFormatTime(t) {
    const mins = `${Math.trunc(t/60)}`.padStart(2, '0');
    const segs = `${(t%60)}`.padStart(2, '0');
    return `${mins}:${segs}`;
  }

  getStatusColor(text:string){
    return {'text-success':  text === 'APPROVED', 'text-danger':  text === 'REJECTED' || text === 'DECLINED',   'text-primary':  text === 'PENDING'}
  }

  blockUser(){
    Swal.fire({
      title: 'Confirmación',
      text: '¿Realmente desea bloquear el usuario?',
      icon: 'warning',
      input: 'textarea',
      inputPlaceholder : 'Escribe la razón por la cual se va a bloquear el usuario...',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'OK',
      showLoaderOnConfirm: true,
      cancelButtonText: 'Cancelar',
      preConfirm: (reason)=>{
        if (!reason || reason === '') {
          Swal.showValidationMessage(`Por favor ingrese la observación`)
        }else{
          return firstValueFrom(this._uS.blockUser(this.orderDetail.customerId, reason)).then(
            res => res,
            error => Swal.showValidationMessage(`Error en servicio, Vuelve a intentarlo`)
          );
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((res:any)=>{
      if(res.value){
        this.stateCustomer = res.value.confirmation;
        this._uS.modifyStatusCustomer(this.orderDetail.customerId, 'BLOCKED').subscribe({});
      }
    });
  }

  unblockUser(){
    Swal.fire({
      title: 'Confirmación',
      text: '¿Realmente desea desbloquear el usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancelar',
      preConfirm: ()=>{
        return firstValueFrom(this._uS.unblockUser(this.orderDetail.customerId)).then(
          res => res,
          error => Swal.showValidationMessage(`Error en servicio, Vuelve a intentarlo`)
        );
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((res:any)=>{
      if(res.value) {
        this.stateCustomer = (res.value.confirmation ? false : true);
      }
    })
  }

  getFormatPrice(price){
    return this._dS.formatMoney(price, 0,  '.', ',');
  }

  lessUnit(item){
    if(+item.units - 1 === 0){
      Swal.fire('', 'No se pueden dejar cero unidades del producto', 'error');
    }
    else{
      item.units = +item.units - 1;
      const arrayItem = [];
      this.orderDetail.products.forEach(x => {
        arrayItem.push({itemId: +x.id,quantityRequested: x.units});
      });
      this.validateDeliveryOrder(arrayItem, +this.orderDetail.orderId);
    }
  }


  addUnit(item){
    item.units =+item.units + 1
    const arrayItem = [];
    this.orderDetail.products.forEach(x => {
      arrayItem.push({itemId: +x.id,quantityRequested: x.units});
    });
    this.validateDeliveryOrder(arrayItem,+this.orderDetail.orderId);
  }

  lessUnitMessing(item){
    if(+item.units - 1 === 0){
      Swal.fire('', 'No se pueden dejar cero unidades del producto', 'error');
    }
    else{
      item.units = +item.units - 1;
    }
  }

  addUnitMissing(item){
    item.units =+item.units + 1
  }

  deleteProduct(rowData) {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Realmente desea eliminar item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        const index = this.orderDetail.products.findIndex(x => x.id === rowData.id);
        this.orderDetail.products.splice(index, 1);
        const arrayItem = [];
        this.orderDetail.products.forEach(x => {
          arrayItem.push({itemId: +x.id,quantityRequested: x.units});
        });
        this.validateDeliveryOrder(arrayItem, +this.orderDetail.orderId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });
  }

  deleteProductMissing(rowData) {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Realmente desea eliminar item faltante?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        const index = this.orderDetail.productsMissing.findIndex(x => x.id === rowData.id);
        this.orderDetail.productsMissing.splice(index, 1);
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });
  }

  getColorCheckIcon(product){
    if(product.theorical) { 
      return {
        'show fa-times text-danger': product.nsending,
      };
    }
    return {
      'fa-check op-1 text-success': (product.unitsInitial === product.units) && !product.sustitute ,
      'fa-edit show text-info': (product.unitsInitial !== product.units) && !product.sustitute,
      'fa-exchange show text-danger': (product.sustitute)}
  }

  expand(name:string){
    if(name === 'real'){
      this.expands.products_real = !this.expands.products_real;
      if(this.expands.products_real && !this.opn.products_real) this.opn.products_real = true;
    }else if(name === 'missing'){
      this.expands.products_missing = !this.expands.products_missing;
      if(this.expands.products_missing && !this.opn.products_missing) this.opn.products_missing = true;
    }else{
      this.expands.products_theorical = !this.expands.products_theorical;
      if(this.expands.products_theorical && !this.opn.products_theorical) this.opn.products_theorical = true;
    }
  }
  

  searchProduct(missing?:boolean){
    let form;
    missing ? form = this.formSearchProdMissing : form = this.formSearchProd;
    Swal.fire({
      title: 'Buscando producto!',
      text: 'Estamos buscando el producto, por favor espere.',
      showCancelButton: false,
      showConfirmButton:false,
      onBeforeOpen: ()=>{
        Swal.showLoading();
        const promise = (form.type === 'codigo')
          ? this._pS.getItemByBarcode(form.value, this.orderDetail.storeId)
          : this._pS.getItemById(form.value, this.orderDetail.storeId);
        return firstValueFrom(promise).then(
          (rta:any) => {
            let fullPrice = 0;
            if (form.type === 'idProducto' && rta.stockByGroup) {
            rta.stockByGroup.forEach((val : any, key: any) => {
                if(val.group === this.orderDetail.storeId){
                fullPrice = val.fullValue;
                }
              });
              rta.fullPrice = fullPrice;
            }
            Swal.hideLoading();
            Swal.close();
            this.showProduct(rta, missing);
          },
          error=>{
            Swal.close();
            Swal.fire('', 'Producto no encontrado , por favor verifique', 'warning');
          }
        );
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((res:any)=>{});
  }

  actionEvents($event){
    switch($event.type){
      case 'manager':
      case 'enlist':
      case 'send':
      case 'send-i':
      case 'waiting-c':
      case 'incomplete':
      case 'update-date':
      case 'ticket-ok':
      case 'messenger-assing':
      case 'change-button':
      case 'payment-action':
        this.refresh.emit(this.orderDetail.orderId)
        break;
      case 'cancel':
      case 'finish':
      case 'active':
      case 'reservation':
      case 'launch':
      case 'reassign':
      case 'repush':
        this.close.emit();
        this.refresh.emit(null);
        break;
      case 'new-ticket':
        this.openModalTicket();
        break;
    }
  }

  openModalTicket() {
    this.ticketSelected = {
      id: null
    }
  }

  verifyUpdateCourier(){
    return (this.formCourier.courier == null && this.formCourier.value !== '') ||
            (this.formCourier.courier !== '' && this.formCourier.value !== '');
  }

  updateOrderGuide() {
    if(this.verifyUpdateCourier()){
      let subscribe = this._oS.addOrderGuideProvider(
        this.orderDetail.orderId.toString(), this.formCourier.value,
        this.formCourier.courier, 
        this.orderDetail.customerPhone).subscribe({
          next: (rta:any) => {
            if (rta.code === 'OK') {
              subscribe = this._dS.sendMailNoExpress(this.orderDetail.orderId, this.formCourier.value,
                this.formCourier.courier).subscribe({
                  next: (rta2:any) => {
                  Swal.fire({
                      icon: 'success',
                      title:'Información',
                      text:'Información del courier actualizada exitosamente',
                      confirmButtonText: 'Aceptar',
                      allowOutsideClick: false,
                      allowEscapeKey: false
                    }).then((result)=> {
                        if (result) {
                          this.formCourier = undefined;
                          this.refresh.emit();
                        }
                    });
                },
                error: error =>  Swal.fire('Aviso Importante','No se pudo actualizar la información, por favor verifique!','warning')
              });
              this.subscribes.push(subscribe);
            }
          },
          error: error => Swal.fire('Aviso Importante','No se pudo actualizar la información, por favor verifique!','warning')
        });
        this.subscribes.push(subscribe);
    }
  }

  getHome() {
    return this.orderDetail?.customerAddressDelivery;
  }

  updateAddress(newAddress) {
    console.log('cambiando address');
    this.orderDetail = new OrderDetail({...this.orderDetail, customerAddressDelivery: {...newAddress}});
  }

  getIconSustitute(product){
    return {
      'show fa-check': (product.unitsInitial === product.units) && !product.sustitute ,
      'show fa-edit': (product.unitsInitial !== product.units) && !product.sustitute,
      'show fa-exchange': (product.sustitute)
    }
  }

  setEditAddress(address) {
    this.customerAddressSelected = null;
    setTimeout(() => {
      console.log(this.customerAddressSelected);
      this.customerAddressSelected = {...address};
    }, 200);
  }

  private showProduct(product:any, missing:boolean){    
    const html = this.orderDetail.productHtml(product);
    Swal.fire({
      title: 'Producto encontrado',
      html,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Agregar a carrito',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.agregarProducto(product, missing);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        missing ? this.formSearchProdMissing = { type : 'codigo', value: ''} : this.formSearchProd = { type : 'codigo', value: ''};
      }
    });
  }

  private agregarProducto(product, missing){
    let estado = true;
    let list;
    missing ? list =  this.orderDetail.productsMissing : list = this.orderDetail.products;
    list.forEach((keys : any, vals :any) => {
       if( (keys.barcode === product.barcode && this.orderDetail.storeName === keys.storeName)
         || (keys.id === +this.order && this.orderDetail.storeName === keys.storeName) ){
         keys.units = keys.units + 1;
         estado = false;
         return;
       }
    });

    if(!estado){
      const arrItem = [];
      list.forEach(x => {
        arrItem.push({itemId: +x.id ,quantityRequested: x.units});
      });
      if(!missing) this.validateDeliveryOrder(arrItem, +this.orderDetail.orderId);
      return;
    }

  list.push(
       {
         storeName: product.storeName,
         id: product.id,
         itemName: product.firstDescription,
         price: product.fullPrice,
         units: 1,
         unitsInitial: 1,
         storeAddress: product.storeAddress,
         image: product.mediaImageUrl,
         barcode: product.barcode
       }
     );

    const arrayItem = [];
    list.forEach(x => { arrayItem.push({itemId: +x.id ,quantityRequested: x.units});});
    if(!missing) this.validateDeliveryOrder(arrayItem, +this.orderDetail.orderId);
    else {
      setTimeout(()=>{
        const height = $('#table-products-missing').height();
        $('#responsive-missing').css('max-height', height);
      },500)
    }
  }

  saveMissings(){
    Swal.fire({
      title: 'Confirmación',
      text: '¿Está seguro de guardar los productos faltantes de la orden?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'SI',
      cancelButtonText: 'NO'
  }).then((result) => {
      if (result.value) {
        Swal.fire({
          title: 'Modificando orden!',
          text: 'Estamos modificando la orden, por favor espere.',
          showCancelButton: false,
          showConfirmButton:false,
          onBeforeOpen: ()=>{
            Swal.showLoading();
            const arrayItem = [];
              this.orderDetail.productsMissing.forEach(x => {
                arrayItem.push({itemId: +x.id ,quantityRequested: x.units});
              });
            return firstValueFrom(this._oS.insertItemOrderIncomplete(this.orderDetail.orderId, arrayItem))
              .then((rta:any)=>{
                if(rta.data.confirmation) Swal.fire('Aviso Importante','Se guardaron los productos faltantes de la orden exitosamente!','success');
                else Swal.fire('Aviso Importante',rta.data.message,'warning');
                Swal.hideLoading();
                Swal.close();
              }, error=>{
                Swal.fire('Aviso Importante','No se pudieron guardar los productos faltantes de la orden, por favor verifique!','error');
              });
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then();
      }
  });
  }

  private validateDeliveryOrder(lstProducts, orderId){
    Swal.fire({
      title: 'Modificando orden!',
      text: 'Estamos modifcando la orden, por favor espere.',
      showCancelButton: false,
      showConfirmButton:false,
      onBeforeOpen: () => {
        Swal.showLoading();
        return firstValueFrom(this._oS.validateDelivery(this.orderDetail.customerId,orderId, lstProducts, this.orderDetail.store.id))
          .then((rta:any)=>{
            if(rta.deliveryPrice !== undefined){
              this.getTotal(rta.totalPrice, rta.invoiceValue, rta.discountValue);
              this.orderDetail.ivaOrder = this._dS.formatMoney(rta.totalTaxes, 0,  '.', ',');
              this.orderDetail.totalDomicilio = this._dS.formatMoney(rta.deliveryPrice, 0,  '.', ',');
            }else{
              this.getTotal(0,0,0);
              this.orderDetail.ivaOrder = this._dS.formatMoney(0, 0,  '.', ',');
              this.orderDetail.totalDomicilio = this._dS.formatMoney(0, 0,  '.', ',');
            }
            Swal.hideLoading();
            Swal.close();
          }, error=>{
            this.getTotal(0,0,0);
            this.orderDetail.ivaOrder = this._dS.formatMoney(0, 0,  '.', ',');
            this.orderDetail.totalDomicilio = this._dS.formatMoney(0, 0,  '.', ',');
            Swal.close();
            Swal.fire('', 'Error en servicio, Vuelve a intentarlo', 'error');
          })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then();
  }

  private getTracking(){
    if(!this.eventFirebaseChange) {
      this.coordinatesMap = {longitude: 0, latitude: 0};

      this._dS.getTracking(this.orderDetail.orderId)
      .once('value').then((res:any) => {
        const value = res.val();
        console.log('cambiando corrdenadas desde getTracking', value);
        if(!!value && (this.coordinatesMap.longitude == 0 || this.coordinatesMap.latitude == 0)) {
          this.coordinatesMap = { 
            longitude: value?.last_known_longitude,
            latitude: value?.last_known_latitude
          }
        }
      });

      this.eventFirebaseChange = this._dS.getTracking(this.orderDetail.orderId)
      .on('child_changed', (res:any)=>{
        const coords = res.val();
        if(coords && this.coordinatesMap) {
          if(res.key == 'last_known_longitude' && coords != this.coordinatesMap.longitude) 
            this.coordinatesMap = {longitude: coords, latitude: this.coordinatesMap.latitude};
          if(res.key == 'last_known_latitude' && coords != this.coordinatesMap.latitude) 
            this.coordinatesMap = {longitude: this.coordinatesMap.longitude, latitude: coords};
            this.omap.setMessengerCoordinates(this.coordinatesMap);
        }
      })
    }
  }

  private gestionarClickWhatsapp(order){
    const subscribe = this._dS.insertClickWhatsApp(order).subscribe({});
    this.subscribes.push(subscribe);
  }

  private getTotal(subtotal, totalPrice, discount) {
    this.orderDetail.subTotalPrice =  this._dS.formatMoney(subtotal, 0,  '.', ',');
    this.orderDetail.totalPrice = this._dS.formatMoney(totalPrice, 0,  '.', ',');
    this.orderDetail.discount = this._dS.formatMoney(discount, 0,  '.', ',');
  }

  private getPrescriptionImage(){
    this.medicalFormula = false;
    const subscribe = this._oS.getPresciption(this.orderDetail.orderId).subscribe({
      next: (rta:any) => {
        rta.data.message ? this.photoRX = rta.data.message : this.photoRX = '../assets/images/sin_imagen.jpg';
      }, 
      error: error => this.photoRX = '../assets/images/sin_imagen.jpg'
    });
    this.subscribes.push(subscribe);
  }


  private initPermission(){
    this.permission.edit = this.actionsM.edit;
    this.permission.observations = this.actionsM.observations;
    this.permission.reassign = this.actionsM.reassign;
    this.permission.assign = this.actionsM.assign;
    this.permission.cancel = this.actionsM.cancel;
    this.permission.token = this.actionsM.token;
    this.permission.repush = this.actionsM.repush;
    this.permission.relaunch = this.actionsM.relaunch;
    this.permission.manager = this.actionsM.manager;
    this.permission.reschedule = this.actionsM.reschedule;
    this.permission.zendesk = this.actionsM.zendesk;
    this.permission.blockUser = this.actionsM['block-user'];
    this.permission.finalize = this.actionsM.finalize;
    this.permission.activeOrder = this.actionsM['activeOrder'] || this.actionsM['active-order'];
    this.permission.customer_phone = this.actionsM.customer_phone;
    this.permission.picking = !(!this.permission.edit && !this.permission.reassign && !this.permission.cancel &&
       !this.permission.repush && !this.permission.manager && !this.permission.finalize)
  }

  private clear(){
    this._dS.orderActive = null;
    this.subscribes.forEach(subscribe => {
      try {
        if(subscribe) subscribe?.unsubscribe();
      }catch(_){}
    });
    this.orderValuesSubcription?.unsubscribe();
    this.stateCustomer = false;
    this.openToken = false;
    this.orderDetail = undefined;
    this.customerAddressSelected = undefined;
    this.addComment = true;
    this.newCommnet = '';
    this.currentDate = undefined;
    this.coordinatesMap = {longitude: 0, latitude: 0};
    this.errNewComment= '';
    this.time = {text:'', value:''};
    this.expands = {
      products_real:false,
      products_theorical: false,
      products_missing:false,
      cancel_evidences: false
    };
    this.opn = {products_real:false, products_theorical: false, picking: false, products_missing:false};
    this.order = undefined;
    this.currentDate = Date.now();
    this.formSearchProd = { type : 'codigo', value: ''};
    this.formSearchProdMissing = { type : 'codigo', value: ''};
    this.formCourier = undefined;
    this.photoRX = undefined;
    this.medicalFormula = undefined;
    this.ticketSelected = undefined;
    this.eventFirebaseChange = undefined;
    this.orderIdpayment = undefined;
    this.colsProduct = colsProduct
    if(this.actionsM) this.initPermission();
  }

  get productosVisual(){
    const products = [];
    const arryProds:Array<any> = _.sortBy(this.productListFull, 'id');
    for (let i = 0; i < arryProds.length; i++) {
      const product:any = arryProds[i];
      if(i > 0 && (product.sending || product.alone)) { products.push(null); }
      products.push(product);
    }
    return products;
  }

  get heightTable(){
    const nSpaces = this.productosVisual.filter(p => p == null).length;
    return ((this.productosVisual.length - nSpaces) * 72) + 185 + (nSpaces * 14);
  }

  get iconPay(){
    return {
      'payu': this.orderDetail.isTrxLinePayU, 
      'mp': this.orderDetail.isTrxLineMercadoPago, 
      'pse': this.orderDetail.isPse,
      'dphone': this.orderDetail.POSNumber
    }
  }

  get isMapActive():boolean {
    return environment.isVenezuela || environment.isColombia && this.orderDetail.status == 'FACTURADA';
  }

  getShowTransferModal(): boolean {
    const statusList: Array<string> = [
      'FACTURADA',
      'ENTREGADA',
      'FINALIZADA',
      'CANCELADA',
      'DEVOLUCION EXITOSA',
      'DEVOLUCION_EXITOSA',
      'EN PUNTO DE ENTREGA',
      'EN_PUNTO_DE_ENTREGA',
      'CAPTURA BOUCHER',
      'CAPTURA_BOUCHER',
    ];
    return countryConfig?.isColombia && this._uS.getLocalUser()?.canCreateTransfers && !statusList.includes(this.orderDetail?.status) && !!this.numberOfStores;
  }

  setShowTransferModal(value: boolean): void {
    this.showTransferModal = value;
  }

  setNumberOfStores(orderDetail): void {
    const storeIds = [];
    orderDetail?.forEach(item => {
      if(!storeIds?.includes(item?.storeId)) storeIds?.push(item?.storeId);
    });
    this.numberOfStores = storeIds?.length;
  }

  onUpdateOrder(value: boolean): void {
    this.close.emit();
    this.refresh.emit(this.orderDetail?.orderId);
  }
  call(value){
    this.orderSelect = this.orderDetail;
    this.getDataTypification(value);
    if(value === 1 || value === 2 || value === 3 ){
      this.sendCall(value)
    }else if(value){
      this.dial_id = null;
      this.isVisible = true;
    }
  }

  handleOk(): void {  
    this.isVisible = false;
    this.typeUser = undefined;
    this.sendForm = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.typeUser = undefined;
    this.sendForm = false;
  }

  getDataTypification(id){
    this._oS.getTypicationCallAwaure(id).subscribe({
      next: (res:any) =>{
          if(id === 0){
            this.typification = res?.data;
          }
      },
      error: (error) =>{
        this.toastr.error(error, null)
      }
    }
    )
  }

  sendCall(id){
    this.callActive = true;
    let port;
    port = this._dS.getPort();
    if(port !== undefined && this.callActive){
      this._oS.sendCallUser(port, id ,this.orderDetail.orderId).subscribe({
        next: (response:any) =>{
            this.callActive = false;
            this.dial_id = response?.data?.dial_id
            this.isVisible = true;
            this.toastr.success("Llamada en curso......", null)
            this.messageCall = 'Llamada en curso......';
            setTimeout(() => {
              this.messageCall = '';
            }, 4000);
          },
          complete:() =>{
          },
          error: () =>{
            this.callActive = false;
            this.isVisible = false;
            this.toastr.error("Error intentando llamar al usuario", null)
            this.messageCall = 'Error intentando llamar al usuario';
            setTimeout(() => {
              this.messageCall = '';
            }, 4000);
            this.typeUser = undefined;
          }
      } 
      )
    }else{
      this.callActive = false;
      this.toastr.error("El usuario no tiene un puerto configurado")
    }
  }

}

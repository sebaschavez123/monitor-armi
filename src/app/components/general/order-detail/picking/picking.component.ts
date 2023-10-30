import { Component, OnInit, Input, Output, EventEmitter, Injectable, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import * as moment from 'moment-mini-ts';
import { DashboardService } from '../../../../services/dashboard.service';
import { FirebaseService } from '../../../../services/firebase.service';
import { OrderService } from '../../../../services/order.service';
import { countryConfig } from 'src/country-config/country-config';
import { environment } from 'src/environments/environment';
import { firstValueFrom, take } from 'rxjs';
import { getChangeButtons, CbType } from './change-buttons';
import { Storage } from 'src/app/core/storage';
import { User } from 'src/app/core/interfaces';
import { InfoModalComponent } from './info-modal/info-modal.component';

interface mdlCBType { show:boolean, params: CbType }
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'picking',
  templateUrl: './picking.component.html',
  styleUrls: ['./picking.component.scss']
})
@Injectable({
  providedIn: 'root',
})
export class PickingComponent implements OnInit {

  @Input() permission:any;
  @Input() typeReport:string;
  @Input() order:any;
  @Input() invoice = false;
  @Input() disabledActiveButton = false;
  @Output() action = new EventEmitter();
  @ViewChild('finishModal') finishModal: InfoModalComponent;
  extra = {states:false,incomplete:false}
  paymentsMethods: any[] = [];
  changeButtons = getChangeButtons();
  mdlChangeButtons: mdlCBType = {show:false, params: null};
  DEFAULT_COURIER = -1;
  NO_INCENTIVE = '0';
  mdlLaunch: any = { show:false, courierId: this.DEFAULT_COURIER, incentive: this.NO_INCENTIVE,title: ''};
  mdlCancel: any = { 
    show:false,
    title: '',
    loading: false,
    invalid: false,
    options: { reason: -1, products: [], sms: true, evidences: null }
  };
  headers = countryConfig.headersNgZorro;
  limitUpdateEvidence = 4;
  canShowButton:boolean=false;

  mdlFinishOptions= {
    btnOkText: 'Finalizar',
    textarea: {
        placeholder: 'Escribe la razón por la cual se va a finalizar el pedido...'
    }
  }
 

  private couries:any;
  private cancellationReasons:Array<any> = [];
  private finishReasons:Array<any> = [];
  private trasnfersReasons:Array<any> = [];
  private maxValueList = [];
  private courierList = '';
  private user: User;
  isVenezuela: boolean;
  get onMobile() {
    return document.documentElement.ontouchstart !== undefined;
  }
  
  constructor(
    private _dS:DashboardService,
    private _oS:OrderService,
    private _fS:FirebaseService
  ) {
    this.user = this._dS.getLocalUser();
    this.allowBtns()
  }
              

  ngOnInit() {
    this.getCouriers();
    this.getCancellationReasons();
    this.getTranfersReason();
    this.isVenezuela = countryConfig.isVenezuela;
    if(countryConfig.isVenezuela) {
      this.getFinishReasons()
    } else {
      if(this.user.rolUser == 'PICKER RAPPICARGO')
      this._oS.getOrderUuid(this.order.orderId).subscribe({
        next: (rdata: any []) => {
          if(rdata.length > 0) {
            const reg = rdata.find((e) => e.courierName == 'RAPPICARGO');
            this.order.uuid = reg ? reg.uuid : '';
          }
        }
      });
    }
    this._dS.event.subscribe(event=>{
      if(event.type === 'init-couriers'){
        this.getCouriers();
      }
    });
    this.selectsInit();
    this.loadChangesData(this.order);
  }
  allowBtns():void {
    const user = Storage.getAll('dataCount');
    this.canShowButton= parseInt(user.allowFinishCancelRelaunch) === 1 || countryConfig.isVenezuela? true : false;
  }
  selectsInit() {
    const config = countryConfig.isVenezuela
      ? { max: 1, increment: 0.05, decimals: 2 }
      : { max: 4500, increment: 500, decimals: 0 };
    for (let index = 0; index <=config.max ; index+= config.increment) {
      const relaunchValue = index.toFixed(config.decimals);
      this.maxValueList.push(relaunchValue);
    }
    
    this.mdlLaunch.title = `¿Relanzar order: # ${this.order?.orderId}?`;
    this.mdlCancel.title = `¿Cancelar order: # ${this.order?.orderId}?`;
  }

  get restrictionReassing(){
    return this.permission.reassign && this.order.status !== 'FACTURADA' && this.order.status !== 'EMITIDA' && this.order.status !== 'RECIBIDA';
  }
  get restrictionZendesk(){
    return this.permission.zendesk;
  }
  get restrictionRepush(){
    return this.permission.repush && this.order.status === 'EMITIDA';
  }
  get restrictionCancel(){
    return this.permission.cancel && this.order.status !== 'CANCELADA';
  }
  get restrictionManager(){
    return this.permission.manager && this.order.status === 'GESTIONADO';
  }
  get restrictionFinish(){
    return this.order.status != 'FINALIZADA' && this.order.status != 'CANCELADA' && this.permission.finalize;
  }
  get restrictionEnlist(){
    return this.order.status !== 'PEDIDO ENVIADO' && this.order.status !== 'PEDIDO ALISTADO'
    && (this.typeReport === 'nacional-envialo-ya' || this.typeReport === 'order-imcomplete' || this.typeReport === 'rx' ||
    (this.typeReport === 'search' && this.order.status === 'PEDIDO INCOMPLETO' && this.order.storeId === '1000' || this.order.storeId === '1001'));
  }
  get restrictionSend(){
    return this.order.status === 'PEDIDO ALISTADO' && this.typeReport === 'nacional-envialo-ya' || this.typeReport === 'order-imcomplete' ||
    this.typeReport === 'rx' || (this.typeReport === 'search' && this.order.storeId === '1000' || this.order.storeId === '1001');
  }
  get restrictionIncomplete(){
    return countryConfig.isColombia && this.order.status === 'PEDIDO INCOMPLETO' &&
    (this.typeReport === 'nacional-envialo-ya' || this.typeReport === 'order-imcomplete' || this.typeReport === 'rx') ||
    (this.typeReport === 'search' && (this.order.storeId === '1000' || this.order.storeId === '1001'));
  }
  get restrictionIncompleteOrder(){
    return countryConfig.isColombia && this.order.status !== 'PEDIDO INCOMPLETO' &&
    (this.typeReport === 'nacional-envialo-ya' || this.typeReport === 'order-imcomplete' || this.typeReport === 'rx') ||
    (this.typeReport === 'search' && (this.order.storeId === '1000' || this.order.storeId === '1001'));
  }
  get restrictionActive(){
    if(this.permission.activeOrder && (this.order.status === 'CANCELADA' || this.order.status === 'FINALIZADA')) return true;
    return false;
  }
  get restrictionUpdateDate(){
    return this.typeReport === 'programmed';
  }
  get restrictionMessengerFinish(){
    return countryConfig.isColombia && this.permission.finalize && this.order.status !== 'FINALIZADA' && this.order.messenger && false;
  }
  get restrictionReschedule():boolean{
    return this.permission.reschedule && ((this.order.status !== 'CANCELADA' && this.order.status !== 'FINALIZADA' && this.order.status !== 'FACTURADA') ||
    (this.typeReport === 'antifraud' && this.order.status === 'BLOQUEADA FRAUDE'));
  }
  get restrictionReservation():boolean{
    return countryConfig.isColombia && (this.order.status !== 'FINALIZADA' && this.order.status !== 'FACTURADA') ||
    (this.typeReport === 'antifraud' && this.order.status === 'BLOQUEADA FRAUDE');
  }
  get restrictionLaunch():boolean{
    const hasFraud = this.typeReport === 'antifraud' && this.order.status === 'BLOQUEADA FRAUDE';
    /* && this.order.paymentMethod !== 'pse'*/
    const hasRelaunch = this.order.status !== 'CANCELADA'
      && this.order.status !== 'FINALIZADA' 
      && this.order.status !== 'FACTURADA';
    return this.permission.relaunch && (hasRelaunch || hasFraud);
  }
  get restrictionAssing(){
    return this.permission.assign && this.order.status !== 'FACTURADA' && this.order.status !== 'EMITIDA' && this.order.status !== 'RECIBIDA';
  }
  get restrictionInvoiceManual(){
    return countryConfig.isVenezuela && this.order.status !== 'CANCELADA' && this.order.status !== 'FINALIZADA';
  }
  get restrictionStops(){
    return (countryConfig.isVenezuela || (countryConfig.isColombia && this.order.courierName == "APOYO_FTD")) 
    && this.order.status !== 'EMITIDA' && this.order.status !== 'CANCELADA';
  }

  get restrictionStarPicking() {
    return this.order.status == 'EMITIDA' || this.order.status == 'ENVIADA';
  }

  get restrictionAssingAndRelaunch() {
    const restrictions = this.restrictionAssing && this.restrictionLaunch;
    return countryConfig.isVenezuela && restrictions;
  }

  showChangeButtons() {
    return  countryConfig.isColombia && (this.user.canChangeOrders == 1);
      //&& (this.order.status !== 'FINALIZADA' && this.order.status !== 'FACTURADA');
  }    

  onlyCol() { return countryConfig.isColombia; }

  loadChangesData(order) {
    if(this.order && this.onlyCol()) {
      Promise.all([
        this._oS.listPaymentMethods(),
        this._oS.getOrderChangeMonitor(this.order.orderId)
      ]).then((values: any[]) =>{
        this.paymentsMethods = values[0].data.map(pm => {
          return { label: pm.description, value: pm.id };
        });
        let changesData = values[1]?.data;
        if(changesData?.length) {
          for (let cdi = 0; cdi < changesData.length; cdi++) {
            const cd = changesData[cdi].orderChangeType?.name;
            this.changeButtons.forEach((b) => {
              if(b.marked != undefined && b.name == cd){ b.marked = true; }
              let findex = b.fields?.findIndex( fld => fld.name.toLowerCase() == cd.toLowerCase());
              if(findex > -1) {
                b.fields[findex].value = Number(changesData[cdi].value);
              }
            });
          }
        }
      });
    }
  }

  getCurrentPaymentMethod() {
    return this.paymentsMethods.find( (pm) => pm.label.toLowerCase() == this.order.paymentMethod.toLowerCase());
  }

  edit() {
    if(this.order.products.length === 0){
      Swal.fire('', 'No tiene productos para editar', 'error');
    return;
  }
  Swal.fire({
    title: 'Confirmación',
    text: '¿Está seguro de editar los productos de la orden?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'SI',
    cancelButtonText: 'NO'
  }).then((result) => {
      if (result.value) {
        const arrayItem = [];
        this.order.products.forEach((x : any) => {
        // tslint:disable-next-line: radix
        arrayItem.push({itemId: parseInt(x.id) ,quantityRequested: x.units});
      });
      this.loadPromise(
        firstValueFrom(this._oS.update(this.order, arrayItem, '2.0')),
        'Se editó la orden exitosamente',
        'Error en servicio',
        'edit'
      );
    }
  });
  }
  recalculate() {
    this.loadPromise(
      firstValueFrom(this._oS.recalculate(this.order.orderId)), 
      'La orden fue recalculada correctamente',
      'No es posible recalcular la orden',
      'manager'
    );
  }

  reasign() {
      Swal.fire({
        title: 'Reasignación',
        text: 'Seleccione el courier',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancelar',
        input: 'select',
        inputOptions: this.couries,
        inputPlaceholder: 'Courier',
        preConfirm: (courier)=>{
          if (!courier || courier === '') {
            Swal.showValidationMessage(`Por favor seleccione el courier`)
          }else return courier;
        }
      }).then((result) => {
        if(result.value) {
          this.loadPromise(
            firstValueFrom(this._oS.reassing(this.order.orderId, result.value)),
            'La orden fue reasignada correctamente',
            'Error en servicio',
            'reassign'
          );
        }
      });
}

assingMessenger() {
  Swal.fire({
    title: 'Ingrese Id del mensajero que asignará en esta orden',
    html:'<input type="number" id="messengerIdAssing" class="swal2-input readonly form-control" autofocus placeholder="Id del mensajero">',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    preConfirm: (reason) =>{
      const value = (document.getElementById('messengerIdAssing') as HTMLSelectElement).value;
      if (!value || value === '') Swal.showValidationMessage(`Por favor ingrese id del mensajero`)
      else return value;
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
      if(result.value){
        return this.loadPromise(
          firstValueFrom(this._oS.assingMessenger(this.order.orderId, result.value )),
          'La orden fue asignada al mensajero satisfactoriamente',
          'No es posible asignar la orden',
          'reassign',
          null,
          null,
          true
        );
      }
  });
}

repush(){
  Swal.fire({
    title: 'Confirmación',
    text: '¿Realmente desea reimpulsar la orden?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'SI',
    cancelButtonText: 'NO'
  }).then((result) => {
      if (result.value) {
        this.loadPromise(
          firstValueFrom(this._oS.repushOrder(this.order.orderId)),
          'La orden fue reimpulsada correctamente',
          'No es posible reimpulsar la orden',
          'repush'
        );
      }
  });
}

cancel(mdl:boolean = false) { 
  // solo Mon-Col
  if(mdl) { 
    this.mdlCancelSend();
    return;
  }
}

get hasEvidence() {
  return countryConfig.isVenezuela;
}

get refundText() {
  return countryConfig.isColombia 
    ? {title: 'Validar',  mdlText: 'La Validación'}
    : {title: 'Reversar', mdlText: 'El Reverso'}
}

validateRfund( data ) {
  Swal.fire({
    title: `${this.refundText.title} Orden`,
    text: `Complete la información`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: this.refundText.title,
    cancelButtonText: 'Cancelar',
    input: 'textarea',
    inputPlaceholder: 'Observaciones',
    preConfirm: (observations)=>{
      if (!observations || observations === '') {
        Swal.showValidationMessage(`Por favor complete el campo de onservaciones`)
      }else if(observations && observations.length > 500){
        Swal.showValidationMessage(`El texto de observaciones debe tene menos de 500 caracteres`)
      }
      else return observations;
    }
  }).then(({value}) => {
    if(value) {
      const orderId = data.orderId;
      const employeeNumber = this._dS.getLocalUser().employeeNumber;
      const observation = value;
      this.loadPromise(
        firstValueFrom( this._oS.sendValidationFromRefoundOrder(observation, orderId, employeeNumber) ),
        `${this.refundText.mdlText} se realizó correctamente`,
        'Error en servicio',
        'refund'
      );
      this._oS.reverseTransaction(orderId).then();
    }
  });
}

mdlCancelSend() {
  const reason = this.mdlCancel.options.reason;
  const obs = this.mdlCancel.options.sms ? 'on': 'off'
  const productList = {
    orderId: this.order.orderId,
    storeItems: this.mdlCancel.options.products
      .filter(p => p.checked)
      .map((p:any) => { return {item: p.id, store: p.storeId} })
  };
  
  // evidencias obligatorias
  //|| (countryConfig.isVenezuela && this.mdlCancel.options.evidences?.length < 1)
  if(
    (this.mdlCancel.options.reason < 0) || (this.showProductList(reason) && productList.storeItems.length < 1)
  ) {
    this.mdlCancel.invalid = true;
    return;
  }
  if (this.typeReport === 'search' || !this.typeReport) {
    this.loadPromise(
      firstValueFrom(
        this._oS.cancel(this.order, obs, this.mdlCancel.options.reason, this.mdlCancel.options.evidences )
      ),
      'La orden fue cancelada correctamente',
      'No es posible cancelar la orden',
      'cancel',
      ()=>{
        this._fS.canceledOrder(this.order.orderId).subscribe((rta:any) => {});
        this._oS.saveOrderWithoutStock(productList).subscribe((rta:any) => {});
      }
    );
  } 
  else if(this.typeReport === 'provider'){
    this.loadPromise(
      firstValueFrom(this._oS.cancelProvider(this.order, obs, reason )),
      'La orden fue cancelada correctamente',
      'No es posible cancelar la orden',
      'cancel'
    );
  }
  else {
    this.loadPromise(
      firstValueFrom(this._oS.cancelNoExpress(this.order, obs, reason )),
      'La orden fue cancelada correctamente',
      'No es posible cancelar la orden',
      'cancel'
    );
  }
}

manager(){
  this.loadPromise(
    firstValueFrom(this._oS.manage(this.order)), 
    'La orden fue gestionar correctamente',
    'No es posible gestionar la orden',
    'manager'
  );
}

finish(forma = null){
  if(countryConfig.isColombia) {
    this.finishModal.open();
  } else {
    Swal.fire({
      title: '¿Realmente desea finalizar la orden?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      html: this.createSelectFinishReasons(),
      preConfirm: (reason) =>{
        const value = (document.getElementById('swal-input1') as HTMLSelectElement).value;
        if (!value || +value == 0) Swal.showValidationMessage(`Por favor seleccione la razón de la finalización`)
        else return value;
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if(result.value){
        return this.loadPromise(
          firstValueFrom(this._oS.finalize(this.order.orderId, '', result.value)),
          'La orden fue finalizada correctamente',
          'No es posible finalizar la orden',
          'finish'
        );
      }
    });
  }
}

finishAction({comment, files}) {
  if(!files[0]) return;
  this.loadPromise(
    firstValueFrom(this._oS.finalize(this.order.orderId, comment, null, files[0] )),
    'La orden fue finalizada correctamente',
    'No es posible finalizar la orden',
    'finish',
    () => { this.finishModal.close(); }
  );
}

enlist(){
  this.loadPromise(
    firstValueFrom(this._oS.modifyStatus(this.order,24)),
    'La orden fue alistada correctamente',
    'No es posible alistar la orden',
    'enlist'
  );
}

send(){
  this.loadPromise(
    firstValueFrom(this._oS.modifyStatus(this.order,25)),
    'La orden fue enviada correctamente',
    'No es posible enviar la orden',
    'send'
  );
}

sendIncomplete(){
  this.loadPromise(
    firstValueFrom(this._oS.modifyStatus(this.order, 29)),
    'El estado de la orden fue actualizada a ENVIAR INCOMPLETA exitosamente',
    'No es posible cambiar el estado de la orden',
    'send-i'
  );
}

waitingCustomer(){
  this.loadPromise(
    firstValueFrom(this._oS.modifyStatus(this.order,30)),
    'El estado de la orden fue actualizada a CLIENTE ESPERA exitosamente',
    'No es posible cambiar el estado de la orden',
    'waiting-c'
  );
}

incomplete(){
  this.loadPromise(
    firstValueFrom(this._oS.modifyStatus(this.order,28)),
    'La orden fue marcada como incompleta exitosamente',
    'No es posible marcar la orden',
    'incomplete'
  );
}

active(){
  this.loadPromise(
    firstValueFrom(this._oS.activateCanceled(this.order.orderId)),
    'La orden fue activada exitosamente. La nueva orden generada es: ',
    'No es posible activar la orden, usuario no tiene permiso para está acción',
    'active',
    null,
    'id',
    true
  );
}

openLaunch() {

  this.mdlLaunch.courierId = this.DEFAULT_COURIER;
  this.mdlLaunch.incentive = this.NO_INCENTIVE;
  this.mdlLaunch.show = true;
}

openCancel() {
  this.mdlCancel.show = true;
  this.mdlCancel.invalid = false;
  this.mdlCancel.options = {
    reason: -1,
    sms: true,
    evidences: [],
    products: []
  };
}
 
launch() {
  const incentive =  { incentiveAmount: this.mdlLaunch.incentive};
  this.loadPromise(
    firstValueFrom(this._oS.launch(this.order.orderId, incentive)),
    'La orden fue relanzada exitosamente.',
    'No es posible relanzar la orden, usuario no tiene permiso para está acción',
    'launch', null, 'id'
  );
}


invoiceManually(){
  this.loadPromise(
    firstValueFrom(this._oS.invoiceManually(this.order.orderId, !this.invoice)),
    'La orden fue marcada como Facturada manualmente ',
    'No es posible realizar esta acción',
    'invoiceManually',
    () => { this.invoice = !this.invoice; }
  );
}

updateDate(){
  Swal.fire({
    title: 'Selecciona una nueva fecha',
    html:'<input type="datetime-local" id="datetimepicker" class="swal2-input readonly form-control" autofocus>',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancelar',
    onOpen: ()=> {
      (document.getElementById('datetimepicker') as HTMLSelectElement).value = new Date().toString();
    }
  }).then((result:any) =>{
    if(result.value){
      const date = (document.getElementById('datetimepicker') as HTMLSelectElement).value;
      if (date === '') Swal.fire('Usted no ingresó la fecha', 'Vuelva a intentarlo', 'error');
      else{
        const newDate =  moment(date).format('YYYY/MM/DD H:mm:ss');
        this.loadPromise(
          firstValueFrom(this._oS.updatePickingDate(this.order.orderId,  newDate)),
          'Se ha realizado cambio de fecha y hora de la orden',
          'No es posible cambiar fecha y hora de la orden',
          'update-date'
        );
      }
    }
  });
}

showProductList(reason) {
  const options = countryConfig.isColombia
    ? [1, 22]
    : [14];
  return options.findIndex(n => n == reason) > -1;
}

reasonChanged(data){
  if(this.showProductList(data)) { this.getTheorical(); }
}

private getTheorical() {
  this.mdlCancel.loading = true;
  this._oS.getDetailTheoretical(this.order.orderId)
    .pipe(take(1))
    .subscribe({
    next: (rta:any) => {
      this.mdlCancel.options.products = rta.data.orderDetail;
      if(this.mdlCancel.options.products.length == 1) {
        this.mdlCancel.options.products[0].checked = true;
      }
    },
    complete: () =>{
      this.mdlCancel.loading = false;
    }
  });
}

messengerFinish(){
  Swal.fire({
    title: 'Confirmación',
    text: '¿Realmente desea finalizar la orden al mensajero?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
      if(result.value){
        return this.loadPromise(
          firstValueFrom(this._oS.finalizarEmployee(this.order.orderId)),
          'La orden fue finalizada al mensajero correctamente',
          'No es posible finalizar la orden al mensajero',
          'finish',
          () =>{
            this._fS.finalizedOrder(this.order.orderId).subscribe({});
          }
        );
      }
});
}

reschedule(){
  var now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  Swal.fire({
    title: 'Selecciona una nueva fecha',
    html:'<input type="datetime-local" id="datetimepicker"  min="'+now.toISOString().slice(0,16)+'" class="swal2-input readonly form-control" autofocus>',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancelar',
    onOpen: ()=> {
      now.setHours(now.getHours() + 1);
      (document.getElementById('datetimepicker') as HTMLSelectElement).value = now.toISOString().slice(0,16);
    }
  }).then((result:any) =>{
    if(result.value){
      const date = (document.getElementById('datetimepicker') as HTMLSelectElement).value;
      if (date === '') Swal.fire('Usted no ingresó la fecha', 'Vuelva a intentarlo', 'error');
      const newDate =  moment(date);
      if(!moment(date).isAfter(moment(new Date()))) Swal.fire('Fecha no permitida', 'La fecha ingresada debe ser mayor a la actual', 'error')
      else{
        this.loadPromise(
          firstValueFrom(this._oS.updateExpress(this.order.orderId, newDate.format('YYYY/MM/DD H:mm:ss'), true)),
          'Se ha realizado cambio de fecha y hora de la orden.' +  (environment.isColombia ? 'La nueva orden generada es:' : ''),
          'No es posible cambiar fecha y hora de la orden',
          'update-date',
          null,
          'id'
        );
      }
    }
  })
}

reservation(){
  Swal.fire({
    title: 'Confirmación',
    text: '¿Realmente desea reservar la orden?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'SI',
    cancelButtonText: 'NO'
  }).then((result) => {
      if (result.value) {
      this.loadPromise(
        firstValueFrom(this._oS.reservationExpress(this.order.orderId)), 
        'La orden fue reservada correctamente con el siguiente id: ',
        'No es posible reservar la orden',
        'reservation',
        null,
        'id'
      );
    }
  });
}

createTicket() {
  this.action.emit({type: 'new-ticket', order: this.order});
}

addStop() {
  Swal.fire({
    title: '¿Desea asociar traslado en la orden?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    html: this.createSelectStopsReasons(),
    preConfirm: (reason) =>{
      const valueList = (document.getElementById('swal-input1') as HTMLSelectElement).value;
      const valueInput = (document.getElementById('swal-input2') as HTMLSelectElement).value;
      if (!valueList || +valueList == 0) Swal.showValidationMessage(`Por favor seleccione la razón de la finalización`);
      if (!valueInput) Swal.showValidationMessage(`Por favor ingrese número de traslados`);
      else return {valueList, valueInput};
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if(result.value){
      return this.loadPromise(
        firstValueFrom(this._oS.tranfer(this.order.orderId, result.value.valueInput, result.value.valueList)),
        'Traslado asociado correctamente',
        'No es posible agregar traslado a la orden',
        'transfer'
      );
    }
  });
}

showAllButtons() {
  return this._dS.getLocalUser().rolUser !== 'PICKER RAPPICARGO';
}

startPicking() {
  const data = {
    status: "PICKING",
    uuid: this.order.uuid,
    "order_no": this.order.orderId,
  };
  return this.loadPromise(
    firstValueFrom(this._oS.startPicking(data)),
    `Picking para la orden ${this.order.orderId}`,
    'No fue posible iniciar picking, intente de nuevo!',
    null
  );
    
}

changeButtonShow(cbs) {
  if(cbs.name == 'PAYMENT_METHOD') {
    cbs.fields[0].options = this.paymentsMethods;
    if(!cbs.fields[0].value) {
      cbs.fields[0].value = this.getCurrentPaymentMethod().value;
    }
  }
  this.mdlChangeButtons.show = true;
  this.mdlChangeButtons.params = cbs;
}

changeButtonHide() {
  this.loadChangesData(this.order.orderId);
  this.mdlChangeButtons = {show: false, params: null};
}

changeButtonClick(cbs) {
  switch (cbs.id) {
    case 1:
      this.loadPromise(
        this._oS.roundTrip(this.order.orderId),
        cbs.successText, cbs.rejectText, 'cancel-button', () => {this.changeButtonHide(); }
      );
      break;
    case 2:
      this.loadPromise(
        this._oS.recordTransfer(this.order.orderId, cbs.fields[0].value, cbs.fields[1].value),
        cbs.successText, cbs.rejectText, 'cancel-button', () => {this.changeButtonHide(); }
      );
      break;
    case 3:
      this.loadPromise(
        this._oS.changeMenthod(this.order.orderId, cbs.fields[0].value),
        cbs.successText, cbs.rejectText, 'cancel-button', () => {this.changeButtonHide(); }
      );
      break;
    case 4:
      this.loadPromise(
        this._oS.changeDistance(this.order.orderId, cbs.fields[0].value),
        cbs.successText, cbs.rejectText, 'cancel-button', () => {this.changeButtonHide(); }
      );    
      break;
    
    default:
      break;
  }
}

getOption(type: number, option: any) {
  return (type == 1)
    ? (typeof option != 'object') ? option : option.value
    : (typeof option != 'object') ? option : option.label;
}

// this._dS.verifyUser(this.order.customerId)


  private loadPromise(promise:Promise<any>, successMjs:string, errorMjs:string, type:string, aditional?:Function, addMjs?:string, nativeMessage = false){
    Swal.fire({
      title: 'Modificando orden!',
      text: 'Estamos actualizando la orden, por favor espere.',
      showCancelButton: false,
      showConfirmButton:false,
      onBeforeOpen: ()=>{
        Swal.showLoading();
        return promise.then((rta:any)=>{
          Swal.hideLoading();
          Swal.close();
          if(aditional) aditional();
          this.action.emit({type, order: this.order});
          if(rta.data) rta = rta.data;
          if(addMjs) successMjs = successMjs + ' ' + (rta[addMjs] || '');
          Swal.fire('', successMjs, 'success');
          if(type === 'cancel') this._dS.actionCancel(this.order.orderId);
        }, error=>{
          Swal.close();
          if(!nativeMessage) Swal.fire('', errorMjs, 'error');
          else Swal.fire('', error.error.message, 'error');
        })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((res:any)=>{});
  }

  private getCouriers(){
    this.couries = {};
    this._dS.couriers.forEach(x => {
      if(x.name !== this.order?.courierName) {
        this.couries[x.id] = x.name;
      }
    });
  }

  private getCancellationReasons(){
    const arrayReasons = {};
    this._oS.getListCancellationReason().subscribe({
      next: (rta:any) => {
          rta.data.forEach((val : any, key: any) => {
              arrayReasons[val.id] = val.description;
              this.cancellationReasons.push({label: val.description, value: val.id});
          });
          this.createSelectCancellationReasons();
      },
      error: (error) => {
        // error no gestionado.        
      }
    });
  }

  private getFinishReasons(){
    const arrayReasons = {};
    this._oS.getListFinalizationReason().subscribe(
    (rta:any) => {
        rta.data.forEach((val : any, key: any) => {
            arrayReasons[val.id] = val.description;
            this.finishReasons.push({label: val.description, value: val.id});
        });
        this.createSelectFinishReasons();
    },
    error => {
    });
  }

  private getTranfersReason(){
    const arrayReasons = {};
    this._oS.getListTranfersReason().subscribe(
    (rta:any) => {
        rta.data.forEach((val : any, key: any) => {
            arrayReasons[val.id] = val.description;
            this.trasnfersReasons.push({label: val.description, value: val.id});
        });
        this.createSelectStopsReasons();
    },
    error => {
    });
  }

  private createSelectCancellationReasons():string{
    let selectCancellationReasons = '<div style="display: block;text-align: center;">¿Cúal es la razón de cancelación?</div>'
    selectCancellationReasons = '<select id="swal-input1" class="swal2-select" onchange="this.value == \'10\'? document.getElementById(\'swal-input2\').style.display = \'block\': document.getElementById(\'swal-input2\').style.display = \'none\'">';
    selectCancellationReasons += '<option value="0" disabled="" selected>Razón</option>';
    this.cancellationReasons.forEach((val : any, key: any) => {
      selectCancellationReasons += '<option value="'+val.value+'">'+val.label+'</option>';
    });
    selectCancellationReasons += '</select>';
    selectCancellationReasons += '<input id="swal-input2" class="swal2-input" placeholder="Observación" style="display:none">';
    selectCancellationReasons += '<label id="swal-checkbox">';
    selectCancellationReasons += '<input id="swal-input3" type="checkbox" value="1" checked /><span>Enviar SMS de cancelación<span>';
    selectCancellationReasons += '</label>';
    return selectCancellationReasons;
  }

  private createSelectFinishReasons():string{
    let selectfinishReasons = '<div style="display: block;text-align: center;">¿Cúal es la razón de finalización?</div>'
    selectfinishReasons = '<select id="swal-input1" class="swal2-select" onchange="this.value == \'10\'? document.getElementById(\'swal-input2\').style.display = \'block\': document.getElementById(\'swal-input2\').style.display = \'none\'">';
    selectfinishReasons += '<option value="0" disabled="" selected>Razón</option>';
    this.finishReasons.forEach((val : any, key: any) => {
      selectfinishReasons += '<option value="'+val.value+'">'+val.label+'</option>';
    });
    selectfinishReasons += '</select>';
    return selectfinishReasons;
  }

  private createSelectStopsReasons():string{
    let selectStopsReasons = '<div style="display: block;text-align: center;">¿Cúal es la razón de la parada?</div>'
    selectStopsReasons = '<select id="swal-input1" class="swal2-select">';
    selectStopsReasons += '<option value="0" disabled="" selected>Razón</option>';
    this.trasnfersReasons.forEach((val : any, key: any) => {
      selectStopsReasons += '<option value="'+val.value+'">'+val.label+'</option>';
    });
    selectStopsReasons += '</select>';
    selectStopsReasons += '<div style="display: block;text-align: center;">Número de traslados</div>';
    selectStopsReasons += '<input id="swal-input2" type="number" class="swal2-input" placeholder="Ingrese número">';
    return selectStopsReasons;
  }

  private dateValidation(date):boolean{
    const currentDate =  moment();
    return false;
    return currentDate < date;
  }

  getUploadFileUrl() { return this._dS.upload+'/upload'; }

  getProductUrl(id) {
    return `https://www.farmatodo.com.${countryConfig.cctld}/producto/${id}`; 
  }

  getProductAvatar(path) {
    return path || '/assets/images/not-product.png';
  }

  loadEvidence(data) {
    this.mdlCancel.options.evidences = data.fileList.map(img => img.response.link);
    this.mdlCancel.invalid = this.mdlCancel.options.evidences.length < 1;
  }

  get armireneLink() {
    return `https://armirene-dot-web-farmatodo.uc.r.appspot.com/order/${this.order.orderId}/courier/${21}?country=${countryConfig.cctld}`;
  }

  copyLink() {
    console.clear();
    Swal.fire('', '¡Link Copiado al portapapeles!', 'info');
    this._dS.copyTextToClipboard(this.armireneLink);
    this._dS.actionToken(this.order.orderId);
  }

  reasignAndRelaunch() {
    Swal.fire({
      title: 'Ingrese Id del mensajero que asignará en esta orden',
      html:'<input type="number" id="messengerIdAssing" class="swal2-input readonly form-control" autofocus placeholder="Id del mensajero">',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      preConfirm: (reason) =>{
        const value = (document.getElementById('messengerIdAssing') as HTMLSelectElement).value;
        if (!value || value === '') Swal.showValidationMessage(`Por favor ingrese id del mensajero`)
        else return value;
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if(result.value) {

        const incentive = !countryConfig.isVenezuela 
          ? { incentiveAmount: this.mdlLaunch.incentive} 
          : null;

        this.loadPromise(
          firstValueFrom(this._oS.reassingAndRelaunch(this.order.orderId, result.value)),
          'La orden fue reasignada y relanzada correctamente',
          'Error en servicio',
          'reassign'
        );
      }
    });
  }
}


import { Component, OnInit, Input, Output, ViewChild, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PickingComponent } from '../order-detail/picking/picking.component';
import * as _ from 'underscore';
import { DashboardService } from '../../../services/dashboard.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { GluedComponent } from '../glued/glued.component';
import Swal from 'sweetalert2';
import { OrderService } from 'src/app/services/order.service';
import { countryConfig } from 'src/country-config/country-config';
import { finalize } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
declare var $:any;



@Component({
  // tslint:disable-next-line: component-selector
  selector: 'general-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.scss']
})
export class OrdersTableComponent implements OnInit, OnChanges {

  isAllDisplayDataChecked = false
  isOperating = false
  isIndeterminate = false
  listOfDisplayData: any[] = []
  mapOfCheckedId: { [key: string]: boolean } = {}
  numberOfChecked = 0;
  orderSelected:any;
  searchText = '';
  scores: any[] = [{},{},{},{},{}];
  filtersActived: Array<any> = [];
  private listOfAllDataAux = [];
  private params = { pageSize: 1, pageIndex: 1, sort: [] };
  private timerSearch:any;
  permissions: any;
  storeFilterData: any = null;
  showGlued = false;
  refundInfo: Array<{orderId: any, isReversing: boolean, isRefunded: boolean}> = [];
  isLoadingValidateSuccessfulReturn: boolean = false;

  showObs: boolean = false;
  formObs: UntypedFormGroup;
  statusId: number;
  orderId: any;
  isColombia: boolean = countryConfig.isColombia;
  @Input() listOfAllData = [];
  @Input() cols = [];
  @Input() typeReport;
  @Input() missings:boolean;
  @Input() realtime:boolean = false;
  @Input() editCourier;
  @Input() exportPdf:boolean = undefined;
  @Input() showScores: boolean = true;
  @Input() orderType: string;
  @Input() defaultFn: Function = null;
  @Input() valuesTable:any = {loading : undefined, total: undefined, paginate: 50, pageIndex: 1};
  @Output() refresh = new EventEmitter();

  @ViewChild(GluedComponent) gluedTable: GluedComponent;


  constructor(private _dS:DashboardService,
              private _oS: OrderService,
              private _pC:PickingComponent,
              private toast:ToastrService,
              private fb: UntypedFormBuilder
              ) { }

  ngOnInit() {
    this.isOperating = true;
    this.permissions = this._dS.getPermissions('dashboard');
    this._pC.permission = this.permissions;
    this._pC.ngOnInit();
    this.formBuilder();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.listOfAllData) {
      this.isOperating = false;
      if(this.orderSelected){
        const index = this.listOfAllData.findIndex(o => o.orderId === this.orderSelected.orderId);
        if(index !== -1) this.orderSelected = {...this.listOfAllData[index]};
      }
      this.listOfAllData.forEach(item => (this.mapOfCheckedId[item.orderId] = false));
      if(!!this.orderType) { this.gluedTable?.getData(); }
      if (this.typeReport !== 'search') {
        this.listOfAllDataAux = this.listOfAllData;
        this.activeFilter();
        if(this.realtime && changes.listOfAllData.previousValue) {
          changes.listOfAllData.previousValue.forEach(oldOrder => {
            const index = changes.listOfAllData.currentValue.findIndex(order => order.orderId == oldOrder.orderId);
            if(index != -1 && oldOrder != changes.listOfAllData.currentValue[index]){
              $(`#order-${oldOrder.orderId}`).removeClass( "focus" );
              setTimeout(() => {$(`#order-${oldOrder.orderId}`).addClass( "focus" )},200);
            }
          });
        }
      } else {
        this.activeFilter(null, false);
      }
      this.storeFilterData = this.cols.filter(i => i.name === 'storeName')[0] || [];
    }
  }
  formBuilder(){
    this.formObs = this.fb.group({
      observation:['', Validators.required],
    });
  }
  showObservation(event: Event, orderId: string) {
    event.stopPropagation();
    event.preventDefault();
    this._dS.observationEvent.emit({action:'open', params: {orderId: orderId}});
    return false;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    return false;
  }

  get totalScores(): Array<any> {
    const total = [0,0,0,0,0];
    this.scores = [{},{},{},{},{}];
    this.listOfAllData.forEach((d) => {
      switch (d.status?.toUpperCase()) {
        case 'ENVIADA':
          total[0]++;
          this.setScoreData(d, 0);
          break;
        case 'ASIGNADA':
          total[1]++;
          this.setScoreData(d, 1);
          break;
        case 'PICKING':
          total[2]++;
          this.setScoreData(d, 2);
          break;
        case 'FACTURADA':
          total[3]++;
          this.setScoreData(d, 3);
          break;
        case 'ENTREGADA':
          total[4]++;
          this.setScoreData(d, 4);
          break;
        default:
          break;
      }
    });
    return total;
  }

  setScoreData(d:any, n: number) {
    const prop = d.totalObservationsOrder > 0 ? 'LB' : d.red;
    if (!!this.scores[n][prop]) {
      this.scores[n][prop]++;
    } else { 
      this.scores[n][prop] = 1;
    }
  }

  toogleGlued() {
    this.showGlued = !this.showGlued;
  }

  searchData(){
    if(this.searchText !== ''){
      clearTimeout(this.timerSearch);
      this.timerSearch = setTimeout(() => {
        if(this.listOfAllDataAux.length === 0) this.listOfAllDataAux = this.listOfAllData.slice(0);
        this.listOfAllData = this.listOfAllDataAux.filter((item:Object)=> {
          let itemString:string = JSON.stringify(item);
          return itemString.toLocaleLowerCase().indexOf(this.searchText.toLocaleLowerCase()) !== -1;
        });
      }, 1000);
    }else{
      this.listOfAllData = this.listOfAllDataAux;
      this.listOfAllDataAux = [];
    }
  }

  // tslint:disable-next-line: variable-name
  openWapp($event:Event, number:number, order?:any) {
    $event.stopPropagation();
    if(order) this._dS.insertClickWhatsApp(order).subscribe((rta:any) => {});
    window.open('https://api.whatsapp.com/send?phone=' + number,'_blank');
  }

  operateData(): void {
    this.isOperating = true;
    this.refresh.emit();
  }

  getBorderColor(item:any){
    if(item.status == 'FINALIZADA' || item.status == 'CANCELADA') return null;
    return {
      'border-tr-left-red': item.red === 'R',
      'border-tr-left-yellow' : item.red === 'A',
      'border-tr-left-blue-ligth' : item.red === 'B',
      'border-tr-left-orange' : item.red === 'N',
      'border-tr-left-fuchsia' : item.red === 'F',
    }
  }

  openOrder(data: any) {
    this.orderSelected = {...data};
  }

  copyOrderURL($event:Event, order:any) {
    $event.stopImmediatePropagation();
    const textArea = document.createElement('textarea');
    textArea.value = window.location.origin + '/order/view/' + order.orderId;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('Copy');
    textArea.remove();
    this.toast.info('Enlace de la orden '+ order.orderId + ' copiado.');
  }

  reassing($event:Event, order:any) {
    $event.stopImmediatePropagation();
    this._pC.order = order;
    this._pC.reasign();
  }

  shareWhatsApp($event:Event, order:any) {
    $event.stopImmediatePropagation();
    const message = 'Te comparto el siguiente enlace de orden de domicilio: ' + window.location.origin + '/order/view/' + order.orderId;
    window.open('https://api.whatsapp.com/send?text=' + message,'_blank');
  }

  activeFilter(filters?, emit = true) {
    this._dS.setfilters(filters, this.typeReport);
    if(filters) this.filtersActived = filters;
    if(this.typeReport !== 'search' && this.listOfAllDataAux.length > 0) this.listOfAllData = this.listOfAllDataAux.slice(0);
    if(this.filtersActived.length > 0){
      this.listOfAllDataAux = this.listOfAllData.slice(0);
      let filtersForGroup = _.values(_.groupBy(this.filtersActived, (filter) => { return filter.key }));
      const newData = this.listOfAllDataAux.filter(item => {
        let validationForFilter = [];
        for (const element of filtersForGroup) {
          let swFilter = false;
          for (let j = 0; j < element.length; j++) {
            const f = element[j];
            if (f.value != null && f.func(f.value, item) && !swFilter) swFilter = true;
            if(swFilter) break;
          }
          validationForFilter.push(swFilter);
        }
        return validationForFilter.filter(sw => sw === false).length == 0;
      });
      this.listOfAllData =  newData;
    }
    if(this.defaultFn != null) {
      this.listOfAllData = this.defaultFn(this.listOfAllData, this.filtersActived);
    }
    if ( emit && this.typeReport === 'search') this.onQueryParamsChange();
  }

  onQueryParamsChange(params?: NzTableQueryParams): void {
    if(params) this.params = params;
    const { pageSize, pageIndex, sort } = this.params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    const filter =this.mapFilterRequest();
    if(this.valuesTable.total !== null && this.typeReport === 'search') {
      this.refresh.emit(
        {
          type: 'page',
          data: { pageIndex, pageSize, sortField, sortOrder, filter }
        }
      );
    }

  }

  getColsWithFilters(){
    return this.cols.filter(c => c.filterMultiple)
  }

  getCols(){
    return this.cols.filter(c => !c.filterOnly)
  }

  getTransfMins(data){
    const ndata = Number(data);
    if(ndata == 1) { return `${ndata} Min`}
    if(ndata < 60) { return `${ndata} Mins`}
    else {
      const hrs = Math.round(ndata/60);
      const mins= ndata%60;
      return `${hrs} Hrs ${mins} Mins`;
    }
  }

  private mapFilterRequest(){
    if(this.filtersActived.length === 0) return [];
    let key = '';
    const out = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.filtersActived.length; i++) {
      const f = this.filtersActived[i];
      if(key !== f.key){
        out.push({key: f.key, keyLocal : f.keyLocal, value: []})
        key = f.key;
      }
      out[out.length - 1].value.push(f.value);
    }
    return out;
  }

  isReversing(orderId): boolean {
    return this.refundInfo?.find(item => item?.orderId === orderId)?.isReversing;
  }

  isRefunded(orderId): boolean {
    return this.refundInfo?.find(item => item?.orderId === orderId)?.isRefunded;
  }

  get refundText() {
    return countryConfig.isColombia 
      ? {title: 'Validar',  mdlText: 'La Validación'}
      : {title: 'Reversar', mdlText: 'El Reverso'}
  }

  validateOrderRefund(event, data){
    event.stopImmediatePropagation();
    // this._pC.validateRfund( data )
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
          Swal.showValidationMessage(`Por favor complete el campo de observaciones`)
        }else if(observations && observations.length > 500){
          Swal.showValidationMessage(`El texto de observaciones debe tene menos de 500 caracteres`)
        }
        else return observations;
      }
    }).then(({value}) => {
      if(value) {
        this.refundInfo?.push({
          orderId: data?.orderId,
          isReversing: true,
          isRefunded: false,
        });
        const orderId = data?.orderId;
        const employeeNumber = this._dS.getLocalUser().employeeNumber;
        const observation = value;
        this._oS.sendValidationFromRefoundOrder(observation, orderId, employeeNumber)
          .pipe(finalize(() => {
            this.refundInfo = this.refundInfo.map(item => {
              if(item?.orderId === orderId) {
                item.isReversing = false;
              }
              return item;
            });
          }))
          .subscribe({
            next: value => {
              this.refundInfo = this.refundInfo.map(item => {
                if(item?.orderId === orderId) {
                  item.isRefunded = true;
                }
                return item;
              });
            },
            error: err => {
              console.log('Error en servicio')
            },
          });
        this._oS.reverseTransaction(orderId).then();
      }
    });
  }

  showButtonDiscardRefundOrder(): boolean {
    return countryConfig.isVenezuela && this.orderType === 'REFUND';
  }

  openObservation(id: number, order:any){
    this.formObs.reset();
    this.statusId = id;
    this.orderId = order
    this.showObs = true;
  }

  saveForm(){
    if(this.formObs.valid){
      this.postManageNegativeRating()
    }
  }
  
  postManageNegativeRating(){
    const data = {
      "orderId": this.orderId,
      "observation": this.formObs.value.observation,
      "statusId": this.statusId
    }

    this._dS.postManageNegativeRating(data).subscribe((rta:any) => {
      if(rta.code=="OK"){
        this.toast.success('Estado actualizado', 'Enviado'); 
        this.showObs = false;
        this.formObs.reset();
      } else{
        this.toast.error('Error al actualizar el estado', 'Error');
      }
    })
  }
  
  discardRefundOrder(event, data): void {
    event?.stopImmediatePropagation();
    const toastRef = this.toast.info(
      `Descartando orden ${data?.orderId}`,
      'Descartar orden reembolso',
      {closeButton: true, disableTimeOut: true},
    ).toastRef;
    
    this._dS.discardRefundOrder(data?.orderId)
      .pipe(finalize(() => toastRef?.close()))
      .subscribe({
        next: res => {
          this.refresh.emit();
          this.toast.success(
            `Orden ${data?.orderId} descartada exitosamente`,
            'Descartar orden reembolso',
            {timeOut: 5000, extendedTimeOut: 5000},
          );
        },
        error: err => {
          this.toast.error(
            `Error al descartar orden ${data?.orderId}`,
            'Descartar orden reembolso',
            {closeButton: true, disableTimeOut: true},
          );
        },
      });

  }

  showButtonsReturn(): boolean {
    return this.orderType === 'RETURN' && countryConfig?.isColombia;
  }
  
  validateSuccessfulReturn(event: MouseEvent, orderId: any, status: number): void {
    event?.stopImmediatePropagation();
    if(this.isLoadingValidateSuccessfulReturn) return;

    this.isLoadingValidateSuccessfulReturn = true;
    const toastLoading = this.toast.info(
      null,
      'Cambiando estado devolución',
      {disableTimeOut: true, closeButton: false},
    ).toastRef;

    this._dS.validateSuccessfulReturn(orderId, status)
      .pipe(finalize(() => {this.isLoadingValidateSuccessfulReturn = false}))
      .subscribe(
        {
          next: (res) => {
            toastLoading.close();
            this.toast.success(
              null,
              'Estado de devolución actualizado exitosamente',
              {closeButton: false, timeOut: 3000},
            );
            this.refresh.emit();
          },
          error: (err) => {
            toastLoading.close();
            this.toast.error(
              err || err?.message,
              'Error al cambiar estado devolución',
              {disableTimeOut: true, closeButton: true},
            );
          }
        }
      );
  }
  get isVenezuela() { return countryConfig.isVenezuela; }
}

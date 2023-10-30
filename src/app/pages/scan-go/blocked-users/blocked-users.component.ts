import { Component, OnInit, Input } from '@angular/core';
import { ScanGoService } from '../../../services/scan-go.service';
import { CustomerService } from '../../../services/customer.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from '../../../services/dashboard.service';
import { ColumnData } from '../../../core/interfaces';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/user.service';
import { ReportsService } from '../../../services/reports.service';

@Component({
  selector: 'app-blocked-users',
  templateUrl: './blocked-users.component.html',
  styleUrls: ['./blocked-users.component.css']
})
export class BlockedUsersComponent implements OnInit {

  data:Array<any> = [];
  dataCopy:Array<any> = [];
  dataId:Array<any> = [];
  dataExport: any;
  dataSearch: any;
  searchText = '';
  searchOptions:Array<any> = [];
  searchParams = {option: 'id', text:''};
  cols:Array<ColumnData> = [];
  @Input() valuesTable:any = {loading : undefined, total: undefined, paginate: 50, pageIndex: 1};

  constructor(private _sS:ScanGoService,
              private toast:ToastrService,
              private _dS:DashboardService,
              private _uS:UserService,
              private _rS: ReportsService,
              private _cS:CustomerService) {
                this.searchOptions = [
                  {name:'Id', field:'id'},
                  {name:'Documento', field:'documentNumber'},
                  {name:'Correo', field:'email'},
                  {name:'Télefono', field:'phone'}
                ];
  }

  ngOnInit() {
    this.cols = this._sS.getColsBlocked();
    // this._sS.getUsersBlocked().subscribe((res:any)=>{
    //   this.dataId = res.items;
    //   this.valuesTable.total = this.dataId.length;
    //   this.searchData();
    // });
  }

  private searchData(valuesTable?:boolean){
    this.valuesTable.loading = true;
    let customers = [];
    if(valuesTable) {
      // tslint:disable-next-line: max-line-length
      customers = this._dS.getJsonOrderIds((this.valuesTable.pageIndex - 1) * this.valuesTable.paginate, this.dataId, this.valuesTable.paginate);
    }
    else customers = this._dS.getJsonOrderIds(0, this.dataId, this.valuesTable.paginate);
    const promises = customers.map(user => {return this._cS.getByParam('id', user.idUser).toPromise()});
    // tslint:disable-next-line: no-shadowed-variable
    Promise.all(promises).then((customers: any)=>{
      if(!this.dataCopy) this.toast.success(this.valuesTable.total + ' clientes bloqueados encontrados', null);
      this.dataCopy = customers.map((customer, index) => {
        customer.comment = this.dataId[((this.valuesTable.pageIndex - 1) * this.valuesTable.paginate)  +  index].reasonBlock;
        customer.name = customer.firstName + ' ' + customer.lastName;
        customer.blocked = true;
        return customer;
      });
      this.valuesTable.loading = false;
    });
  }

  private paginate($event){
    if($event.type == 'page'){
      this.valuesTable.pageIndex = $event.data.pageIndex;
      this.valuesTable.paginate = $event.data.pageSize;
      this.valuesTable.filter = $event.data.filter;
    }
    this.searchData(true)
  }

  unlock(index:number){
    setTimeout(()=>{ this.data.splice(index, 1);}, 1000);
  }

  validateSearch(){
    return this.searchParams.option && this.searchParams.text != '';
  }

  search(){
    this.valuesTable.loading = true;
    this.dataCopy = [];
    this._cS.getByParam(this.searchParams.option,this.searchParams.text).subscribe( async (res:any) => {
      if(res.data && res.data.length > 0) {
        const customer = res.data[0];
        customer.name = customer.firstname + ' ' + customer.lastname;
        let resVerify:any = await this._uS.verify(customer.id).toPromise();
        customer.blocked = resVerify.confirmation;
        this.dataCopy = [];
        this.dataCopy.push(customer);
      }
      this.valuesTable.loading = false;
      },
      error => {
        this.valuesTable.loading = false;
      });
  }

  toUnlock(customer:any){
    Swal.fire({
      title: 'Confirmación',
      text: '¿Realmente desea desbloquear el usuario: '+customer.name+'?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'SI',
      cancelButtonText: 'NO'
    }).then((result) => {
        if (result.value) {
        this._uS.basicLoadPromise( this._uS.unblockUser(customer.id).toPromise(),
        'Se desbloqueo este usuario!',
        'La orden fue reimpulsada correctamente',
        'No es posible reimpulsar la orden',
        (ct, data)=>{if(ct) this.searchData();}
        );
      }
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    if(this.valuesTable.total != null) this.paginate({type: 'page', data: {pageIndex, pageSize, sortField, sortOrder, filter}})
  }

  private initConfOptions(){
    this.dataExport = {
        object: {
          'Número de Pedido': {fun: (x)=>{return x.orderId}},
          'Usuario Monitor': {fun: (x)=>{return x.valueMap.userMonitor}},
          'Fecha de Creación': {fun: (x)=>{return x.valueMap.date}},
          Estado: {fun: (x)=>{return x.valueMap.status}},
          Tienda : {fun: (x)=>{return x.valueMap.storeName}},
          Ciudad : {fun: (x)=>{return x.valueMap.cityName}},
          Operador : {fun: (x)=>{return x.valueMap.acronymCourier}},
          Reasignado : {fun: (x)=>{return x.valueMap.reassigned}},
          'Fechas de reasignación': {fun: (x)=>{return x.valueMap.dateStatusFormat}},
          'Tiempo Recibida (hh:mm:ss)': {fun: (x)=>{return x.valueMap.receivedTimeFormat}},
          'Tiempo Emitida (hh:mm:ss)': {fun: (x)=>{return x.valueMap.emittedTimeFormat}},
          'Tiempo Enviada (hh:mm:ss)': {fun: (x)=>{return x.valueMap.sentTimeFormat}},
          'Tiempo Asignada (hh:mm:ss)': {fun: (x)=>{return x.valueMap.assignedTimeFormat}},
          'Tiempo Picking (hh:mm:ss)': {fun: (x)=>{return x.valueMap.pickingTimeFormat}},
          'Tiempo Picking Terminado (hh:mm:ss)':{fun: (x)=>{return x.valueMap.finishedPickingTimeFormat}},
          'Tiempo Facturada (hh:mm:ss)': {fun: (x)=>{return x.valueMap.billedTimeFormat}},
          'Tiempo En Camino (hh:mm:ss)':{fun: (x)=>{return x.valueMap.itsWayTimeFormat}},
          'Tiempo Punto de entrega (hh:mm:ss)':{fun: (x)=>{return x.valueMap.pointDeliveryTimeFormat}},
          'Tiempo Entregada (hh:mm:ss)': {fun: (x)=>{return x.valueMap.deliveredTimeFormat}},
          'Tiempo Finalizada (hh:mm:ss)': {fun: (x)=>{return x.valueMap.finishedTimeFormat}},
          'Tiempo Total (hh:mm:ss)': {fun: (x)=>{return x.valueMap.totalTimeFormat}},
          Observación: {fun: (x)=>{return x.valueMap.observationsFormat}},
          'Fecha Observación': {fun: (x)=>{return x.valueMap.hoursObservationsFormat}},
          'Fecha Click Whatsapp Cliente': {fun: (x)=>{return x.valueMap.dateManagerWhatsapp}},
          'Número de Guía': {fun: (x)=>{return x.valueMap.numberGuide}},
          'Fecha registro de Guía': {fun: (x)=>{return x.valueMap.dateCreateGuide}},
          'Número de Datafono' : {fun: (x)=>{return x.valueMap.dataphoneNumber}},
          PayU : {fun: (x)=>{return x.valueMap.transactionStatusPayU}},
          'Valor PayU' : {fun: (x)=>{return x.valueMap.transactionValuePayU}},
          'Evidencias de Pago' : {fun: (x)=>{return x.valueMap.evidencesForma}}
        },
        nameReport: 'Reporte_Usuarios_Bloqueados_SAG'
    }
    this.dataSearch = {
      url: this._rS.urls.dataUserBlocked,
      url_list: this._sS.urls.usersblocked,
      req_list: {},
  }
  }

}

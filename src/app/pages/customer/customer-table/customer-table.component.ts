import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Customer, ColumnData } from '../../../core/interfaces';
import Swal from 'sweetalert2';
import { CustomerService } from '../../../services/customer.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { countryConfig } from 'src/country-config/country-config';
import { ExcelService } from '../../../services/excel.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.scss']
})
export class CustomerTableComponent implements OnInit {

  @Input() customers:Array<Customer>;
  @Input() cols:Array<ColumnData>;
  @Input() options:boolean = false;
  @Input() valuesTable:any = {loading : undefined, total: undefined, paginate: 50, pageIndex: 1};
  @Output('refresh') eventRefresh = new EventEmitter();
  @Output() reload = new EventEmitter();
  
  customerSelected:Customer;
  private optionsDelete:any = {};

  constructor(private _cS:CustomerService,) { }

  ngOnInit(): void {
    if(!this.cols) this.cols = this._cS.getCols();
    this._cS.getOptionsDelete().subscribe((res:any)=>{
      res.data.forEach((element, index) => {
        this.optionsDelete[`${index}`] = element.description;
      });
    })
  }

  canRemove() {
    return this._cS.getLocalUser().canModifyClients == 1;
  }

  delete(customer:Customer, index:number, event:Event){
    event.stopPropagation();
    Swal.fire({
      title: 'Confirmación',
      text: '¿Realmente desea eliminar el cliente: '+customer.firstname+' '+customer.lastname+'? ¿Cuál es la razón?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancelar',
      input: 'select',
      inputOptions: this.optionsDelete,
      inputPlaceholder: 'Razones',
      preConfirm: (courier)=>{
        if (!courier || courier === "") {
          Swal.showValidationMessage(`Por favor seleccione una razón`)
        }else return courier;
      }
    }).then((result) => {
      if(result.value)
      this._cS.basicLoadPromise(
        Promise.all([
          firstValueFrom(this._cS.customerDelete(customer.id)),
          this._cS.saveDeleted(customer, this.optionsDelete[+result.value].description)
        ]),
        "Eliminando Cliente!",
        "Cliente eliminado exitosamente",
        "Ha ocurrido un error en servicio",
        (success:boolean) => {
          if(success){
            let customers = this.customers.slice(0);
            customers.splice(index, 1);
            this.customers = customers;
          };
        },
        true
      );
    });
  }

  refresh($event){
    if($event.type == 'edit'){
      let index = this.customers.findIndex(customer => customer.id == $event.customer.id);
      if(index != -1) this.customers.splice(index, 1, $event.customer);
      this.customerSelected = undefined;
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    if(this.valuesTable.total != null) this.eventRefresh.emit({type: 'page', data: {pageIndex, pageSize, sortField, sortOrder, filter}})
  }

  updateInfo(data) {
    this.reload.emit();
    this.customerSelected = undefined;
  }

}

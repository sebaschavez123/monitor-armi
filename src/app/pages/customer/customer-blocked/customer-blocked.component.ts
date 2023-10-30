import { Component, OnInit, OnDestroy } from '@angular/core';
import { Customer, ColumnData } from '../../../core/interfaces';
import { CustomerService } from '../../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from '../../../services/dashboard.service';
import { Subscription } from 'rxjs';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-customer-blocked',
  templateUrl: './customer-blocked.component.html',
  styleUrls: ['./customer-blocked.component.scss']
})
export class CustomerBlockedComponent implements OnInit, OnDestroy {

  valuesTable = {loading : false, total: null, paginate: 50, pageIndex: 1, filter: []}
  customers:Array<Customer>;
  customersData:Array<Number> = [];
  loading_search:boolean = false;
  toast:any;
  subscription: Subscription;
  dataExport:any;
  dataSearch:any;
  cols:Array<ColumnData>;

  constructor(private _cS:CustomerService,
              private _dS:DashboardService,
              private toastr:ToastrService,
              private excelService: ExcelService) { }

  ngOnInit(): void {
    this.initConfOptions()
    this.loading_search = true;
    this.subscription = this._cS.customersBlocked().subscribe((res:any)=>{
      this.loading_search = false;
      this.customers = res.data.map(dt => {
        return {
          ...dt.blockedUserDatastore, 
          ...dt.customerDomain,
          firstName: dt.customerDomain.firstname,
          lastName: dt.customerDomain.lastname,
        }
      });
      this.valuesTable.total = this.customersData.length;
      // this.search()
    }, error =>{
      this.loading_search = false;
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription?.unsubscribe();
    this.toast.toastRef.manualClose();
  }

  searchData($event){
    if($event.type == 'page'){
      this.valuesTable.pageIndex = $event.data.pageIndex;
      this.valuesTable.paginate = $event.data.pageSize;
      this.valuesTable.filter = $event.data.filter;
    }
    this.search(true)
  }

  search(valuesTable?:boolean){
    this.toast = this.toastr.info("Buscando clientes...", null, {
      tapToDismiss: false,
      disableTimeOut: true
    }); 
    this.valuesTable.loading = true;
    let customers = [];
    if(valuesTable) customers = this._dS.getJsonOrderIds((this.valuesTable.pageIndex - 1) * this.valuesTable.paginate, this.customersData, this.valuesTable.paginate);
    else customers = this._dS.getJsonOrderIds(0, this.customersData, this.valuesTable.paginate);
    this.toast.toastRef.manualClose();
    this.valuesTable.loading = false;
    if(!this.customers) this.toastr.success(this.valuesTable.total + " clientes bloqueados encontrados", null);
  }


  downloadExcel() {
    this.excelService.exportAsExcelFile(
      this.customers.map((x:any) => {
        return {
          'Id': x.id,
          'Fecha de eliminación': x.creationDate,
          'Login activo': x.registeredBy,
          'Nombre': x.firstname+' '+x.lastname,
          'Documento': x.documentNumber,
          'Correo': x.email,
          'Telefono': x.phone,
          'Bloqueado por': x.blockerUser,
          'Fecha de bloqueo': x.dateBlocked,
          'Razon': x.reasonBlock,
        }
      }),
      'Clientes_Bloqueados'
    )
  }

  private initConfOptions(){ 
    this.cols = this._cS.getCols();
    this.cols.splice(6,2,
      {
        name: 'reasonBlock',
        header: 'Razón',
        label: 'Razón',
        sortOrder: null,
        sortFn: (reasonBlock: string, item: any) => item.reasonBlock.indexOf(reasonBlock) !== -1
      },
      {
        name: 'blockerUser',
        header: 'Bloqueado por',
        label: 'Bloqueado por',
        sortOrder: null,
        sortFn: (blockerUser: string, item: any) => item.blockerUser.indexOf(blockerUser) !== -1
      }
    );
    this.cols.splice(9,1, 
      {
        name: 'dateBlocked',
        header: 'Fecha de bloqueo',
        label: 'Fecha de bloqueo',
        sortOrder: null,
        sortFn: (dateBlocked: string, item: any) => item.dateBlocked.indexOf(dateBlocked) !== -1
      }
    );
  }

}

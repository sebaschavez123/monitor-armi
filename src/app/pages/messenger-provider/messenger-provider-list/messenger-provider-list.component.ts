import { Component, OnInit } from '@angular/core';
import { ColumnData, MessengerProvider } from '../../../core/interfaces';
import { MessengerProviderService } from 'src/app/services/messenger-provider.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

//import Swal from 'sweetalert2';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'user-list',
  templateUrl: './messenger-provider-list.component.html',
  styleUrls: ['./messenger-provider-list.component.scss']
})
export class MessengerProvidesListComponent implements OnInit {

  providers:Array<MessengerProvider> = [];
  cols:Array<ColumnData> = [];
  providerSelected:MessengerProvider;
  searchText:string;
  couriers:any[];
  isLoading = false;

  private providersAux:Array<MessengerProvider> = [];

  constructor(
    private _mpS: MessengerProviderService,
    private toast:ToastrService
  ) {
    this.couriers = this._mpS.couriers;
  }

  ngOnInit(): void {
    this.cols = this._mpS.getCols();
    this.getMessengerProviders();
  }

  edit(provider: MessengerProvider) {
    this.isLoading = false;
    if(!!provider) {
      this.providerSelected = provider;
    } else {
      this.providerSelected = {
        providerName: '',
        providerEmail: '',
        courierId: -1
      }
    }
  }

  handleCancel() {
    this.providerSelected = undefined;
  }
  
  sendData() {
    console.log(this.providerSelected);
    this.isLoading = true;
    firstValueFrom(this._mpS.setMessengerProviders(this.providerSelected))
    .finally(()=> this.isLoading = true)
      .then((data)=>{
        this.getMessengerProviders();
        this.providerSelected = undefined;
        this.toast.success('Proveedor registrado correctamente');
      })
      .catch((err)=>{
        console.log(err);
        this.toast.error('Registro de Proveedor ha fallado, intente mas tarde.');
      });
  }

  getFormLabel() {
    return (this.providerSelected?.messengerProviderId > 0)
      ? `Editar proveedor` : `Registar Proveedor`;
  }

  delete(mproviders:MessengerProvider, index:number, event:Event){
    event.stopPropagation();
    /*
      Swal.fire({
        title: 'Confirmación',
        text: '¿Realmente desea eliminar el Proveedor: '+mproviders.providerName+' ? ',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'SI',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
          if (result.value) {
            this._mpS.basicLoadPromise(
              this._mpS.deleteUser(mproviders.messengerProviderId).toPromise(),
              'Eliminando Usuario!',
              'Usuario eliminado exitosamente',
              'Ha ocurrido un error en servicio',
              (success:boolean) => {
                if(success){
                  const providers = this.providers.slice(0);
                  providers.splice(index, 1);
                  this.providers = providers;
                };
              }
            );
        }
      });
      */
  }

  refresh($event){
    if($event.type === 'create') this.providers.unshift($event.provider);
    else if($event.type === 'edit'){
      const index = this.providers.findIndex(provider => provider.messengerProviderId === $event.provider.messengerProviderId);
      if(index !== -1) this.providers.splice(index, 1, $event.provider);
    }
    this.providerSelected = undefined;
  }

  searchData(){
    if(this.searchText !== ''){
      if(this.providersAux.length === 0) this.providersAux = this.providers.slice(0);
      this.providers = this.providersAux
      .filter(p=> p.providerName.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1 || String(p.messengerProviderId)
      .indexOf(this.searchText) !== -1 || p.providerEmail.indexOf(this.searchText) !== -1);
    }else{
      this.providers = this.providersAux;
      this.providersAux = [];
    }
  }

  private getMessengerProviders() {
    this._mpS.refreshProviders();
    this.providers = this._mpS.providers.map((p:any)=>{
      return {
        providerName: p.label,
        providerEmail: p.email,
        courierName: this._mpS.getCourierName(p.value)
      }
    });
    console.log(this.providers);
    this._mpS.getMessengerProviders().subscribe({ next: console.log });
    return;
  	this._mpS.getMessengerProviders().subscribe({
      next: (rta:any) => {
        this.providers = rta.data.map((p)=>{
          return {
            ...p,
            courierName: this._mpS.getCourierName(p.courierId)
          }
        });
        console.log(this.providers);
      },
      error: (error) => {this.providers = []}
    });
  }

}

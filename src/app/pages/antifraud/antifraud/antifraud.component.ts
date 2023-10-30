import { Component, OnInit, AfterViewInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { AntifraudService } from '../../../services/antifraud.service';
import { InputSearchComponent } from '../input-search/input-search-component';
import Swal from 'sweetalert2';
declare var $:any;

@Component({
  selector: 'app-antifraud',
  templateUrl: './antifraud.component.html',
  styleUrls: ['./antifraud.component.scss']
})
export class AntifraudComponent   {

  // 1://EMAIL
  // 2://PHONE
  // 3://ADDRESS
  // 4://DOCUMENT_NUMBER
  // 5://ID_ITEM
  _titles = ["Correos Electrónico", "Telefonos", "Direcciones", "Nº Identificación", "N/A", "Bin"];
  modal: boolean = false;
  tpSelect: number = 5;
  regblocked: any = undefined;
  timingKeys: any;

  onRefresh: EventEmitter<void> = new EventEmitter();
  @ViewChild(InputSearchComponent) inpSearch: InputSearchComponent;
  
  constructor(
    private _service: AntifraudService
  ) {}

  closeModal() {
    this.modal = false;
    this.inpSearch.strkey = '';
  }


  selectChange(strkey:string) {
    if(strkey.length > 0 ) {
      clearTimeout(this.timingKeys);
      this.timingKeys = setTimeout( () => this.search(strkey), 2000);
    }
  }

  search(data) {
    this._service.find(this.tpSelect, data).then(
      (_results:any) => {
        if(_results.data) {
          let _d = _results.data;
          this.regblocked = {};
          this.regblocked.id = (_d.id) ? _d.id : 0;
          if(_d.lockType) {
            this.regblocked.tp = _d.lockType.id;
            this.regblocked.data = _d.data;
          } else {
            this.regblocked.tp = 5;
            this.regblocked.data = {
              id: _d.id,
              idblock: _d.id,
              image: _d.item.mediaImageUrl,
              name: _d.item.firstDescription,
              desc: _d.item.secondDescription
            };
          }
          if(_d.listCustomer) this.regblocked.listCustomer = _d.listCustomer;
          if(_d.user) this.regblocked.user = _d.user;
          this.modal = true; 
        }
        else {
          Swal.fire(`Buscando: ${data}`, 'No se encontraron resultados', 'error');
        }
      },
      (e:any) => {
        Swal.fire('Uoop!', e.error.message, 'error');
      }
    );
  }

  rmButton(desc:string, id:any) {
    const users = this.regblocked.listCustomer
      .map(u => `${u.firstname} ${u.lastname}`).join(', ');
    const msg = this.regblocked.listCustomer.length > 1
      ? `<br/>¡esto afectará a los usuarios:<br/><div class="users">(${users})!</div>` : '';
    Swal.fire({
      title: '¿Desea continuar?',
      html: `<div class="antifraud-alert"><span class="data">${desc}</span> será removido.${msg}</div>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: '¡Si, remuevelo!'
    }).then((result) => {
      if (result.value) {
        this._service.removeData(`${id}/employeeNumber/${this._service.getLocalUser().employeeNumber}`, false).then(
          _results => {
            this.inpSearch.strkey = '';
            this.modal = false
            this.onRefresh.emit();
            Swal.fire(desc, 'Ha sido removido!', 'success' );
          },
          err => {
            console.info(err);
            Swal.fire(desc, 'No se pudo remover, intente mas tarde.', 'error' );
          }
        )
      }
    })
  }

}

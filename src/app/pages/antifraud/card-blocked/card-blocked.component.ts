import { Component, Input, Output, AfterViewInit, OnDestroy, EventEmitter, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';


import Swal from 'sweetalert2';
import { PaginationLite } from '../../../core/pagination-lite';
import { AntifraudService } from '../../../services/antifraud.service';
import { ToastrService } from 'ngx-toastr';

declare var $:any;

@Component({
  selector: 'af-card-blocked',
  templateUrl: './card-blocked.component.html',
  styleUrls: ['./card-blocked.component.scss']
})
export class CardBlockedComponent implements AfterViewInit, OnDestroy {

  swForma:boolean = false;
  loading:boolean = true;
  msgs = ['Correo', 'Telefono', 'Dirección', 'Identidicación', "N/A", 'Bin'];
  mpref = ['El', 'El', 'La', 'La', "N/A", 'El Número'];
  input_type = ['email', 'number', 'text', 'number', "text", 'number'];
  _titles = ["Correos Electrónico", "Telefonos", "Direcciones", "Nº Identificación", "N/A", 'Número Bin'];
  datalist: any = undefined;
  newData: string;
  modal:boolean = false;
  plite: PaginationLite = undefined;
  static _inx: number = 0;
  
  private inx: number;

  @Input('cdtype') tp: number = 1;
  @Input() chargebacks: boolean = false;
  @Input('onRefresh') onRefresh: EventEmitter<void>;
  @Output() onSave: EventEmitter<void> = new EventEmitter();
  
  get mdlInx() { return `mdlCardBlocked-${this.inx}`; }
  get tpText() { return `${this.mpref[this.tp-1]} ${this.msgs[this.tp-1].toLowerCase()}`; }
  get addText() { return `Digite ${this.msgs[this.tp-1].toLowerCase()}` }
  get inputType() { return this.input_type[this.tp-1]; }
  get cdtitle() { return this._titles[this.tp-1]};

  constructor(private _service: AntifraudService,
              private toastr:ToastrService) {
    this.inx = ++CardBlockedComponent._inx;
  }

  ngAfterViewInit() {
    this.onRefresh.subscribe(() => this.updateData());
    this.updateData();
  }
  
  fireModal() {
    this.openModal();
  }

  openModal() {
    this.modal = true;
  }

  closeModal() { 
    this.modal = false;
    this.swForma = false;
    this.newData = null;
  }
  
  ngOnDestroy(){
    // this.modal.remove();
  }

  updateData(page: number = 1, size: number = 15) {
    this.loading = false;
    this._service.listData(this.tp, page, size, this.chargebacks).then(
      (_results:any) => {
        this.datalist = _results.data
        this.plite = PaginationLite.parse(_results.data);
      },
      (err) => {
        this.loading = false;
        this.datalist = { data: []};
        console.error(err);
      }
    );
  }

  rmButton(card:any) {
    let desc = `${this.tpText} ${card.data}`;
    Swal.fire({
      title: '¿Continuar?',
      text: `${desc} será removido!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: '¡Si, remuevelo!'
    }).then((result) => {
      if (result.value) {
        this._service.removeData(`${card.id}/employeeNumber/${this._service.getLocalUser().employeeNumber}`, this.chargebacks).then(
          _results => {
            this.updateData();
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

  dataSend(forma: NgForm) {
    this.swForma = true;
    if(forma.valid) {
      let newData = forma.value.newData;
      if(!this.chargebacks){
        this._service.blockData(this.tp, newData).then(
          _results => {
            this.toastr.success(`¡${newData} ha sido agregado a la lista de bloqueos!`);
            this.modal = false;
            this.updateData();
            this.onSave.emit();
          },
          (e:any) => {
            Swal.fire('Uoop!', e.error.message, 'error');
          }
        );
      }else{
        this._service.addChargeback(this.tp, newData).then(
          _results => {
            this.toastr.success(`¡${newData} ha sido agregado a la lista de contracargos!`);
            this.modal = false;
            this.updateData();
            this.onSave.emit();
          },
          (e:any) => {
            Swal.fire('Uoop!', e.error.message, 'error');
          }
        );
      }
    }
  }

  goPage(p) {
    this.updateData(p, this.plite.size);
  }

}
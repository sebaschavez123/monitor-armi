import { Component, AfterViewInit, EventEmitter, Input, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';

import * as _ from 'underscore';
import { PaginationLite } from '../../../core/pagination-lite';
import { AntifraudService } from '../../../services/antifraud.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;


@Component({
  selector: 'af-product-blocked',
  templateUrl: './product-blocked.component.html',
  styleUrls: ['./product-blocked.component.scss']
})
export class ProductBlockedComponent implements AfterViewInit, OnDestroy {
  
  static _inx: number = 0;
  
  private inx: number;
  products:any = undefined;
  product:any = undefined;
  datalist: any = undefined;
  modal: any = undefined;
  plite: PaginationLite = undefined;
  loading:boolean = true;
  btnLock:boolean = true;
  
  get mdlInx() { return `mdlProductBlocked-${this.inx}`; }

  @Input('onRefresh') onRefresh: EventEmitter<void>;
  
  constructor(
    private _service: AntifraudService,
    private toastr:ToastrService
  ) {
    this.inx = ++ProductBlockedComponent._inx;

  }

  ngAfterViewInit() {
    this.modal = $(`#${this.mdlInx}`);
    this.modal.appendTo('body');
    this.modal.on('shown.bs.modal', () => this.openModal() );
    this.modal.on('hide.bs.modal', () => this.closeModal() );
    this.onRefresh.subscribe(() => this.updateData());
    this.updateData();
  }
  
  fireModal() { this.modal.modal('show'); }

  openModal() {
    setTimeout(() => {
      $(`#frmNewData`).focus();
    }, 1200); 
  }

  closeModal() {
    this.product = undefined;
  }
  
  ngOnDestroy(){
    this.modal.remove();
  }

  getImage(_img:string) {

    return _img ? _img
      : {"background-image": "url('https://lh3.googleusercontent.com/ci_EnRMprf2gdKgMhueRwARAalD1ecK6o8jO-dR_48kKUj5yw7X3wJ1LqdzgYpvaC0FjIHrH8JFRMYQ2ry6Z7jz5dnOsmFjuqs0')" };
  }

  rmButton(product:any) {
    let desc = `El producto ${product.firstDescription}`;
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
        this._service.removeData(`${product.idblock}/employeeNumber/${this._service.getLocalUser().employeeNumber}`, false).then(
          _results => {
            this.updateData();
            Swal.fire(desc, 'Ha sido removido!', 'success' );
          },
          err => {
            console.error(err);
            Swal.fire(desc, 'No se pudo remover, intente mas tarde.', 'error' );
          }
        )
      }
    })
  }
  
  updateData(page: number = 1) {
    this.loading = false;
    this._service.productsList(page).then(
      (_results:any) => {
        this.products = _.map(_results.data.data, (dat:any) => {
          return _.extend({idblock: dat.id }, dat.item);
        });
        this.plite = PaginationLite.parse(_results.data);
      },
      (err) => {
        this.loading = false;
        this.products = { data: []};
        console.error(err);
      }
    );
  }

  search(data) {
    this.product = undefined;
    this._service.showProduct(data).then(
      (dta:any) => {
        if(dta.seo) {
          let _d = dta.seo;
          this.product = {
            id: _d.sku,
            image: _d.image,
            name: _d.name,
            desc: _d.description
          };
          this.btnLock = false;
        }
      },
      (err) => {
        this.btnLock = true;
      }
    )
  }

  addProduct(id) {
    this._service.blockData(5, id).then(
      _results => {
        this.toastr.success(`¡El producto ha sido agregado a la lista de bloqueos!`);
        this.modal.modal('hide');
        this.updateData();
      },
      (e:any) => {
        Swal.fire('Uoop!', e.error.message, 'error');
      }
    );
  }

  goPage(p) { this.updateData(p); }

}

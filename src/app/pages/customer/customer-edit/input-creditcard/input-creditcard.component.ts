import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Customer } from 'src/app/core/interfaces';
import { CustomerService } from 'src/app/services/customer.service';
import { ToastrService } from 'ngx-toastr';

import Swal from 'sweetalert2';
@Component({
    selector: 'input-creditcard',
    templateUrl: './input-creditcard.component.html',
    styleUrls: ['./input-creditcard.component.scss']
})

export class InputCreditcard implements OnInit, OnChanges {
    
    cards = [];
    isLoading = false;
    @Input() customer: Customer;

    constructor(
        private _cS: CustomerService,
        private modal: NzModalService,
        private toastr:ToastrService
    ) { }

    ngOnInit() { }

    getCards() {
        if(!!this.customer) {
            this._cS.getCreditCards(this.customer.id)
                .subscribe({
                next: (rta: any) => {
                    this.cards = rta.map(cd => this.transfomData(cd));
                }
            });
        }
    }

    transfomData(card) {
        return {
            ...card,
            blocked: card.blocked == 'SI'
        }
    }

    getCardLogo(card) {
        const icon = card.franchiseCreditCard.toLowerCase();
        return `/assets/images/creditcards/${icon}.gif`;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.customer){
          if(!this.customer) this.cards = [];
          else this.getCards();
        }
    }

    alertCreditCard(card) {
        const action = card.blocked ? 'Desbloquear' : 'Bloquear';
        this.modal.confirm({
            nzTitle: `<em>¿Desea ${action.toLocaleLowerCase()} tarjeta de crédito?</em>`,
            nzContent: `<b>Número: ${card.creditCardNumber}</b>`,
            nzCancelText: 'Cancelar',
            nzOkText: action,
            nzOnOk: () => { this.toogleCreditCard(card) }
        });
    }

    toogleCreditCard(card){
        this.isLoading = true;
        if(card.blocked) {
            this._cS.unblockData(card.lockedDataId).then(
                _results => {
                    this.isLoading = false;
                    this.getCards();
                    this.toastr.success(`¡${card.creditCardId} ha sido agregado a la lista de bloqueos!`);
                },
                (e:any) => {
                    this.isLoading = false;
                  Swal.fire('Uoop!', e.error.message, 'error');
                }
            );
        } 
        else {
            this._cS.blockData(7, card.creditCardId).then(
                _results => {
                    this.isLoading = false;
                    this.getCards();
                    this.toastr.success(`¡${card.creditCardId} ha sido removido de la lista de bloqueos!`);
                },
                (e:any) => {
                    this.isLoading = false;
                    Swal.fire('Uoop!', e.error.message, 'error');
                }
            );
        }
    }

}
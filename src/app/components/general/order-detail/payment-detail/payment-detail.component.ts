import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.scss']
})
export class PaymentDetailComponent implements OnInit, OnChanges, OnDestroy {

  @Input() orderId:string;
  @Input() paymnetType:string;
  @Output() close = new EventEmitter();
  @Output() refresh = new EventEmitter();

  loading = false;
  payment:any;
  err:string;
  step = 1;
  form:UntypedFormGroup;
  formPaymentInfo:UntypedFormGroup;
  paymentFinished = false;
  editInfo = false;
  subscribe:Subscription;

  banks:Array<any> = [];
  typesId = [
    {"id": "V", "name": 'CI-V'},
    {"id": "E", "name": 'CI-E'},
    {"id": "G", "name": 'RIF-G'},
  ]

  constructor(private _oS:OrderService, private _dS:DashboardService) {
    this.form = new UntypedFormGroup({
      reference: new UntypedFormControl('000000', [Validators.required]),
      amount: new UntypedFormControl(null, [Validators.required]),
    });
    this.formPaymentInfo = new UntypedFormGroup({
      bankId: new UntypedFormControl(null, [Validators.required]),
      customerDocumentNumber: new UntypedFormControl(null, [Validators.required]),
      customerDocumentType: new UntypedFormControl(null, [Validators.required]),
      customerPhone: new UntypedFormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this._dS.getBanks().subscribe((res:any)=> {
      this.banks = res.data;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(this.orderId) {
      this.getPagoMovil();
    } else {
      this.loading = false;
      this.editInfo = false;
      this.paymentFinished = false;
      this.payment = undefined;
      this.err = undefined;
      this.step = 1;
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscribe?.unsubscribe();
  }

  private getPagoMovil() {
    this.loading = true;
    this.subscribe = this._oS.getPagoMovilDetail(this.orderId).subscribe({
      next: (res:any) => {
        this.payment = res.data;
        this.loading = false;
      }, 
      error: (err) => {
        this.loading = false;
        this.err = undefined;
      }
    });
  }

  get textLeft() {
    if(this.editInfo) return 'Atras';
    if(this.step == 1) return 'Cerrar';
    return 'Atras';
  }

  get textRigth() {
    if(this.editInfo) return 'Editar';
    if(this.step == 1) return 'Ingresar pago';
    return 'Pagar';
  }

  actionLeft() {
    if(this.editInfo) this.editInfo = false;
    else if(this.step == 1) this.close.emit();
    else this.step = 1;
  }

  actionRigth() {
    if(this.editInfo) this.editInfoCustomer()
    else if(this.step == 1) {
      this.step = 2;
      //this.err
    }
    else this.toPay();
  }

  toPay(){
    if(this.form.valid) {
      this.err = undefined;
      const value = this.form.value;
      value['idOrder'] = this.orderId;
      value['idPagoMovil'] = this.payment.idPagoMovil;
      value['pagoMovilType'] = this.payment.pagoMovilType;
      value.amount = value.amount.toFixed(2);
      this.loading = true;
      this.subscribe = this._oS.toPayPagoMovil(value).subscribe({
        next: (res: any) => {
          this.loading = false;
          this.payment = res.data;
          this.paymentFinished = this.payment.outstandingBalance <= .1;
          if(!this.paymentFinished) {
            this.resetForm();
          }
        },
        error: (err) => {
          this.loading = false;
          this.err = err.error.message;
          this.resetForm();
        }
      });      
    }
  }

  resetForm() {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
  }

  actionEdit() {
    this.editInfo = true;
    this.formPaymentInfo.patchValue({
      bankId: this.payment.bankId,
      customerDocumentNumber: this.payment.customerDocumentNumber,
      customerDocumentType: this.payment.customerDocumentType,
      customerPhone: this.payment.customerPhone,
    });
  }

  editInfoCustomer() {
    if(this.formPaymentInfo.valid) {
      const value = this.formPaymentInfo.value;
      value['id'] = this.payment.idPagoMovil;
      value['customerId'] = this.payment.customerId;
      value['idOrder'] = this.orderId;
      value['customerPhone'] = value.customerPhone.startsWith(0)
        ? value.customerPhone : `0${value.customerPhone}`;
      this.loading = true;
      this.err = undefined;
      this._oS.updatePagoMovil(value).subscribe({
        next: (res:any)=> {
          this.loading = false;
          this.editInfo = false;
          this.getPagoMovil();
        },
        error: (err:any) => {
          this.loading = false;
          this.err = err.message;
        }
      });
    }
  }

}

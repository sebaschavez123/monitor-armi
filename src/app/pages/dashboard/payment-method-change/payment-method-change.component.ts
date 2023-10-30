import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'dashboard-payment-method-change',
  templateUrl: './payment-method-change.component.html',
  styleUrls: ['./payment-method-change.component.scss']
})
export class PaymentMethodChangeComponent implements OnInit {

  form:UntypedFormGroup;
  formSend:boolean = false;
  loadingForm:boolean = false;

  constructor(private activatedRoute: ActivatedRoute) {
    this.form = new UntypedFormGroup({
      'order': new UntypedFormControl(null, [Validators.required]),
      'paymentMethod': new UntypedFormControl("dataphone", [Validators.required]),
      'creditNote': new UntypedFormControl(null, [Validators.required]),
      'messengerName': new UntypedFormControl(null, [Validators.required]),
    })
  }

  ngOnInit(): void {
      let id = this.activatedRoute.snapshot.params.id;
      if(id) this.form.get('order').setValue(id);
  }

  get f(){
    return this.form.controls;
  }


  send(){
    if(this.form.valid){

    }
    this.formSend = false;
  }

}

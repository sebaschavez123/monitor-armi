import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Coupon } from '../../../core/interfaces';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { CouponsService } from '../../../services/coupons.service';

@Component({
  selector: 'coupons-edit',
  templateUrl: './coupons-edit.component.html',
  styleUrls: ['./coupons-edit.component.scss']
})
export class CouponsEditComponent implements OnInit, OnChanges {

  @Input() coupon:Coupon;
  @Input() couponType:string;
  @Input() pageMode:boolean = false;
  @Output() close = new EventEmitter();
  @Output() refresh = new EventEmitter();

  forma:UntypedFormGroup;
  loadingForm:boolean = false;

  constructor(private _cS:CouponsService) {
    this.forma = new UntypedFormGroup({
      componentId: new UntypedFormControl(null),
      minAmount: new UntypedFormControl(null),
      discountAmount: new UntypedFormControl(null),
      name: new UntypedFormControl(null, Validators.required),
      description: new UntypedFormControl(null, Validators.required),
      start_date: new UntypedFormControl(null, Validators.required),
      end_date: new UntypedFormControl(null, Validators.required),
    });
    this.f.componentId.disable();
    this.f.minAmount.disable();
    this.f.discountAmount.disable();
    this.f.name.disable();
    this.f.start_date.disable();
    this.f.end_date.disable();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes:SimpleChanges){
    if(this.couponType == "FIJO"){
      this.f.componentId.setValue([Validators.required]);
      this.f.minAmount.setValue([Validators.required]);
      this.f.discountAmount.setValue([Validators.required]);
    }else{
      this.f.componentId.clearValidators();
      this.f.minAmount.clearValidators();
      this.f.discountAmount.clearValidators();
    }

    if(changes.coupon){
      if(!this.coupon){
        this.forma.reset()
        return;
      }else{
        this.f.componentId.setValue(this.coupon.componentId);
        this.f.minAmount.setValue(this.coupon.minAmount);
        this.f.discountAmount.setValue(this.coupon.discountAmount);
        this.f.name.setValue(this.coupon.coupon);
        this.f.start_date.setValue(this.coupon.beginDate);
        this.f.end_date.setValue(this.coupon.endDate);
        this.f.description.setValue('');
      }
    }
    
  }

  get f() { return this.forma.controls; }

  save(){
    this.loadingForm = true;
    let promises = [];
    if(this.couponType == "FIJO") 
    promises = [ 
      this._cS.setOfferId(this.coupon).toPromise(),
      this._cS.cuponGenerate(this.coupon, this.couponType == "FIJO"?0:1, this.f.description.value).toPromise()
    ]
    else promises = [this._cS.cuponGenerate(this.coupon, this.couponType == "FIJO"?0:1, this.f.description.value).toPromise()]
    this._cS.basicLoadPromise(
    Promise.all(promises),
    "Generando cupon",
    "Cupon Generado!",
    "Error en servicio",
    ()=>{
      this.loadingForm = false;
      this.forma.reset();
      this.close.emit();
    }
    );
  }

}

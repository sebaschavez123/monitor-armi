import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, Injectable } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Address } from '../../../core/interfaces';
import { DashboardService } from '../../../services/dashboard.service';
import { CustomerService } from '../../../services/customer.service';
import { countryConfig } from 'src/country-config/country-config';
import { fromFetch } from 'rxjs/fetch';
import { firstValueFrom, from, switchMap } from 'rxjs';

@Component({
  selector: 'customer-address-edit',
  templateUrl: './address-edit.component.html',
  styleUrls: ['./address-edit.component.scss']
})

@Injectable()
export class AddressEditComponent implements OnInit, OnChanges {

  @Input() address:Address;
  @Input() coordinates;
  @Input() store:any;
  @Input() pageMode = false;
  @Input() mapGl = false;
  @Input() orderId;
  @Output() close = new EventEmitter();
  @Output() refresh = new EventEmitter();


  form:UntypedFormGroup;
  loadingForm = false;
  coordinatesMap = undefined;
  citySelected = undefined;
  editAddress = undefined;

  get isVenezuela() { return countryConfig.isVenezuela; }


  constructor(public _dS:DashboardService, private _cS:CustomerService) {
    if(this.isVenezuela){
      this.form = new UntypedFormGroup({
        nickname: new UntypedFormControl(undefined, Validators.required),
        city: new UntypedFormControl(undefined, Validators.required),
        address: new UntypedFormControl(undefined, Validators.required),
        comments: new UntypedFormControl(undefined, Validators.required),
        detail: new UntypedFormControl(undefined, Validators.required),
        latitude: new UntypedFormControl(undefined, Validators.required),
        longitude: new UntypedFormControl(undefined, Validators.required),
        closerStoreId: new UntypedFormControl(undefined, Validators.required),
        deliveryType: new UntypedFormControl(undefined, Validators.required),
        municipality: new UntypedFormControl(undefined, Validators.required),
        active: new UntypedFormControl(undefined, Validators.required),
        idCustomer: new UntypedFormControl(undefined, Validators.required),
        idAddress: new UntypedFormControl(undefined, Validators.required),
      })
    }else{
      this.form = new UntypedFormGroup({
        active: new UntypedFormControl(undefined, Validators.required),
        address: new UntypedFormControl(undefined, Validators.required),
        city: new UntypedFormControl(undefined, Validators.required),
        closerStoreId: new UntypedFormControl(undefined, Validators.required),
        nickname: new UntypedFormControl(undefined, Validators.required),
        comments: new UntypedFormControl(undefined, Validators.required),
        latitude: new UntypedFormControl(undefined, Validators.required),
        longitude: new UntypedFormControl(undefined, Validators.required),
        deliveryType: new UntypedFormControl(undefined, Validators.required),
        idCustomer: new UntypedFormControl(undefined, Validators.required),
        idAddress: new UntypedFormControl(undefined, Validators.required),
        assignedStore: new UntypedFormControl(undefined, Validators.required),
        
      })
    }
    this.form.get('city').valueChanges.subscribe((res:any)=> {
      console.log('cambiando city', {res},
      this._dS.cities,
      this.address.municipality
      );
       this.citySelected = this._dS.cities.slice(0).find(city => {
        return city.value == res || city.city == res
      });
    })
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    
    if(!changes.address) return;
    if(!this.address) {
      this.loadingForm = false;
      this.coordinatesMap = undefined;
    } else {
      if(this.isVenezuela){
        this.form.patchValue({
           nickname: this.address.nickname,
           address: this.address.address,
           detail: this.address.comments.split(' / ')[0],
           comments: this.address.comments.split(' / ')[1],
           latitude: this.address.latitude,
           longitude: this.address.longitude,
           closerStoreId: this.address.closerStoreId,
           deliveryType: this.address.deliveryType,
           municipality: this.address.municipality?.toLocaleLowerCase(),
           active: this.address.active,
           idCustomer: this.address.idCustomer,
           idAddress: this.address.idAddress,
           city: this.address.city,
        });
      } else {
        this.form.patchValue({
          nickname: this.address.nickname,
          address: this.address.address,
          comments: this.address.comments,
          latitude: this.address.latitude,
          longitude: this.address.longitude,
          closerStoreId: this.address.closerStoreId,
          deliveryType: this.address.deliveryType,
          active: this.address.active,
          idCustomer: this.address?.customerId,
          idAddress: this.address?.customerAddressId,
          city: this.address?.cityId,
          assignedStore: this.address?.closerStoreId,

       });
      }
      if(!this.coordinatesMap) {
        this.coordinatesMap = {longitude: this.address.longitude, latitude: this.address.latitude};
      }
    }    
  }

  updateCoordinates(coords) {
    //this.coordinatesMap = coordinatesMap;
    if(!countryConfig.isColombia) {
      this.getAddressByCoordinates({lat: coords.latitude, lng: coords.longitude});
    }
    this.form.patchValue({latitude:  coords.latitude,longitude: coords.longitude,});
    this.editAddress = {...this.editAddress, latitude: coords.latitude, longitude: coords.longitude};
  }

  getAddressByCoordinates({lat, lng}) : any {
    let urlInver = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=0&zoom=40';
    urlInver += `&lat=${lat}&lon=${lng}`;
    firstValueFrom(
      fromFetch(urlInver).pipe(switchMap((r: any) => from(r.json())))
    ).then(
      (json:any) => this.form.patchValue({ address: json.display_name })
    );
  }

  action(){
    if(this.form.valid) {
      this.loadingForm = true;
      const form = this.form.value;
      if(this.isVenezuela){
        form['comments'] = `${this.form.get('detail').value} / ${this.form.get('comments').value}`; 
      }
      if(this.orderId) form['orderId'] = this.orderId;
      this._cS.updateAddress(form).subscribe({
        next: (v) => {
          this.refresh.emit({...this.address, form});
          this.close.emit();
        },
        error: (e) => this.loadingForm = false
    })
    }


  }

}

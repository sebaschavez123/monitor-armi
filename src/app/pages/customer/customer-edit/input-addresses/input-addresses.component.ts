import { Component, OnInit, forwardRef, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { countryConfig as _countryConfig } from 'src/country-config/country-config';
import { Address } from '../../../../core/interfaces';

@Component({
  selector: 'input-addresses',
  templateUrl: './input-addresses.component.html',
  styleUrls: ['./input-addresses.component.scss'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputAddressesComponent),
      multi: true
    }
  ]
})
export class InputAddressesComponent implements OnInit {

  @Output() edit = new EventEmitter<Address>();

  propagateChange = (_: any) => {};
  addresses:Array<any> = [];
  countryConfig = _countryConfig;
  constructor() { }

  ngOnInit() {
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  writeValue(value:Array<any>){
    if(value){
      this.addresses = value;
    }else{
      this.addresses = [];
    }
  }

  changeStatus(i:number){
    this.addresses[i].active = !this.addresses[i].active;
  }

  eventEdit($event:Event, address:Address) {
    $event.stopPropagation();
    this.edit.emit(address);
  }

}

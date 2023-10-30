import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'general-switch-buttom',
  templateUrl: './switch-buttom.component.html',
  styleUrls: ['./switch-buttom.component.scss'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchButtomComponent),
      multi: true
    }
  ]
})
export class SwitchButtomComponent implements ControlValueAccessor {

  @Input() options:Array<any> = [];
  @Input() output:string;
  @Input() text:string;

  active:number = 0;

  constructor() { }

  select(index:number){
    this.active = index;
    let output = this.options[this.active][this.output];
    this.propagateChange(output);
  }

  writeValue(value: any) {
    if(value) this.active = this.options.findIndex(pt => pt[this.output] == value);
  }

  propagateChange = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

}

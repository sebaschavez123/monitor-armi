import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../../../services/utils.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'store-hours-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnChanges {

  @Input() hours = {
    open: 0,
    close: 0,
    day:null,
    store:null
  }
  @Input() pageMode:boolean = false;
  @Output() close = new EventEmitter();
  @Output() refresh = new EventEmitter();

  forma:UntypedFormGroup;
  loadingForm:boolean = false;

  constructor(private _uS:UtilsService, private _US: UserService) {
    this.forma = new UntypedFormGroup({
      open: new UntypedFormControl(null, Validators.required),
      close: new UntypedFormControl(null, Validators.required),
      store: new UntypedFormControl(null, Validators.required),
      day: new UntypedFormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(this.hours) {
      this.forma.patchValue({
        'open': this.hours.open,
        'close': this.hours.close,
        'store': this.hours.store,
        'day': this.hours.day,
      });
    } else {
      this.forma.patchValue({
        'open': null,
        'close': null,
        'store': null,
        'day': null,
      });
    }
  }

  save() {
    this.loadingForm = true;
    this._uS.updateStoreConfig(this.forma.value).subscribe((res:any) => {
      this.close.emit();
      this.loadingForm = false;
    })
  }
  
}


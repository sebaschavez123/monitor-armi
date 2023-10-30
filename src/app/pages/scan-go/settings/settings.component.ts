import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { ScanGoService } from '../../../services/scan-go.service';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  @Input() event:EventEmitter<any>;
  open:boolean = false;
  save_changes_opt = {err_save_changes: false, loading: false};

  constructor(public _sS:ScanGoService,
              private _uS:UtilsService) {
    this._sS.settings.purchase_score = _sS.settings.purchase_score;
  }

  ngOnInit() {
    this.event.subscribe((res)=>{
      this.open = res;
    });
  }

  save(){
    this.save_changes_opt.err_save_changes = false; 
    let promises = [];
    if(this._sS.settings.time.value) promises.push(this._uS.updateProperty(this._sS.settings.time.key,this._sS.settings.time.value).toPromise());
    this._sS.settings.purchase_score.forEach((el, index) => {
      if(el.value != this._sS.settings.purchase_score[index].value) promises.push(this._uS.updateProperty(el.key, el.value).toPromise());
    });
    this._sS.settings.params.forEach((el, index) => {
      if(el.value != this._sS.settings.params[index].value) promises.push(this._uS.updateProperty(el.key, el.value).toPromise());
    });
    Promise.all(promises).then((res:any)=>{
      this.event.emit(false);
      this.save_changes_opt.err_save_changes = false;
    }).catch(err =>{
      this.save_changes_opt.err_save_changes = true;
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-utils-send-tracking',
  templateUrl: './utils-send-tracking.component.html',
  styleUrls: ['./utils-send-tracking.component.scss']
})
export class UtilsSendTrackingComponent implements OnInit {

  smsActive = 0;
  optionSms = [
    {
      title: 'EXPRESS - TRANSFERENCIAS',
      description: 'Cargando...'
    },
    {
      title: 'EXPRESS - KM ALTO',
      description: 'Cargando...'
    },
    {
      title: 'NATIONAL - TRACKING',
      description: 'Cargando...'
    },
    // {
    //   title: 'ENVIALO YA - TRACKING',
    //   description: 'Cargando...'
    // },
    {
      title: 'PROVEEDOR - TRACKING',
      description: 'Cargando...'
    },
  ];
  textUpdate = '';

  constructor(private _uS:UtilsService,
              private toast:ToastrService) { }

  ngOnInit() {
    const promises = [
      this._uS.getProperty(this._uS.keysSmsProperty[0]).toPromise(),
      this._uS.getProperty(this._uS.keysSmsProperty[1]).toPromise(),
      this._uS.getProperty(this._uS.keysSmsProperty[2]).toPromise(),
      this._uS.getProperty(this._uS.keysSmsProperty[3]).toPromise()
      // this._uS.getProperty(this._uS.keys_sms_property[3]).toPromise(),
    ];
    Promise.all(promises).then(
      (res:any)=>{
      res.forEach((el, i) => {
        this.optionSms[i].description = el.data.message;
      });
    }, (err:any)=>{

    })
  }

  selectedOption(i:number){
    this.textUpdate = '';
    this.smsActive = i;
  }

  updateMessage(){
    if(this.textUpdate.length < 160){
      this._uS.updateProperty(this._uS.keysSmsProperty[this.smsActive], this.textUpdate).subscribe((res:any)=>{
        this.optionSms[this.smsActive].description = this.textUpdate;
        this.textUpdate = '';
        this.toast.success('Mensaje actualizado');
      }, err => {});
    }
  }

}

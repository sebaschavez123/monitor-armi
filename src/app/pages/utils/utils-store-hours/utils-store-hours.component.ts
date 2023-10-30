import { Component } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-utils-store-hours',
  templateUrl: './utils-store-hours.component.html',
  styleUrls: ['./utils-store-hours.component.scss']
})
export class UtilsStoreHoursComponent {

  citySelected: string;
  storeSelected: string;
  hourSelected:any = undefined;
  loadingSearch = false;
  hours : Array<any> = null;

  constructor(public _dS:DashboardService, private _uS:UtilsService) { }

  search() {
    this._uS.getStoreConfig(this.storeSelected).subscribe((res:any)=>{
      this.hours = res.data;
    })
  }

  get storesByCity() {
    return this._dS.stores.slice(0).filter(store => store.city == this.citySelected);
  }

  getConfig(day:string) {
    if(!this.hours) return null;
    return this.hours.find(hr => hr.day == day);
  }

  newHour( day:string, hour?:any){
    if(!hour) {
      this.hourSelected = {
        open: null,
        store: this.storeSelected,
        day: day
      }
    } else {
      this.hourSelected = hour;
    }  
  }



}

import { Component, OnInit } from '@angular/core';
import { TransferItem } from 'ng-zorro-antd/transfer';
import { Store, Courier } from '../../../core/interfaces';
import { UtilsService } from '../../../services/utils.service';
import { DashboardService } from '../../../services/dashboard.service';
import { countryConfig } from 'src/country-config/country-config';

@Component({
  selector: 'app-utils-courier-assignment',
  templateUrl: './utils-courier-assignment.component.html',
  styleUrls: ['./utils-courier-assignment.component.scss']
})
export class UtilsCourierAssignmentComponent implements OnInit {

  stores: Array<TransferItem & any>;
  couriers: Array<Courier> = [];
  storesOrinial: Array<TransferItem & any> = [];
  courierSelected:Courier;
  loadingSearch = false;


  constructor(private _uS:UtilsService,
              public _dS:DashboardService) { }

  ngOnInit(): void {
  }

  search(){
    this.loadingSearch = true;
    this.stores = undefined;
    Promise.all([
      this._uS.getStoresWithOutCourier(String(this.courierSelected.id)).toPromise(),
      this._uS.getStoresByCourier(String(this.courierSelected.id)).toPromise(),
    ]).then((res:any)=>{
      this.loadingSearch = false;
      this.stores = res[0].data.map(s=>{
        s.title = s.name;
        s.direction = 'left';
        return s;
      });
      this.stores = this.stores.concat(res[1].data.map(s=>{
        s.title = s.name;
        s.direction = 'right';
        return s;
      }));
      this.storesOrinial = this.stores;
    }).catch(error=>{this.loadingSearch = false;})

  }

  save(){
    if (countryConfig.isColombia) {
      this._uS.basicLoadPromise(
        this._uS.updateStoresWithOutCourier(
          this.stores.filter(s=> s.direction === 'right').map(s=>{return {storeId: s.id, courierId: this.courierSelected.id}})).toPromise(),
        'Actualizando tiendas asginadas',
        'Tiendas asignadas exitosamente!',
        'Error actualizando tiendas asignadas'
      );
    } else {
      const promises = [
        this._uS.updateStoresWithOutCourier(
          this.stores.filter(s=> s.direction === 'left').map(s=>{return {storeId: s.id, courierId: 0}})).toPromise(),
        this._uS.updateStoresWithOutCourier(
          this.stores.filter(s=> s.direction === 'right').map(s=>{return {storeId: s.id, courierId: this.courierSelected.id}})).toPromise()
      ]
      this._uS.basicLoadPromise(
        Promise.all(promises),
        'Actualizando tiendas asginadas',
        'Tiendas asignadas exitosamente!',
        'Error actualizando tiendas asignadas'
      );
    }
  }

  reset(){
    this.stores = this.storesOrinial.slice(0);
  }

}

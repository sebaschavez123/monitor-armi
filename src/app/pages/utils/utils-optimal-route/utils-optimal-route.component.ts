import { Component, OnInit } from '@angular/core';
import { Store } from '../../../core/interfaces';
import { TransferItem } from 'ng-zorro-antd/transfer';
import { UtilsService } from '../../../services/utils.service';
import { DashboardService } from '../../../services/dashboard.service';
import { UserService } from 'src/app/services/user.service';
import { countryConfig } from 'src/country-config/country-config';

@Component({
  selector: 'app-utils-optimal-route',
  templateUrl: './utils-optimal-route.component.html',
  styleUrls: ['./utils-optimal-route.component.scss']
})
export class UtilsOptimalRouteComponent implements OnInit {

  stores: Array<TransferItem & Store> = [];
  storesOrinial: Array<TransferItem & Store> = [];
  storesObj:object;
  constructor(private _uS:UtilsService,
              private _US:UserService,
              private _dS:DashboardService) { }

  ngOnInit(): void {
    this.getData()
  }

  save(){
    this._uS.basicLoadPromise(this._uS.updateOptimalRoute(
      this.stores.filter(s=> s.direction == 'left').map(s=>{return String(s.id)}),
      this.stores.filter(s=> s.direction == 'right').map(s=>{return String(s.id)})
      ).toPromise(),
      "Actualizando ruta optima",
      "Ruta optima actualizada!",
      "Error actualizando ruta óptima"
    );
    let updateStores={
      storesDisable:this.stores.filter(s=> s.direction == 'right').map(s=>{return String(s.id)}),
      storesEnable:this.stores.filter(s=> s.direction == 'left').map(s=>{return String(s.id)}),
    }

    countryConfig.isColombia && this.saveStorelog(updateStores)
  }

  reset(){
    this.stores = this.storesOrinial.slice(0);
  }

  private getData(){
    this._uS.soresOptimalRoute().subscribe((res:any)=>{
      let storesEnable:Array<number> = res.data.stores.enable;
      let storesDisable:Array<number> = res.data.stores.disable;
      let stores = [];
      stores = storesEnable.map( id => { 
        let store:any = this._dS.stores.filter(store=> store.id == id)[0];
        if(!store) return {title : `Tienda ID ${id}`, direction: 'left'};
        store['title'] = `(${store?.city}) ${store?.name ?? id} - id ${store?.id}`;
        store['direction'] = 'left';
        return store;
       })
       stores = stores.concat(storesDisable.map( id => { 
        let store:any = this._dS.stores.filter(store=> store.id == id)[0];
        if(!store) return {title : `Tienda ID ${id}`, direction: 'right'};
        store['title'] = `(${store?.city}) ${store?.name ?? id} - id ${store?.id}`;
        store['direction'] = 'right';
        return store;
       }))
       this.stores = stores;
       this.storesOrinial = stores.slice(0);
       this.storesObj={
        storesEnable,
        storesDisable
       }
    })
  }
  saveStorelog(newObj: object) {
    var oldObj = this.storesObj;
    var newValues = '';
    var oldValues = '';

    for (var key in oldObj) {
      if (oldObj.hasOwnProperty(key) && oldObj[key] !== newObj[key]) {
          newValues += key + '=' + newObj[key] + ', ';
          oldValues += key + '=' + oldObj[key] + ', ';
      }
    }
   
    let data = {
        module: "1",
        changes: [
        {
            newValues: newValues.toString(),
            oldValues: oldValues.toString(),
        }
        ]
    }
    this._US.saveUserlogs(data).toPromise()
  }
}

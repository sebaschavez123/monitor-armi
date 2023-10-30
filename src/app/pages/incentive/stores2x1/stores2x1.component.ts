import { Component, OnInit } from '@angular/core';
import { IncentiveService } from 'src/app/services/incentive.service';
import { Store } from '../../../core/interfaces';
import { TransferItem } from 'ng-zorro-antd/transfer';


@Component({
    selector: 'app-store-2x1',
    templateUrl: './stores2x1.component.html',
    styleUrls: ['./stores2x1.component.scss']
})

export class Store2x2Component implements OnInit {
    loadingData = false;
    stores: Array<TransferItem & Store> = [];
    storesOrinial: Array<TransferItem & Store> = [];
    
    constructor(private _iS: IncentiveService) { }

    ngOnInit(): void {
        this.getData()
      }
    
      save(){
        const enable  = this.stores.filter(s=> s.direction == 'left').map(s=>{return String(s.id)});
        const disable = this.stores.filter(s=> s.direction == 'right').map(s=>{return String(s.id)});
        this._iS.basicLoadPromise(this._iS.setVipStores({ stores: { enable, disable} }).toPromise(),
          "Actualizando ...",
          "¡Información actualizada!",
          "Error al actualizar información!!"
        );
      }
    
      reset(){
        this.stores = this.storesOrinial.slice(0);
      }

    getData() {
        this.loadingData = true;
        this._iS.getVipStores().subscribe((data:any)=>{
            if(!data?.stores) {
              this.loadingData = false;
              return;
            }
            let storesEnable:Array<number> = data.stores.enable;
            let storesDisable:Array<number> = data.stores.disable;
            let stores = [];
            stores = storesEnable.map( id => { 
              let store:any = this._iS.stores.filter(store=> store.id == id)[0];
              if(!store) return {title : `Tienda ID ${id}`, direction: 'left'};
              store['title'] = `(${store?.city}) ${store?.name ?? id} - id ${store?.id}`;
              store['direction'] = 'left';
              return store;
             })
             stores = stores.concat(storesDisable.map( id => { 
              let store:any = this._iS.stores.filter(store=> store.id == id)[0];
              if(!store) return {title : `Tienda ID ${id}`, direction: 'right'};
              store['title'] = `(${store?.city}) ${store?.name ?? id} - id ${store?.id}`;
              store['direction'] = 'right';
              return store;
             }))
             this.stores = stores;
             this.storesOrinial = stores.slice(0);
             this.loadingData = false;
          });
    }

}
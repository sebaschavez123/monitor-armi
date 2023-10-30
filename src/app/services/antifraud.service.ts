import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class AntifraudService extends BaseService {

    urls = {
        block: `${this.gatewayAntifraud}/lockData`,
        chargeback: `${this.gatewayAntifraud}/saveChargeback`,
        products: `${this.gatewayAntifraud}/getLockedItem`,
        listBlock: `${this.gatewayAntifraud}/getLockedData`,
        listChargeback: `${this.gatewayAntifraud}/getChargeback`,
        removeBlock: `${this.gatewayAntifraud}/deleteLockedData/idLockData`,
        removeChargeback: `${this.gatewayAntifraud}/deleteChargeback/idChargeback`,
        find: `${this.gatewayAntifraud}/searchLockedData`,
        findChargeback: `${this.gatewayAntifraud}/searchChargeback`,
        findByCustomerId: `${this.gatewayAntifraud}/existAntifraudByCustomer/idCustomer/:id`,
        orders : `${this.gateway30Dashboard}/getOrders20JSON/FRAUD`,
        show: `${this.gatewaySB}/productEndpoint/getItem?idItem=:productID&idStoreGroup=26&token=b2ffcc4b898b37116a27c8151e128950&tokenIdWebSafe=ahZzfnN0dW5uaW5nLWJhc2UtMTY0NDAycl0LEgRVc2VyIiRjNTBiODNlOC0xODVlLTQ2ODktYTFiYy0wNTJiZDM1MWViMTkMCxIFVG9rZW4iJDExMTlhZGU5LTQ0ODctNGRjNC05OTU3LWNlYzczYjFlODNhZQw&key=AIzaSyCZM3UTSYacMapk86ZaOWSk-e3mnG1gwfo`
      }
      
    settings = {}
    
    
      constructor(http:HttpClient,
                  private db: AngularFireDatabase,
                  private _uS:UtilsService) {
        super(http);
      }
    
      getOrders() { return this.get(this.urls.orders); }
    
      blockData(idLockType:number, data: string) {
        return this.post(this.urls.block, { idLockType, data, employeeNumber: this.getLocalUser().employeeNumber}).toPromise();
      }
    
      addChargeback(idLockType, data:string){
        return this.post(this.urls.chargeback, { idLockType, data}).toPromise();
      }
      
      listData(lockType: number, page: number = 1, size: number = 15, chargebacks?:boolean) {
        let params = `lockType/${lockType}/page/${page}/size/${size}`;
        let url = chargebacks ? this.urls.listChargeback : this.urls.listBlock;
        return this.get(`${url}/${params}`).toPromise();
      }
    
      productsList(page: number = 1, size: number = 15) {
        let params = `page/${page}/size/${size}`;
        return this.get(`${this.urls.products}/${params}`).toPromise();
      }
      
      showProduct(productID) {
        let url = this.urls.show.replace(':productID', productID);
        return this.get(url).toPromise();
      }
    
      find(lockType: number, data: string) {
        let params = `lockType/${lockType}/data/${data}`; 
        return this.get(`${this.urls.find}/${params}`).toPromise();
      }

      findByCustomerId(customerId: string) {
        return this.get(`${this.urls.findByCustomerId.replace(':id',customerId)}`);
      }
    
      findChargeback(lockType: number, data: string) {
        let params = `/lockType/${lockType}/data/${data}`;
        return this.get(`${this.urls.findChargeback}/${params}`).toPromise();
      }
      
      removeData(data: string, chargebacks:boolean) {
        let url = chargebacks ? this.urls.removeChargeback : this.urls.removeBlock;
        return this.delete(url+`/${data}}`).toPromise();
      }


}
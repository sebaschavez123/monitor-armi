import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { User, ColumnData, Customer } from '../core/interfaces';
import { firstValueFrom, map, Observable, throwError } from 'rxjs';
import { countryConfig } from 'src/country-config/country-config';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService {

  urls = {
    search: `${this.gateway}/customerMonitorEndpoint/getCustomerByIdDocEmail?key=AIzaSyCZM3UTSYacMapk86ZaOWSk-e3mnG1gwfo`,
    // TODO: MIGRAR PARA VENEZUELA
    //searchV2: `${this.gateway30}/readCustomerMonitor`,
    searchV2 : `${this.searchCustomer}/readCustomerMonitor`,
    update: `${this.gateway}/customerMonitorEndpoint/updateCustomer?key=AIzaSyCZM3UTSYacMapk86ZaOWSk-e3mnG1gwfo`,
    deleteV2: `${this.gateway30}/deleteLogicCustomer/:id`,
    getCustomersBlocked:  `${this.gateway30}/getCustomersBlocked`,
    isBlocked: `${this.gatewaySB}/${countryConfig.isBlockedById}/isBlockedUserForId?idCustomer=:id&key=AIzaSyCZM3UTSYacMapk86ZaOWSk-e3mnG1gwfo`,
    lifemiles: `${this.gateway30}/lifemilesByIdCustomer/:id`,
    updateLM: `${this.gateway}/customerMonitorEndpoint/crearLifemile?key=AIzaSyCZM3UTSYacMapk86ZaOWSk-e3mnG1gwfo`,
    addressStatus: `${this.gateway30}/updateStatusAddressCustomer/:id/:ns`,
    saveDeletedCustomer: `${this.gateway30}/saveDeletedCustomer`,
    listDeletedCustomer: `${this.gateway30}/getListDeletedCustomer`,
    optionsDelte: `${this.gateway30}/getCancellationReasonCustomerDomain`,
    getSubscriptions: `${this.gateway30Reports}/getCustomerSubscription`,
    getSubscriptionDetails: `${this.gateway30Reports}/getCustomerSubscriptionDetail`,
    getDiscountSAS: `${this.gateway30SAS}/customer/v1/subscription-list/customer/docNumber/:number/discount`,
    updateAddress: `${this.gateway30}/updateAddressCustomer`,
    getCreditCards: `${this.gateway30}/getInfoCreditCard/:id`,
    blockData: `${this.gatewayAntifraud}/lockData`,
    unBlockData: `${this.gatewayAntifraud}/deleteLockedData/idLockData`,
    unBlockClient: `${this.gatewayAntifraud}/unBlockData/:id`,
  }

  constructor(http:HttpClient) {
    super(http)
  }

  getByParam(param:string,value:string){
    const object = {};
    object[param] = value;
    const jsonData = JSON.stringify(object);
    return this.post(this.urls.searchV2, jsonData);
  }

  getByParamPromise(param:string,value:string){
    const object = {};
    object[param] = value;
    const jsonData = JSON.stringify(object);
    return new Promise((resolve, reject) => {
      this.post(this.urls.search, jsonData)
      .subscribe(
        res => {
          resolve(res)
        },
        err => {
          if(err.error.error.code === 400){
            resolve(null);
          }else{
            reject();
            // tslint:disable-next-line: deprecation
            return throwError(() => err);
          }
        });
		});
  }

  getCreditCards(id:number){
    return this.get(this.urls.getCreditCards.replace(':id', String(id)))
      .pipe(map((crds:any) => crds.data));
  }

  blockData(idLockType:number, data: string) {
    const params = {idLockType, data, employeeNumber: this.getLocalUser().employeeNumber};
    return firstValueFrom(this.post(this.urls.blockData, params));
  }

  unblockData(data: string) {
    const url = `${this.urls.unBlockData}/${data}/employeeNumber/${this.getLocalUser().employeeNumber}`;
    return firstValueFrom(this.delete(url));
  }

  unBlockClient(client) {
    return firstValueFrom(this.get(this.urls.unBlockClient.replace(':id', client)));
  }



  getLifemiles(id:number){
    return this.get(this.urls.lifemiles.replace(':id', String(id)));
  }

  setLifemile(id:number, lm:string){
    const jsonData = JSON.stringify({
      idCustomer: id,
      lifeMileNumber: lm
    });
    return this.post(this.urls.updateLM, jsonData);
  }

  update(customer:Customer, id:number){
    const data = {
      id,
      firstName: customer.firstname,
      lastName: customer.lastname,
      documentNumber: customer.documentNumber,
      email: customer.email,
      phone: customer.phone,
      gender: 'M',
      profileImageUrl: 'https://www.google.com.co/imgres?imgurl=http%3A%2F%2Fsite.lacosacine.com%2Fimg%2Fcine%2F1nuv7ge__1487797223.jpeg&imgrefurl=http%3A%2F%2Flacosacine.com%2Fcine%2F9917%2Favant-premiere-la-cosa-cine%3A-logan&docid=tptwhHs6scgN7M&tbnid=pTGdGEAZdwAOMM%3A&vet=1&w=800&h=533&bih=1066&biw=2133&q=logan%20image&ved=0ahUKEwiYyM6QwMrSAhVB5yYKHW4KCE0QMwgfKAUwBQ&iact=mrc&uact=8',
    };
    return this.put(this.urls.update,data);
  }

  getDeletedCustomers(data){
    return this.post(this.urls.listDeletedCustomer, data);
  }

  isBlocked(id:string){
    return this.get(this.urls.isBlocked.replace(':id', id));
  }

  customersBlocked(){
    return this.get(this.urls.getCustomersBlocked);
  }

  updateAddress(data:any) {
    return this.post(this.urls.updateAddress, data);
  }

  customerDelete(id:number){
    return this.post(this.urls.deleteV2.replace(':id', String(id)), {});
  }

  setCustomerAddressStatus(id:number, status:boolean){
    const ns = status ? 1 : 0;
    return this.get(this.urls.addressStatus.replace(':id', `${id}`).replace(':ns', String(ns)));
  }


  getDiscountSAS(documentNumber){
    return this.get(this.urls.getDiscountSAS.replace(':number', documentNumber));
  }

  getSubscriptions(customerDocument:number){
    return this.post(this.urls.getSubscriptions, {customerDocument});
  }

  getSubscriptionDetails(suscriptionId:number, deliveryStore:number){
    return this.post(this.urls.getSubscriptionDetails, {suscriptionId, deliveryStore});
  }


  saveDeleted(customer:Customer, comments:string){
    const data = {
        id:customer.id,
        deletedUser: this.getLocalUser().employeeNumber,
        reason:JSON.stringify(customer),
        comments: comments?comments:''
    };
    return this.post(this.urls.saveDeletedCustomer, data);
  }

  getOptionsDelete(){
    return this.get(this.urls.optionsDelte);
  }

  getCols():Array<ColumnData>{
    const cols = [
      {
        name: 'id',
        header: 'Id',
        label: 'Id',
        sortOrder: null,
        sortFn: (a: any, b: any) => Number(a.id) - Number(b.id)
      },
      {
        name: 'firstname',
        header: 'Nombres',
        label: 'Nombres',
        sortOrder: null,
        sortFn: (firstName: string, item: any) => item.firstName.indexOf(firstName) !== -1
      },
      {
        name: 'lastname',
        header: 'Apellido',
        label: 'Apellido',
        sortOrder: null,
        sortFn: (lastName: string, item: any) => item.lastName.indexOf(lastName) !== -1
      },
      {
        name: 'documentNumber',
        header: 'Número de documento',
        label: 'Cédula',
        sortOrder: null,
        sortFn: (a: any, b: any) => Number(a.documentNumber) - Number(b.documentNumber)
      },
      {
        name: 'email',
        header: 'Correo electrónico',
        label: 'Email',
        sortOrder: null,
        sortFn: (email: string, item: any) => item.email.indexOf(email) !== -1
      },
      {
        name: 'phone',
        header: 'Número de Télefono',
        label: 'Télefono',
        sortOrder: null,
        sortFn: (a: any, b: any) => Number(a.phone) - Number(b.phone)
      },
      {
        name: 'atomId',
        header: 'Id atom',
        label: 'Id atom',
        sortOrder: null,
        sortFn: (a: any, b: any) => Number(a.atomId) - Number(b.atomId)
      },
      {
        name: 'registeredBy',
        header: 'Login activo',
        label: 'Login activo',
        sortOrder: null,
        sortFn: (registeredBy: string, item: any) => item.registeredBy.indexOf(registeredBy) !== -1
      },
      {
        name: 'creationDate',
        header: 'Fecha de Creación',
        label: 'Fecha de creación',
        sortOrder: null,
        sortFn: (a: any, b: any) => new Date(a.creationDate) > new Date(b.creationDate)
      },
      {
        name: 'blocked',
        header: 'Bloqueado',
        label: 'Bloqueado',
        sortOrder: null,
        sortFn: (blocked: string, item: any) => item.email.indexOf(blocked) !== -1
      },
    ];
    if(countryConfig.isColombia){
      cols.push(
        {
          name: 'isPrime',
          header: 'Tiene membresia Prime',
          label: 'Prime',
          sortOrder: null,
          sortFn: (isPrime: string, item: any) => item.email.indexOf(isPrime) !== -1
        }
      )
    }
    return cols;
  }

}

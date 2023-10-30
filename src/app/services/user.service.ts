import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DashboardService } from './dashboard.service';
import { User, ColumnData } from '../core/interfaces';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { firstValueFrom } from 'rxjs';
import { countryConfig } from 'src/country-config/country-config';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  headers = new HttpHeaders(countryConfig.headersNgZorro);
  urls = {
    unblock: `${this.gateway}/customerMonitorEndpoint/unblockUser?key=AIzaSyCZM3UTSYacMapk86ZaOWSk-e3mnG1gwfo`,
    block: `${this.gateway}/customerMonitorEndpoint/blockUser?key=AIzaSyCZM3UTSYacMapk86ZaOWSk-e3mnG1gwfo`,
    verify: `${this.gateway}/customerMonitorEndpoint/verifyUser`,
    users: `${this.gateway30}/getUsersMonitor`,
    delete: `${this.gateway30}/deleteUserMonitor`,
    rols: `${this.gateway30}/getRolsMonitor`,
    edit: `${this.gateway30}/editUserMonitor`,
    create: `${this.gateway30}/createUserMonitor`,
    validateImageMessenger: `${this.gateway30}/validateImageMessenger`,
    changePassword: `${this.gateway30Reports}/changePassword`,
    saveMessengerProvider: `${this.gateway30}/saveMessengerByProvider`,
    modifyStatusCustomer: `${this.gateway30}/modifyStatusCustomer`,
    updateMessengerList: `${this.gateway30}/manageListMessengerMonitor`,
    updateArmireneInfo: `${this.gateway30}/saveMessengerInfoDetail`,
    saveBlockMessenger : `${this.gateway30Reports}/saveBlockMessenger`,
    UnlockMessengerLog : `${this.gateway30Reports}/UnlockMessenger`,
    managementLogs: `${this.gateway30Reports}/managementLogs`,
    messengers: `${this.gateway30}/providers/Messengers`,    
  }

  constructor(http:HttpClient,
              private db: AngularFireDatabase,
              private _dS:DashboardService) {
              super(http)
  }
  saveBlockMessenger(messengerId, reasonId, employeeNumber) {
    return this.post(this.urls.saveBlockMessenger, {messengerId: messengerId, blockReasonId: reasonId, employeeNumber: employeeNumber});
  }

  unblockUser(customerId:number){
    return this.post(this.urls.unblock, {idUser: customerId});
  }

  blockUser(customerId:number, comentary:string){
    return this.post(this.urls.block, {idUser: customerId, reasonBlock: comentary});
  }

  verify(customerId){
    return this.getParams(this.urls.verify, {customerId} );
  }

  getUsers( useNewService = false ){
    const useNewServiceCourier = countryConfig.endpoints.courier.useNewService && useNewService;
    return this.http.get( useNewServiceCourier ? this.urls.messengers : this.urls.users, {headers: this.headers});
  }

  deleteUser(employeeNumber:number){
    return this.post(this.urls.delete, {employeeNumber});
  }

  update(user:User, useNewService = false){
    const useNewServiceCourier = countryConfig.endpoints.courier.useNewService && useNewService;
    if (useNewServiceCourier) {
      return this.put(this.urls.messengers, user);
    } 
    return this.post(this.urls.edit, user);
  }

  validateImageMessenger(message, code, employeeNumber){
    const body = {
      "observation": message,
	    "isValidImage": code,
	    "employeeNumber": employeeNumber
    }
    return this.post(this.urls.validateImageMessenger, body)
  }

  create(user, useNewService = false){
    const useNewServiceCourier = countryConfig.endpoints.courier.useNewService && useNewService;
    return this.post( useNewServiceCourier ? this.urls.messengers : this.urls.create, user);
  }

  saveMessengerByProvider(messengerId, cityId, vehicleTypeId?, messengerProviderId?, urlPhoto?){
    return this.post(this.urls.saveMessengerProvider, {messengerId, messengerProviderId: messengerProviderId ?? 1, vehicleTypeId, cityId, urlPhoto});
  }
  saveArmireneInfo(data){
    return this.post(this.urls.updateArmireneInfo, data);
  }

  saveUserlogs(data){
    return this.post(this.urls.managementLogs, data)
  }
  
  messengerIsBloqued(id) {
    return this.db.database.app.database(this.dbMessengerUrl)
    .ref('/blockeds/'+id).once('value');
  }

  messengerBlock(id, block:boolean) {
    if(countryConfig.isColombia && !block){ this.unlockMessengerLog(id); }
    return this.db.database.app.database(this.dbMessengerUrl)
    .ref('/blockeds/'+id).set(!block?null:block);
  }

  unlockMessengerLog(id) {
    firstValueFrom(
      this.post(this.urls.UnlockMessengerLog, {
        messengerId: id,
        employeeNumber: this.getLocalUser().employeeNumber
      })
    ).then();
  }

  updateMessengerList(messengers:Array<any>) {
    return this.post(this.urls.updateMessengerList, messengers);
  }

  cambiarContrasena(newPassword, oldPassword){
    const data = {
      employeeNumber:this.getLocalUser().employeeNumber,
      newPassword,
      oldPassword
    }
    return this.post(this.urls.changePassword, data);
  }

  getRols(){
    return this.get(this.urls.rols);
  }

  modifyStatusCustomer(customerId, status){
    const data = {
      customerId,
      status,
      employeeNumber:  this.getLocalUser().employeeNumber,
    };
    return this.post(this.urls.modifyStatusCustomer, data);
  }

  getCols():Array<ColumnData>{
    return [
      {
        name: 'employeeName',
        header: 'Nombre de empleado',
        label: 'Empleado',
        sortOrder: null,
        sortFn: (employeeName: string, item: any) => item.employeeName.indexOf(employeeName) !== -1
      },
      {
        name: 'rolName',
        header: 'Rol',
        label: 'Perfil',
        sortOrder: null,
        sortFn: (rolName: string, item: any) => item.rolName.indexOf(rolName) !== -1
      },
      {
        name: 'employeeNumber',
        header: 'Código de empleado',
        label: 'Código',
        sortOrder: null,
        sortFn: (a: any, b: any) => Number(a.employeeNumber) - Number(b.employeeNumber)
      },
      {
        name: 'email',
        header: 'Correo electrónico',
        label: 'Email',
        sortOrder: null,
        sortFn: (rolName: string, item: any) => item.rolName.indexOf(rolName) !== -1
      },
      {
        name: 'storeName',
        header: 'Tienda',
        label: 'Tienda',
        key:'stores',
        sortOrder: null,
        sortFn: (a: any, b: any) => String(a.storeName).localeCompare(String(b.storeName)),
        filterMultiple: true,
        listOfFilter: this._dS.stores.map(x=>{ return { text: x.name, value: x.name }}),
        filterFn: (storeName: string, item: any) => item.storeName.indexOf(storeName) !== -1
      },
    ]
  }

}

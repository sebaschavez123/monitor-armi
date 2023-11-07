import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
// services
import { BaseService } from './base.service';
import { countryConfig } from 'src/country-config/country-config';


@Injectable({providedIn: 'root'})
export class IncentiveService extends BaseService {
    
    urls = {
        getVipStores:`${this.gateway30}/getVipStores`,
        getIncentives: `${this.gateway30}/getIncentiveConfigAlgolia`,
        setIncentives: `${this.gateway30}/editIncentiveConfigAlgolia`,
        validateIncentives : `${this.gateway30}/validateIncentiveDate`,
        setVipStores:`${this.gateway30}/updateVipStoresConfig`,
        getValuesList:`${this.gateway30}/getMonitorIncentiveValues`,
        getIncentiveTypes: `${this.gateway30}/getIncentiveTypes`,
        getArmireneIncentive:`${this.gateway30}/getArmireneIncentiveConfigAlgolia`,
        setArmireneIncentive:`${this.gateway30}/editArmireneIncentiveConfigAlgolia`,
        setIncentiveModuleLog:`${this.gateway30Reports}/saveIncentiveModuleLog`,
    };


    constructor(http:HttpClient) {
        super(http);
     }
    
     getIncentives() {
        return this.get(this.urls.getIncentives)
            .pipe(map((o: any) => o.data));
    }
    
    setIncentives(data: any) {
        return this.post(this.urls.setIncentives, data);
    }

    validateIncentives(data: any, action ) {
        const headers = {
            'rol': this.getLocalUser()?.rolUser,
            'correoUsuario': this.getLocalUser()?.email,
            'employeeNumber':  this.getLocalUser()?.employeeNumber,
            'Content-Type': 'application/json',
            'userAction': action,
            'Country': countryConfig.isColombia? 'COL': 'VEN'
          };        
        return this.http.post(this.urls.validateIncentives, data, {headers: headers} ) 
    }
    
    getVipStores() {
        return this.get(this.urls.getVipStores)
            .pipe(map((o: any) => o.data));
    }

    getIncentiveTypes() {
        return this.get(this.urls.getIncentiveTypes)
            .pipe(map((o: any) => o.data));
    }

    

    setArmireneIncentives(data: any) {
        return this.post(this.urls.setArmireneIncentive, data);
    }
    
    getArmireneIncentives() {
        return this.get(this.urls.getArmireneIncentive)
            .pipe(map((o: any) => o.data));
    }

    setVipStores(data: any) {
        return this.post(this.urls.setVipStores, data);
    }

    getValuesList() {
        return this.get(this.urls.getValuesList)
            .pipe(map((v: any) => v.data));
    }

    setIncentiveModuleLog(data: any) {
        const newData = {
            ...data,
            employeeNumber: this.getLocalUser()?.employeeNumber,
        };
        return this.post(this.urls.setIncentiveModuleLog, newData);
    }
}
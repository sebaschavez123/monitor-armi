import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
  })
export class FirebaseService extends BaseService {

    constructor(public http: HttpClient) {
        super(http);
    }

    canceledOrder(orderId){
        
        var endPoint = '/ordersCanceled/';
     
        const url = this.gatewayFirebase + endPoint +  orderId + '.json';
   
        return this.put(url, JSON.stringify(true));      
    }


    finalizedOrder(orderId){
        
        var endPoint = '/ordersFinalized/';

        var headers = new Headers(); 
        
     
        const url = this.gatewayFirebase + endPoint +  orderId + '.json';
   
        return this.put(url, JSON.stringify(true));      
    }



    lockMessenger(messengerId){
        
        var endPoint = '/usersBlocked/';

        var headers = new Headers(); 
        
     
        const url = this.gatewayFirebase + endPoint +  messengerId + '.json';
   
        return this.put(url, JSON.stringify(true));      
    }

    unlockMessenger(idMessenger){
        
        var endPoint = '/usersBlocked/';

        var headers = new Headers(); 
        

        const url = this.gatewayFirebase + endPoint + idMessenger + '.json';

        return this.delete(url);      
    }

}
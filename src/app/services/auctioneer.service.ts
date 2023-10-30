import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({providedIn: 'root'})
export class AuctioneerService extends BaseService {

  urls = {
    getData: `${this.gateway30}/getOrderAuctioneerConfig`,
    getMonitorAuctioneerValues : `${this.gateway30}/getMonitorAuctioneerValues`,
    setData: `${this.support}/orderauctioneerproperties`,
  }
    
    constructor(private _http: HttpClient) {
        super(_http);
    }
    
    getData() {
      return this.get(this.urls.getData)
        .pipe(map((d:any) => d.data));
    }

    getMonitorAuctioneerValues() {
      return this.get(this.urls.getMonitorAuctioneerValues)
        .pipe(map((d:any) => d.data));
    }

    setData(value) {
      return this.put(this.urls.setData, value);
    }
}
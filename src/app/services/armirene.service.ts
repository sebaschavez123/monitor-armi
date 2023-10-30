import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';
import { countryConfig } from 'src/country-config/country-config';

@Injectable({providedIn: 'root'})
export class ArmireneService {
    
    domain = countryConfig.isColombia
        ? 'https://messenger-tracking-dot-armirene-col-dot-armirene-369418.uc.r.appspot.com'
        : 'https://messenger-tracking-dot-armirene-ven-dot-armirene-369418.uc.r.appspot.com';

    urls = {
        earningsPerDay: `${this.domain}/backend/flexible/v2/messenger/getMessengerEarnings`,
        earningsPerDayDetail: `${this.domain}/backend/flexible/v2/messenger/postMessengerEarningsXDay`
    }

    
    
    constructor(private http: HttpClient) {}

    private httpOptions() : {headers: HttpHeaders} {
        const data: any = { 'appversion': '4', 'Content-Type': 'application/json' };
        return  { headers: new HttpHeaders(data)};
      }

    private get(url: string) {
		return this.http.get(url, this.httpOptions());
	}
    private post(url: string, body: any) {
		return this.http.post(url, body, this.httpOptions());
	}

    
    getEarningsPerDay(params) {
        console.log({params})
        return firstValueFrom(
            this.post(this.urls.earningsPerDay, params)
              .pipe(map((d:any) => d.data))
        );
      }

      getDayData(date, messengerId) {
        return firstValueFrom(this.post(this.urls.earningsPerDayDetail, {date, messengerId})
            .pipe(map((d:any) => d.data)));
      }
}
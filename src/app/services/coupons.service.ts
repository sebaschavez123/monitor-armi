import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { ColumnData } from '../core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CouponsService extends BaseService {

    urls = {
        actives : `${this.gateway30}/getActiveCoupons`,
        offer : `${this.gateway30}/insertOfferFixedCoupon`,
        insert: `${this.gatewaySB}/couponEndpoint/createCoupon?key=AIzaSyCZM3UTSYacMapk86ZaOWSk-e3mnG1gwfo`,
    }

  constructor(public http:HttpClient) {
    super(http);
  }

  getActives(){
    return this.get(this.urls.actives);
  }

  setOfferId(data:any){
    let json = {"componentId":data.componentId, "minAmount":data.minAmount, "discountAmount":data.discountAmount};
    return this.put(this.urls.offer, json);
  }

  cuponGenerate(dataForm:any, type:number, description:string){
    let data = {
      'name': dataForm.coupon,
      'firstDescription': description,
      'secondDescription':null,
      'photoUrl': "https://lh3.googleusercontent.com/sD8OeARFFRYETF4MvnM5zIcwz1D6bsgDXza9HmrF0E2WtSaVjApPxVw379gmqi6uXIxl2Tz4yr-LDSwcss61uBuhYzmnMe92x-s",
      'startDate': new Date(dataForm.beginDate).getTime(),
      'startsLater': false,
      'expires':true,
      'expirationDate':new Date(dataForm.endDate).getTime(),
      'hasLimit': false,
      'maximumNumber': null,
      'couponType': type == 0 ? "Value":"PERCENTAGE",
      'payMethodType':null,
      'offerId': dataForm.componentId,
      'hasRestriction': false,
      'restrictionValue': dataForm.minAmount,
      'keyClient': '12345'
    }
    return this.post(this.urls.insert, data);
  }

  getCols():Array<ColumnData>{
    return [
      { 
        name: 'componentId',
        header: 'Component Id',
        label: 'Component Id',
        sortOrder: null,
        sortFn: (a: any, b: any) => Number(a.componentId) - Number(b.componentId)
      },
      { 
        name: 'offerId',
        header: 'Offer Id',
        label: 'Offer Id'
      },
      { 
        name: 'minAmount',
        header: 'Compra miníma',
        label: 'Compra miníma',
        sortOrder: null,
        sortFn: (a: any, b: any) => Number(a.minAmount) - Number(b.minAmount)
      },
      { 
        name: 'discountAmount',
        header: 'Descuento',
        label: 'Descuento',
        sortOrder: null,
        sortFn: (a: any, b: any) => Number(a.discountAmount) - Number(b.discountAmount)
      },
      { 
        name: 'coupon',
        header: 'Nombre',
        label: 'Nombre',
        sortOrder: null,
        sortFn: (coupon: string, item: any) => item.coupon.indexOf(coupon) !== -1
      },
      { 
        name: 'beginDate',
        header: 'Fecha de inicio',
        label: 'Fecha de inicio',
        sortOrder: null,
        sortFn: (a: any, b: any) => new Date(a.beginDate) > new Date(b.beginDate)
      },
      { 
        name: 'endDate',
        header: 'Fecha final',
        label: 'Fecha final',
        sortOrder: null,
        sortFn: (a: any, b: any) => new Date(a.endDate) > new Date(b.endDate)
      }
    ]

  }


}
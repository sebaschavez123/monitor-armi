import { Component, OnInit } from '@angular/core';
import { ColumnData, Coupon } from 'src/app/core/interfaces';
import { CouponsService } from 'src/app/services/coupons.service';

@Component({
  selector: 'app-coupons-list',
  templateUrl: './coupons-list.component.html',
  styleUrls: ['./coupons-list.component.scss']
})
export class CouponsListComponent implements OnInit {

  coupons:Array<Coupon>;
  cols:Array<ColumnData> = [];
  couponSelected:Coupon;
  couponType:string;

  constructor(private _cS:CouponsService) { }

  ngOnInit(): void {
    this.cols = this._cS.getCols();
    this.getData();
  }

  edit(coupon:Coupon, type:string){
    this.couponSelected = coupon;
    this.couponType = type;
  }

  private getData(){
    this._cS.getActives().subscribe((res:any)=>{
      this.coupons = res.data;
    }, (error:any)=>{this.coupons = [];})
  }

}

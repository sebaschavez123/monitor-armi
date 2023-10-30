import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'order-view',
  template: `
  <div *ngIf="!orderSelected" class="text-center mt-5">
  <p class="ant-upload-drag-icon"><i nz-icon nzType="loading" style="font-size: 30px; color: #1b55e3;"></i></p>
  <p class="ant-upload-text text-width">Cargando orden número {{id}}</p>
  </div>
  <div class="overflow-auto">
  <order-detail [order]="orderSelected" [typeReport]="'search'" [exportPdf]="false" [editCourier]="true" [missings]="true" [pageMode]="true"></order-detail>
    </div>`,
  styleUrls: ['./order-view.component.scss']
})
export class OrderViewComponent implements OnInit {

  orderSelected:any;
  id:string;

  constructor(private _dS:DashboardService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this._dS.searchOrders([{orderId: this.id}]).subscribe((rta:any) => {
      this.orderSelected = rta.data[0];
    })
  }

}

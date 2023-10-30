import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ArmireneService } from 'src/app/services/armirene.service';
import Swal from 'sweetalert2'

@Component({
    selector: 'selector-name',
    templateUrl: './messenger-profits.component.html',
    styleUrls: ['./messenger-profits.component.scss'],
})

export class MessengerProfitsComponent implements OnInit {
    frmtouch = false;
    dateRange:Array<Date> = [];
    days:Array<any>;
    Profitday = 0;
    totalday = 0;
    orders:Array<any>;
    ordersDetail:Array<any>;
    messengerId = null;
    isLoading = false;
    selectedOrder:any = null;
    selectedDay: string = null;

    constructor(
        private armi: ArmireneService
    ) { }

    ngOnInit() {}

    setDay(day) {
        this.isLoading = true;
        this.selectedDay = day;
        this.getDayData();
    }

    getDayData() {
        this.isLoading = false;
        this.totalday = null;
        this.selectedOrder = null;
        this.orders = null;
        this.armi.getDayData(this.selectedDay, this.messengerId).then(
            ({earningsPerDay, total}) => {
                this.orders = earningsPerDay;
                this.totalday = total;
                this.isLoading = false;
            }
        );
    }

    setOrder(order) {
        this.selectedOrder = order;
    }

    isFormValid() {
        return this.frmtouch && (!this.dateRange || this.dateRange.length == 0 || !this.messengerId);
    }

    resetData() {
        this.days = null;
        this.Profitday = null;
        this.orders = null;
        this.totalday = null;
        this.selectedOrder = null;
        this.selectedDay = null;
    }

    search(forma: NgForm) {
        this.frmtouch = true;
        if(forma.invalid) return false;
        this.resetData();
        this.isLoading = false;
        const data = {
            startDate: this.formatDate(this.dateRange[0]),
            endDate: this.formatDate(this.dateRange[1]),
            messengerId: this.messengerId
        };
        this.armi.getEarningsPerDay(data).then(
            ({earningsPerDay, total}) => {
                this.isLoading = false;
                this.days = earningsPerDay;
                this.Profitday = total;
            }
        ).catch(({error}) => {
            Swal.fire(
                'No se ha podido realizar la consulta',
                (error.code ? `code: ${error.code }` : '').toLowerCase(),
                'error'
            );
        });
    }
    
    changeRange() {}

    private formatDate(d: Date, separator = '/') {
        let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join(separator);
    }
}
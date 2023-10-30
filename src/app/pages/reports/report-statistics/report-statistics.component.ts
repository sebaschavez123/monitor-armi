import { Component, OnInit } from '@angular/core';
import { NzI18nService, es_ES } from 'ng-zorro-antd/i18n';
import { DashboardService } from '../../../services/dashboard.service';
import { ReportsService } from '../../../services/reports.service';

@Component({
  selector: 'app-report-statistics',
  templateUrl: './report-statistics.component.html',
  styleUrls: ['./report-statistics.component.scss']
})
export class ReportStatisticsComponent implements OnInit {

  stores:Array<any> = [];
  date: Date =  new Date();
  selectedCity:any;
  selectedStore:any;
  public totalDeliveryTime = 0;
  public totalAverageDeliveryTime = 0;
  public countDeliveryTime = 0;
  public totalDeliveryTimeOrders = 0;
  public totalStuck = 0;
  public totalAverageStuck = 0;
  public countStuck = 0;
  public dataPointsDelivery: any[] = [];
  public dataPointsStuck: any[] = [];
  loading_search = false;
  hours = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    animationData = undefined;
    animationOptions = {
      axisX: {
        labelInterpolationFnc(value, index) {
          return index % 2 !== 0 ? !1 : value
        },
      },
    }

  constructor(private i18n: NzI18nService,
              public _dS:DashboardService,
              private _rS:ReportsService) { }

  ngOnInit(): void {
    this.i18n.setLocale(es_ES);
  }

  getStoresByCity($event){
    this.stores = [];
    this.selectedStore = null;
    if (this.selectedCity != null && this.selectedCity != '') this.stores = this._dS.stores.slice(0).filter(x => x.city.trim() == $event).map(x => {return {label: x.name.toLowerCase().substr(0, 30), value: x.id}});
  }

  async graph(){
    this.loading_search = true;
    this.animationData = undefined;
    this.totalStuck = 0;
    this.totalAverageStuck = 0;
    this.countStuck = 0;
    this.totalDeliveryTime = 0;
    this.totalAverageDeliveryTime = 0;
    this.countDeliveryTime = 0;
    this.totalDeliveryTimeOrders = 0;

    if (this.selectedStore == '') {
      await this.getDataDelivery();
      await this.getDataStuck();

      if (this.selectedCity != '') {
        let cityName = this.getCityName(this.selectedCity);
        cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
        // this.titleGraph = "Estadística Ciudad " + cityName;
      }
    } else {
      await this.getDataDeliveryStore();
      await this.getDataStuckStore();
      let storeName = this.getStoreName(this.selectedStore);
      storeName = storeName.charAt(0).toUpperCase() + storeName.slice(1);
      // this.titleGraph = "Estadística Tienda " + storeName;
    }

    this.loading_search = false;
    const currentHour = new Date().getHours();
    this.animationData = {
      labels: this.hours.filter(hr => +hr.split(':')[0] <= currentHour),
      series: [
        this.dataPointsDelivery,
        this.dataPointsStuck
      ],
      type: 'Line',
    }
  }

  cleanFilters() {
    this.selectedCity = '';
    this.selectedStore = '';
    this.date = new Date();
    this.stores = [];
    this.animationData = undefined;
  }

  private async getDataDelivery(){
    this.dataPointsDelivery = [];
    const data = [];
    const promises = [];
    const i = 0;
    let fec = this.date;
    const fechaInicial = this.getDateFind(fec);
    let today = new Date();
    let todayString = this.getDateFind(today);
    let hours = this.hours.slice(0);
    let isToday = false;
    let timeHour = today.getHours();
    if (todayString === fechaInicial) {
      hours = hours.splice(0, timeHour + 1);
      isToday = true;
    }

    const grouped = [];

    let initDate = fechaInicial + ' 00:00:00';
    let endDate = '';
    if (isToday) {
      let hourEnd = timeHour;
      let hourEndString = hourEnd + ':59:59';
      if (hourEnd < 0)
        hourEndString = '0' + hourEnd + ':59:59';
      endDate = fechaInicial + ' ' + hourEndString;
    } else
      endDate = fechaInicial + ' 23:59:59';

    const selectedCity = this.selectedCity;

    await this._rS.getOrdersDeliveryTimeAverage(initDate, endDate).toPromise()
    .then(async (resp:any) => {
      if (resp.data.length > 0) {
        let data = resp.data;
        let hash = Object.create(null);

        data.forEach(function (a) {
          let date = new Date(a.createDate);
          let hour = date.getHours();
          let key = hour + ':00';
          const x = JSON.parse(a.JSON);
          if (hour < 10)
            key = '0' + hour + ':00';
          if (selectedCity != '') {
            if (selectedCity != x.cityId)
              return;
          }
          if (!hash[key]) {
              hash[key] = { average: 0, count: 0, orders: 0};
              grouped[key] = hash[key];
          }
          hash[key].average += parseFloat(x.average);
          hash[key].count += 1;
          hash[key].orders += parseInt(x.orders);
        });
      }
    });


    // se procesa la información
    hours.forEach(hour => {
      let totalAverage = 0;
      let totalCount = 0;
      let totalOrders = 0;

      if (grouped[hour] != null) {
        totalAverage = grouped[hour].average;
        totalCount = grouped[hour].count;
        totalOrders = grouped[hour].orders;
      }

      let average = 0
      if (totalCount > 0)
        average = totalAverage / totalCount;

      this.totalAverageDeliveryTime = this.totalAverageDeliveryTime + average;
      this.countDeliveryTime = this.countDeliveryTime + totalCount;
      this.totalDeliveryTimeOrders = this.totalDeliveryTimeOrders + totalOrders;

      this.dataPointsDelivery.push({y: average, label: hour, orders: totalOrders});
    });

    if (this.countDeliveryTime > 0)
      this.totalDeliveryTime = this.totalAverageDeliveryTime / this.countDeliveryTime;
  }

  private async getDataStuck(){
    this.dataPointsStuck = [];
    const data = [];
    const promises = [];
    const i = 0;
    let fec = this.date;
    const fechaInicial = this.getDateFind(fec);
    let today = new Date();
    let todayString = this.getDateFind(today);
    let hours = this.hours.slice(0);
    let isToday = false;
    let timeHour = today.getHours();
    if (todayString === fechaInicial) {
      hours = hours.splice(0, timeHour + 1);
      isToday = true;
    }

    const grouped = [];

    let initDate = fechaInicial + ' 00:00:00';
    let endDate = '';
    if (isToday) {
      let hourEnd = timeHour;
      let hourEndString = hourEnd + ':59:59';
      if (hourEnd < 0)
        hourEndString = '0' + hourEnd + ':59:59';
      endDate = fechaInicial + ' ' + hourEndString;
    } else
      endDate = fechaInicial + ' 23:59:59';

    const selectedCity = this.selectedCity;

    await this._rS.getOrdersStuckAverage(initDate, endDate).toPromise()
    .then(async (resp:any) => {
      if (resp.data.length > 0) {
        let data = resp.data;
        let hash = Object.create(null);

        data.forEach(function (a) {
          let date = new Date(a.createDate);
          let hour = date.getHours();
          let key = hour + ':00';
          const x = JSON.parse(a.JSON);
          if (hour < 10)
            key = '0' + hour + ':00';
          if (selectedCity != '') {
            if (selectedCity != x.cityId)
              return;
          }
          if (!hash[key]) {
              hash[key] = { average: 0, count: 0 };
              grouped[key] = hash[key];
          }
          hash[key].average += parseFloat(x.average);
          hash[key].count += 1;
        });
      }
    });


    // se procesa la información
    hours.forEach(hour => {
      let totalAverage = 0;
      let totalCount = 0;

      if (grouped[hour] != null) {
        totalAverage = grouped[hour].average;
        totalCount = grouped[hour].count;
      }

      let average = 0
      if (totalCount > 0)
        average = totalAverage / totalCount;

      this.totalAverageStuck = this.totalAverageStuck + average;
      this.countStuck = this.countStuck + totalCount;

      this.dataPointsStuck.push({y: average, label: hour});
    });

    if (this.countStuck > 0)
      this.totalStuck = this.totalAverageStuck / this.countStuck;
  }

  private async getDataStuckStore(){
    this.dataPointsStuck = [];
    const data = [];
    const promises = [];
    const i = 0;
    let fec = this.date;
    const fechaInicial = this.getDateFind(fec);
    let today = new Date();
    let todayString = this.getDateFind(today);
    let hours = this.hours.slice(0);
    let isToday = false;
    let timeHour = today.getHours();
    if (todayString === fechaInicial) {
      hours = hours.splice(0, timeHour + 1);
      isToday = true;
    }

    const grouped = [];

    let initDate = fechaInicial + ' 00:00:00';
    let endDate = '';
    if (isToday) {
      let hourEnd = timeHour;
      let hourEndString = hourEnd + ':59:59';
      if (hourEnd < 0)
        hourEndString = '0' + hourEnd + ':59:59';
      endDate = fechaInicial + ' ' + hourEndString;
    } else
      endDate = fechaInicial + ' 23:59:59';

    const selectedStore = this.selectedStore;

    await this._rS.getOrdersStuckAverageByCity(initDate, endDate).toPromise()
    .then(async (resp:any) => {
      if (resp.data.length > 0) {
        let data = resp.data;
        let hash = Object.create(null);

        data.forEach(function (a) {
          let date = new Date(a.createDate);
          let hour = date.getHours();
          let key = hour + ':00';
          const x = JSON.parse(a.JSON);
          if (hour < 10)
            key = '0' + hour + ':00';
          if (selectedStore != x.storeId)
              return;
          if (!hash[key]) {
              hash[key] = { average: 0, count: 0 };
              grouped[key] = hash[key];
          }
          hash[key].average += parseFloat(x.average);
          hash[key].count += 1;
        });
      }
    });


    // se procesa la información
    hours.forEach(hour => {
      let totalAverage = 0;
      let totalCount = 0;

      if (grouped[hour] != null) {
        totalAverage = grouped[hour].average;
        totalCount = grouped[hour].count;
      }

      let average = 0
      if (totalCount > 0)
        average = totalAverage / totalCount;

      this.totalAverageStuck = this.totalAverageStuck + average;
      this.countStuck = this.countStuck + totalCount;

      this.dataPointsStuck.push({y: average, label: hour});
    });

    if (this.countStuck > 0)
      this.totalStuck = this.totalAverageStuck / this.countStuck;
  }

  async getDataDeliveryStore(){
    this.dataPointsDelivery = [];
    const data = [];
    const promises = [];
    const i = 0;
    let fec = this.date;
    const fechaInicial = this.getDateFind(fec);
    let today = new Date();
    let todayString = this.getDateFind(today);
    let hours = this.hours.slice(0);
    let isToday = false;
    let timeHour = today.getHours();
    if (todayString === fechaInicial) {
      hours = hours.splice(0, timeHour + 1);
      isToday = true;
    }

    const grouped = [];

    let initDate = fechaInicial + ' 00:00:00';
    let endDate = '';
    if (isToday) {
      let hourEnd = timeHour;
      let hourEndString = hourEnd + ':59:59';
      if (hourEnd < 0)
        hourEndString = '0' + hourEnd + ':59:59';
      endDate = fechaInicial + ' ' + hourEndString;
    } else
      endDate = fechaInicial + ' 23:59:59';

    const selectedStore = this.selectedStore;

    await this._rS.getOrdersDeliveryTimeAverageByCity(initDate, endDate).toPromise()
    .then(async (resp:any) => {
      if (resp.data.length > 0) {
        let data = resp.data;
        let hash = Object.create(null);

        data.forEach(function (a) {
          let date = new Date(a.createDate);
          let hour = date.getHours();
          let key = hour + ':00';
          const x = JSON.parse(a.JSON);
          if (hour < 10)
            key = '0' + hour + ':00';
          if (selectedStore != x.storeId)
              return;
          if (!hash[key]) {
              hash[key] = { average: 0, count: 0, orders: 0};
              grouped[key] = hash[key];
          }
          hash[key].average += parseFloat(x.average);
          hash[key].count += 1;
          hash[key].orders += parseInt(x.orders);
        });
      }
    });


    // se procesa la información
    hours.forEach(hour => {
      let totalAverage = 0;
      let totalCount = 0;
      let totalOrders = 0;

      if (grouped[hour] != null) {
        totalAverage = grouped[hour].average;
        totalCount = grouped[hour].count;
        totalOrders = grouped[hour].orders;
      }

      let average = 0
      if (totalCount > 0)
        average = totalAverage / totalCount;

      this.totalAverageDeliveryTime = this.totalAverageDeliveryTime + average;
      this.countDeliveryTime = this.countDeliveryTime + totalCount;
      this.totalDeliveryTimeOrders = this.totalDeliveryTimeOrders + totalOrders;

      this.dataPointsDelivery.push({y: average, label: hour, orders: totalOrders});
    });

    if (this.countDeliveryTime > 0)
      this.totalDeliveryTime = this.totalAverageDeliveryTime / this.countDeliveryTime;
  }

  private getDateFind(fecha) {
    if(fecha === ''){
      let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('/');
    }else{
      let d = new Date(fecha),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('/');
    }
}

private getCityName(id){
  let cityName = '';
  this._dS.cities.forEach(x => {if (x.value == id)cityName = x.label;});
  return cityName;
}

getStoreName(id){
  let storeName = '';
  this.stores.forEach(x => {
    if (x.value == id)
      storeName = x.label;
  });
  return storeName;
}

}

import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { ExcelService } from '../../../services/excel.service';
import { ReportsService } from '../../../services/reports.service';
import * as moment from 'moment-mini-ts';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { timer } from 'rxjs';

@Component({
  selector: 'app-report-glued',
  templateUrl: './report-glued.component.html',
  styleUrls: ['./report-glued.component.scss']
})
export class ReportGluedComponent implements OnInit {

  public profile: string = "";
  public correoUsuario = "";
  public storeId: string = "";
  public sessionToken = "";
  public storeName: string = "";
  public storeAddress: string = "";
  public nickName: string = "";
  public message: string;
  public messages: string[] = [];
  public title_module: string = "";
  public msgs:any;
  public porcentaje: string = "Cargando ...";
  public data: any;
  public storesData: any[];
  public selectedCity:string = "";
  public selectedStore:string = "";
  public fechaInicial: Date =  new Date();
  public fechaFinal: Date =  new Date();  
  public hours: string[] = [];
  public minutes: string[] = [];
  public minutesPhoto: string[] = [];
  public subTimeout;
  public dataPointsDelivery: any[] = [];
  public dataPointsStuck: any[] = [];
  public titleGraph: String = "";
  public totalDeliveryTime: number = 0;
  public totalAverageDeliveryTime: number = 0;
  public countDeliveryTime: number = 0;
  public totalDeliveryTimeOrders: number = 0;
  public totalStuck: number = 0;
  public totalStuckLastHour: number = 0;
  public totalAverageStuck: number = 0;
  public countStuck: number = 0;
  public displayGeneralAverage: boolean = false;

  public arrayExcel = [];

  public arrayHistoricos = [];
  public dataHistoricos = [];
  public stores = [];

  areaData = undefined;
  areaOptions = {
    low: 0,
    showArea: true,
  }

  loading_search:boolean = false;
  
  es: any;
  tr: any;

  constructor(public _dS:DashboardService, 
    private _rS:ReportsService,
    private toast:ToastrService,
    private excelService: ExcelService) {
  }

  toggleDataSeries(e) {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    e.chart.render();
  }

  ngOnInit() {
    this.title_module = 'Reporte Estadístico';
    this.checkAuth();
    this.graph();

    this.es = {
        firstDayOfWeek: 1,
        dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
        dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
        dayNamesMin: [ "D","L","M","X","J","V","S" ],
        monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
        monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ],
        today: 'Hoy',
        clear: 'Borrar'
    }

    this.tr = {
        firstDayOfWeek : 1
    }

    this.hours = ["00", "01", "02", "03", "04", "05", "06", "07",
    "08", "09", "10", "11", "12", "13", "14", "15", "16", "17",
    "18", "19", "20", "21", "22", "23"];

    this.minutes = ["00", "03", "06", "09", "12", "15", "18", "21",
    "24", "27", "30", "33", "36", "39", "42", "45", "48", "51",
    "54", "57"];

    this.minutesPhoto = ["00", "19", "20", "39", "40", "59"];
  }

  doSomethingWhenTab(tab) {
    //Action for change
    switch (parseInt(tab.index)){
      case 5: {
      };
      case 6:{
        this.graph();
      }
    }
    
    if(this.subTimeout){
      this.subTimeout.unsubscribe();
      this.subTimeout = null;
    }
  }

  async getDataStuck(){
    this.dataPointsStuck = [];
    let data = [];
    let promises = [];
    let i = 0;
    var fec = this.fechaInicial;
    let fechaInicial = this.getDateFind(fec);
    var today = new Date();
    var todayString = this.getDateFind(today);
    var hours = this.hours.slice(0);
    var isToday = false;
    var timeHour = today.getHours();
    if (todayString === fechaInicial) {
      hours = hours.splice(0, timeHour + 1);
      isToday = true;
    }

    let grouped = [];

    var initDate = fechaInicial + ' 00:00:00';
    var endDate = '';
    if (isToday) {
      var hourEnd = timeHour;
      var hourEndString = hourEnd + ':59:59';
      if (hourEnd < 0)
        hourEndString = '0' + hourEnd + ':59:59';
      endDate = fechaInicial + ' ' + hourEndString;
    } else
      endDate = fechaInicial + ' 23:59:59';

    let selectedCity = this.selectedCity;
    var rowExcel = [];
    await this._rS.getOrdersStuck(initDate, endDate).toPromise()
    .then(async (resp:any) => {

      
      if (resp.data.length > 0) {
        var data = resp.data;
        var hash = Object.create(null);
        let this2 = this;
       
        rowExcel['BOG']=[];
        rowExcel['BAR']=[];
        rowExcel['CTG']=[];
        rowExcel['SMR']=[];
        rowExcel['VUP']=[];
        rowExcel['VVC']=[];
        rowExcel['CHI']=[];
        rowExcel['SOA']=[];
        rowExcel['SOL']=[];
        data.forEach(function (a) {
          var date = new Date(a.createDate);
          var hour = date.getHours();
          var min = date.getMinutes();
          var dateNow = new Date();
          var hourNow = dateNow.getHours();
          var keyMin = min < 10 ? "0" + min  : min + ""
          let x = JSON.parse(a.JSON);
          var key = "";
          if(hour!=hourNow){
            key = hour < 10 ? "0" + hour + ":00" : hour + ":00"
          }else{
            key = hour < 10 ? "0" + hour + ":" + keyMin : hour + ":" + keyMin
          }

          if(!Array.isArray(rowExcel[x.cityId])){
            rowExcel[x.cityId]=[];
          }
          
          if(hour!=hourNow){
            if(typeof rowExcel[x.cityId][hour] != 'object'){
              rowExcel[x.cityId][hour]={key:key, ordersNoAssigned: 0, ordersAssigned: 0, name: x.name, sum: 0 }
            }

            rowExcel[x.cityId][hour].ordersNoAssigned += parseFloat(x.ordersNoAssigned);
            rowExcel[x.cityId][hour].ordersAssigned += parseFloat(x.ordersAssigned) + parseFloat(x.ordersNoAssigned);
            rowExcel[x.cityId][hour].sum += 1;
          }else{
            if(typeof rowExcel[x.cityId][hour] != 'object'){
              rowExcel[x.cityId][hour]={key:key, ordersNoAssigned: 0, ordersAssigned: 0, name: x.name }
              
            }
            rowExcel[x.cityId][hour].key = key;
            rowExcel[x.cityId][hour].ordersNoAssigned = parseFloat(x.ordersNoAssigned);
            rowExcel[x.cityId][hour].ordersAssigned = parseFloat(x.ordersAssigned) + parseFloat(x.ordersNoAssigned);
            rowExcel[x.cityId][hour].sum = 1;
          }
            //({ key: hour, average: 0, percentage: 0, name: x.name }) ;
            //rowExcel.push({key: x.cityId, average: 0, percentage: 0, name: x.name });
            /*let index = rowExcel.indexOf(obj);
            rowExcel[index].average += parseFloat(x.average);
            rowExcel[index].percentage += rowExcel[index].average/100;*/
 
        });

        //this.arrayHistoricos = Object.keys(rowExcel)
        this.dataHistoricos = Object.values(rowExcel)


        data.forEach(function (a) {
          var date = new Date(a.createDate);
          var hour = date.getHours();
          var minutes = date.getMinutes();
          var minutesPosition = this2.getMinutePosition(minutes);
          let x = JSON.parse(a.JSON);
          if (minutes > 57 && hour < 23)
            hour = hour + 1;
          else if (minutes > 57 && hour == 23)
            minutesPosition = "57"
          var key = hour + ":" + minutesPosition;
          if (hour < 10)
            key = "0" + hour + ":" + minutesPosition;
          if (selectedCity != "") {
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
    })

    //se procesa la información
    hours.forEach(hour => {
      this.totalStuckLastHour = 0;
      this.minutes.forEach(minutes => {
      var totalAverage = 0;
      var totalCount = 0;
      var key = hour + ":" + minutes;
      if (grouped[key] != null) {
        totalAverage = grouped[key].average;
        totalCount = grouped[key].count;
      }

      var average = 0
      //if (totalCount > 0)
      average = totalAverage;// / totalCount;

      this.totalAverageStuck = this.totalAverageStuck + average;
      this.countStuck = this.countStuck + totalCount;

      this.dataPointsStuck.push({y: average, label: key});

      this.totalStuckLastHour = this.totalStuckLastHour + average;
      });
    });

    //if (this.countStuck > 0)
    this.totalStuck = this.totalAverageStuck; /// this.countStuck;
  }

  async getDataStuckStore(){
    this.dataPointsStuck = [];
    let data = [];
    let promises = [];
    let i = 0;
    var fec = this.fechaInicial;
    let fechaInicial = this.getDateFind(fec);
    //let fechaFinal = this.getDateFind(fec);
    var today = new Date();
    var todayString = this.getDateFind(today);
    var hours = this.hours.slice(0);
    var isToday = false;
    var timeHour = today.getHours();
    if (todayString === fechaInicial) {
      hours = hours.splice(0, timeHour + 1);
      isToday = true;
    }

    let grouped = [];

    var initDate = fechaInicial + ' 00:00:00';
    var endDate = '';
    if (isToday) {
      var hourEnd = timeHour;
      var hourEndString = hourEnd + ':59:59';
      if (hourEnd < 0)
        hourEndString = '0' + hourEnd + ':59:59';
      endDate = fechaInicial + ' ' + hourEndString;
    } else
      endDate = fechaInicial + ' 23:59:59';

    let selectedStore = this.selectedStore;

    await this._rS.getOrdersStuckByCity(initDate, endDate).toPromise()
    .then(async (resp:any) => {
      if (resp.data.length > 0) {
        var data = resp.data;
        var hash = Object.create(null);
        let this2 = this;
        data.forEach(function (a) {
          var date = new Date(a.createDate);
          var hour = date.getHours();
          var minutes = date.getMinutes();
          var minutesPosition = this2.getMinutePosition(minutes);
          let x = JSON.parse(a.JSON);
          if (minutes > 57 && hour < 23)
            hour = hour + 1;
          else if (minutes > 57 && hour == 23)
            minutesPosition = "57"
          var key = hour + ":" + minutesPosition;
          if (hour < 10)
            key = "0" + hour + ":" + minutesPosition;
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


    //se procesa la información
    hours.forEach(hour => {
      this.totalStuckLastHour = 0;
      this.minutes.forEach(minutes => {
        var totalAverage = 0;
        var totalCount = 0;
        var key = hour + ":" + minutes;
        if (grouped[key] != null) {
          totalAverage = grouped[key].average;
          totalCount = grouped[key].count;
        }

        var average = 0
        //if (totalCount > 0)
        average = totalAverage; /// totalCount;

        this.totalAverageStuck = this.totalAverageStuck + average;
        this.countStuck = this.countStuck + totalCount;

        this.dataPointsStuck.push({y: average, label: key});

        this.totalStuckLastHour = this.totalStuckLastHour + average;
      });
    });

    //if (this.countStuck > 0)
    this.totalStuck = this.totalAverageStuck; /// this.countStuck;
  }

  
  async graph(){
    this.totalStuck = 0;
    this.totalAverageStuck = 0;
    this.countStuck = 0;
    this.titleGraph = "Encolados General";

    this.loading_search = true;
    if (this.selectedStore == "") {
      await this.getDataStuck();

      if (this.selectedCity != "") {
        var cityName = this.getCityName(this.selectedCity);
        cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
        this.titleGraph = "Encolados Ciudad " + cityName;
      }
    }

    this.loading_search = false;

    this.areaData = {
      labels: this.hours.map(hr => hr+=':00'),
      series: [this.dataPointsStuck],
    }

    if (this.getDateFind(this.fechaInicial) === this.getDateFind(new Date())) {
      if(!this.subTimeout)
        this.job();
    } else {
      if(this.subTimeout){
        this.subTimeout.unsubscribe();
        this.subTimeout = null;
      }
    }
  }

  async generarReporte(){

    this._rS.weeklyGlued(
      moment(this.fechaInicial).format('YYYY/MM/DD 00:00:00'),
      moment(this.fechaFinal).format('YYYY/MM/DD 23:59:59'))
      .subscribe(
      (rta:any) => { 

        if(rta.data.message){
          const data = JSON.parse(rta.data.message)

          const options = {
              fileName: "Reporte generado"
          };
          const tableData = data.tableData

        //   var tableData = [
        //     {
        //         "sheetName": "Sheet1",
        //         "data": [[{"text":"Name"},{"text":"Position"},{"text":"Office"},{"text":"Age"},{"text":"Start date"},{"text":"Salary"}],[{"text":"Tiger Nixon"},{"text":"System Architect"},{"text":"Edinburgh"},{"text":61},{"text":"2011/04/25"},{"text":"$320,800"}],[{"text":"Garrett Winters"},{"text":"Accountant"},{"text":"Tokyo"},{"text":63},{"text":"2011/07/25"},{"text":"$170,750"}],[{"text":"Ashton Cox"},{"text":"Junior Technical Author"},{"text":"San Francisco"},{"text":66},{"text":"2009/01/12"},{"text":"$86,000"}],[{"text":"Cedric Kelly"},{"text":"Senior Javascript Developer"},{"text":"Edinburgh"},{"text":22},{"text":"2012/03/29"},{"text":"$433,060"}],[{"text":"Airi Satou"},{"text":"Accountant"},{"text":"Tokyo"},{"text":33},{"text":"2008/11/28"},{"text":"$162,700"}],[{"text":"Brielle Williamson"},{"text":"Integration Specialist"},{"text":"New York"},{"text":61},{"text":"2012/12/02"},{"text":"$372,000"}],[{"text":"Herrod Chandler"},{"text":"Sales Assistant"},{"text":"San Francisco"},{"text":59},{"text":"2012/08/06"},{"text":"$137,500"}],[{"text":"Rhona Davidson"},{"text":"Integration Specialist"},{"text":"Tokyo"},{"text":55},{"text":"2010/10/14"},{"text":"$327,900"}]]
        //     }
        // ];
        let dataExport = []
        tableData[0].data.forEach(row => {

        
          let rows = []
          row.forEach(col => {
            if(col.text || col.text == ''){
              rows.push(col.text)              
            }
            
          });
          dataExport.push(rows)
          
        });

        /* generate worksheet */
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dataExport);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

        /* save to file */
        XLSX.writeFile(wb, 'Reporte.xlsx');
          
        }

        
      },
      error => {
        
      });
  }
  
  checkAuth(){
      
  }

  selectData(event) {
    this.toast.info('Data Selected', this.data.datasets[event.element._datasetIndex].data[event.element._index]);
  }

  getStoresByCity(){
    if (this.selectedCity != null && this.selectedCity != "") {
      this._dS.stores.forEach(x => {
        if (x.city.trim() == this.selectedCity)
          this.stores.push({label: x.name.toLowerCase().substr(0, 30), value: x.id});
      });
    }
  }

  getStoreName(id){
    let storeName = "";
    this._dS.stores.forEach((x:any) => {
      if (x.value == id)
        storeName = x.label;
    });
    return storeName;
  }

  getCityName(id){
    let cityName = "";
    this._dS.cities.forEach(x => {
      if (x.value == id)
        cityName = x.label;
    });
    return cityName;
  }

  getDateFind(fecha) {
      if(fecha === ""){
        var d = new Date(),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('/');
      }else{
        var d = new Date(fecha),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('/');
      }
  }

  cleanFilters() {
    this.selectedCity = "";
    this.selectedStore = "";
    this.fechaInicial = new Date();
    this.stores = [];
    //this.graph();
  }

  job() {
    this.subTimeout = timer(600000).subscribe(() => { 
      if(localStorage.dataCount){
        this.graph();
        this.job();
      }
    });
  }

  ngOnDestroy(){
    if(this.subTimeout){
      this.subTimeout.unsubscribe();
      this.subTimeout = null;
    }
  }

  getMinutePosition(minute){
    let min = "";
    var keepGoing = true;
    this.minutes.forEach(x =>{
      if(keepGoing) {
        if (parseInt(minute) > 57) {
          min = "00";
          keepGoing = false;
        }
        if (parseInt(minute) <= parseInt(x)){
          min = x;
          keepGoing = false;
        }
      }
    });
    return min;
  }


}

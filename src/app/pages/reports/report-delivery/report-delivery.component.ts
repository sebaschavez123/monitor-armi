import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';
import { NzI18nService, es_ES } from 'ng-zorro-antd/i18n';
import { DashboardService } from '../../../services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../../services/order.service';
import * as moment from 'moment-mini-ts';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-report-delivery',
  templateUrl: './report-delivery.component.html',
  styleUrls: ['./report-delivery.component.scss']
})
export class ReportDeliveryComponent implements OnInit {


  dateRange:Array<Date>;
  dataExport:any;
  dataSearch:any;
  cols:Array<any> = [];
  report:Array<any> = [];
  valuesTable:any = {loading : undefined, total: undefined, paginate: 50, pageIndex: 1};
  filterOrderStatus = ['ENTREGADA', 'FINALIZADA']; 
  private dataId = [];
  filters: any;

  constructor(private _rS:ReportsService,
              private _dS:DashboardService,
              private toastr:ToastrService,
              private _oS:OrderService,
              private i18n: NzI18nService) { }

  ngOnInit(): void {
    this.i18n.setLocale(es_ES);
    this.initConfOptions();
    this.cols = this._rS.getColsDelivery();
  }

  changeRange(){
    this.updateFilterInfo();
  }

  extractValue(data) {
    return !!data 
      ? (typeof data === 'number' && isFinite(data))
        ? Number(data)
        : data
      : data == 0 ? 0 : '';
  }

  async search(valuesTable?:boolean){
    let toast = this.toastr.info("Cargando información...", null, {
      tapToDismiss: false,
      disableTimeOut: true
    });
    if(this.dataId.length == 0){
      let resId:any = await this._dS.searchIdOrders(
        moment(this.dateRange[0]).format('YYYY/MM/DD HH:mm'),
        moment(this.dateRange[1]).format('YYYY/MM/DD HH:mm'),
        !!this.filters ? this.filters : []
      ).toPromise();
      this.dataId = resId.data;
      this.valuesTable.total = this.dataId.length
    }
    this.valuesTable.loading = true;
    let orders = [];
    if(valuesTable) orders = this._dS.getJsonOrderIds((this.valuesTable.pageIndex - 1) * this.valuesTable.paginate, this.dataId, this.valuesTable.paginate);
    else orders = this._dS.getJsonOrderIds(0, this.dataId, this.valuesTable.paginate);
    this._rS.getReportManagament(orders).subscribe(
      (rta:any) => {
        this.valuesTable.loading = false;
        this.report = this.manageData(rta.data);
        toast.toastRef.manualClose();
      },
      error => {
        toast.toastRef.manualClose();
        this.toastr.error("No se pudo sincronizar dashboard", null)
      });
    };

    private manageData(report){
      return report.map(x => {
        return this.transformData(x);
      });
    }

    private transformData(x){
      var statusDetail = x.statusDetail.slice(0);
        var created = x.date;
        var received;
        var emitted;
        var sent;
        var assigned;
        var picking;
        var billed;
        var delivered;
        var finished;

        x.receivedTime;
        x.emittedTime;
        x.sentTime;
        x.assignedTime;
        x.pickingTime;
        x.billedTime;
        x.deliveredTime;
        x.finishedTime;
        x.totalTime = 0;

        statusDetail = this.checkDuplicateInObject("orderStatusId", statusDetail);
        statusDetail = this.orderSortByStatus(statusDetail);

        if(statusDetail){

          statusDetail.forEach( y => {

            if(y.orderStatusName === "RECIBIDA"){
              if (y.orderStatusDate)
                received = y.orderStatusDate;
              else
                received = created;
              if (received && created) {
                x.receivedTime = this.getDateMinutes(created, received);
                x.receivedTimeFormat = this.minsToHHMMSS(x.receivedTime);
                x.totalTime = parseFloat(x.totalTime) + parseFloat(x.receivedTime);
              }
            }

            if(y.orderStatusName === "EMITIDA" && received){
              if (y.orderStatusDate)
                emitted = y.orderStatusDate;
              else
                emitted = received;
              x.emittedTime = this.getDateMinutes(received, emitted);
              x.emittedTimeFormat = this.minsToHHMMSS(x.emittedTime);
              x.totalTime = parseFloat(x.totalTime) + parseFloat(x.emittedTime);
            }

            if(y.orderStatusName === "ENVIADA" && emitted){
              if (y.orderStatusDate)
                sent = y.orderStatusDate;
              else
                sent = emitted;
              x.sentTime = this.getDateMinutes(emitted, sent);
              x.sentTimeFormat = this.minsToHHMMSS(x.sentTime);
              x.totalTime = parseFloat(x.totalTime) + parseFloat(x.sentTime);
            }

            if(y.orderStatusName === "ASIGNADA" && (sent || received)){
              if (y.orderStatusDate)
                assigned = y.orderStatusDate;
              else
                assigned = sent ?? received;
              x.assignedTime = this.getDateMinutes(sent, assigned);
              x.assignedTimeFormat = this.minsToHHMMSS(x.assignedTime);
              x.totalTime = parseFloat(x.totalTime) + parseFloat(x.assignedTime);
            }

            if(y.orderStatusName === "PICKING" && assigned){
              if (y.orderStatusDate)
                picking = y.orderStatusDate;
              else
                picking = assigned;
              x.pickingTime = this.getDateMinutes(assigned, picking);
              x.pickingTimeFormat = this.minsToHHMMSS(x.pickingTime);
              x.totalTime = parseFloat(x.totalTime) + parseFloat(x.pickingTime);
            }

            if(y.orderStatusName === "FACTURADA" && picking){
              if (y.orderStatusDate)
                billed = y.orderStatusDate;
              else
                billed = picking;
              x.billedTime = this.getDateMinutes(picking, billed);
              x.billedTimeFormat = this.minsToHHMMSS(x.billedTime);
              x.totalTime = parseFloat(x.totalTime) + parseFloat(x.billedTime);
            }

            if(y.orderStatusName === "ENTREGADA" && billed){
              if (y.orderStatusDate)
                delivered = y.orderStatusDate;
              else
                delivered = billed;
              x.deliveredTime = this.getDateMinutes(billed, delivered);
              x.deliveredTimeFormat = this.minsToHHMMSS(x.deliveredTime);
              x.totalTime = parseFloat(x.totalTime) + parseFloat(x.deliveredTime);
            }

            if(y.orderStatusName === "FINALIZADA" && delivered){
              if (y.orderStatusDate)
                finished = y.orderStatusDate;
              else
                finished = delivered;
              x.finishedTime = this.getDateMinutes(delivered, finished);
              x.finishedTimeFormat = this.minsToHHMMSS(x.finishedTime);
              x.totalTime = parseFloat(x.totalTime) + parseFloat(x.finishedTime);
            }
          });
          x.totalTimeFormat = this.minsToHHMMSS(x.totalTime);
        }

        x.dateStatusFormat = "";

        if(x.statusDate != null && x.statusDate != "" && x.statusDate) {
          var dateStatusSplit = x.statusDate.split("~~");
          var number = 0;
          if (dateStatusSplit.length > 0) {
            for(var i = 0; i < dateStatusSplit.length; i++) {
              number = i + 1;
              var stringDateStatus = dateStatusSplit[i].replace("COT", "");
              var dateStatus = new Date(stringDateStatus);
              x.dateStatusFormat = x.dateStatusFormat + number + ". " + this.js_yyyy_mm_dd_hh_mm_ss(dateStatus) + " ";
            }
          }
        }

        x.observationsFormat = "";

        if(x.observations != null && x.observations != "") {
          var observationsSplit = x.observations.split("~~");
          var number = 0;
          if (observationsSplit.length > 0) {
            for(var i = 0; i < observationsSplit.length; i++) {
              number = i + 1;
              x.observationsFormat = x.observationsFormat + number + ". " + observationsSplit[i] + " ";
            }
          }
        }

        x.hoursObservationsFormat = "";

        if(x.hoursObservations != null && x.hoursObservations != "" && x.hoursObservations) {
          var hoursObservationsSplit = x.hoursObservations.split("~~");
          var number = 0;
          if (hoursObservationsSplit.length > 0) {
            for(var i = 0; i < hoursObservationsSplit.length; i++) {
              number = i + 1;
              var stringObservation = hoursObservationsSplit[i].replace("COT", "");
              var dateObservation = new Date(stringObservation);
              x.hoursObservationsFormat = x.hoursObservationsFormat + number + ". " + this.js_yyyy_mm_dd_hh_mm_ss(dateObservation) + " ";
            }
          }
        }

        x.transactionStatusPayU = "";
        x.transactionValuePayU = "";

        if (x.valueMapPayU != null) {
          x.transactionStatusPayU = x.valueMapPayU.transactionStatusPayU;
          x.transactionValuePayU = x.valueMapPayU.transactionValuePayU ;
        }

        x.evidencesFormat = "";

        if(x.evidences != null && x.evidences != "") {
          var evidencesSplit = x.evidences.split("~~");
          var number = 0;
          if (evidencesSplit.length > 0) {
            for(var i = 0; i < evidencesSplit.length; i++) {
              number = i + 1;
              x.evidencesFormat = x.evidencesFormat + number + ". " + evidencesSplit[i] + " ";
            }
          }
        }

        x.valueMapphoneNumber = "";
        //Número de datafono
        /*this._dS.getPOSNumberOrder(x.orderId).subscribe(
        (rta:any) => {
          if (rta != null && rta.message != null && rta.message != "") {
            x.valueMapphoneNumber = rta.message;
          }
        },
        error => {});*/

        x.reassigned = "NO";
        //Número de datafono
        this._oS.isReassigned(x.orderId).subscribe(
        (rta:any) => {
          if (rta.code == "OK" && rta.data != null && rta.data.message != null && rta.data.message != "") {
            if(rta.data.message.trim() == 'TRUE')
              x.reassigned = 'SI';
            else
              x.reassigned = 'NO';
          }

          /*if (rta != null && rta.message != null && rta.message != "") {
            if(rta.message.trim() == 'TRUE')
              return 'SI';
            else
              return 'NO';
          }*/
        },
        error => {});

        //Numero de guia
        x.numberGuide = "";
        x.dateCreateGuide = "";
        if(x.orderGuide != null && x.orderGuide != "") {
          var orderGuideSplit = x.orderGuide.split("~~");
          if (orderGuideSplit.length > 0) {
            if (orderGuideSplit.length > 0) {
              if (orderGuideSplit[0] != 'null')
                x.numberGuide = orderGuideSplit[0];
              if (orderGuideSplit[1] != 'null')
                x.dateCreateGuide = orderGuideSplit[1];
            }
          }
        }

        x.acronymCourier = "";
        if (x.courierName != null) {
          if (x.courierName === "RUNER") {
            x.acronymCourier = "RN";
          } else if (x.courierName === "MENSAJEROS URBANOS") {
            x.acronymCourier = "MU";
          } else if (x.courierName === "ALIANZA LOGISTICA") {
            x.acronymCourier = "AL";
          } else {
            x.acronymCourier = x.courierName;
          }
        }
        return x;
    }

    private checkDuplicateInObject(propertyName, inputArray) {
      var seenDuplicate = false,
          testObject = [];

      inputArray.map(function(item) {
        var itemPropertyName = item[propertyName];
        if (itemPropertyName in testObject) {
          testObject[itemPropertyName].duplicate = true;
          item.duplicate = true;
          seenDuplicate = true;
        }
        else {
          testObject[itemPropertyName] = item;
          delete item.duplicate;
        }
      });

      return testObject;
    }

    private getDateMinutes(fech1, fech2){
      var startTime = new Date(fech1);
      var endTime = new Date(fech2);
      var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
      var resultInMinutes = parseFloat((difference / 60000).toString()).toFixed(3);
      return resultInMinutes;
    }


  private orderSortByStatus(items) {
    var sorting = [ 'RECIBIDA', 'EMITIDA', 'ENVIADA', 'ASIGNADA', 'PICKING', 'FACTURADA', 'ENTREGADA', 'FINALIZADA', 'PICKING TERMINADO', 'EN CAMINO', 'EN PUNTO DE ENTREGA'];
    var result = [];

    sorting.forEach(key => {
        var found = false;
        items = items.filter(item => {
            if(!found && item.orderStatusName.trim() == key) {
                result.push(item);
                found = true;
                return false;
            } else
                return true;
        })
    });

    return result;
  }

  private minsToHHMMSS(minsNumber) {
    var negative = "";
    if (minsNumber < 0) {
      minsNumber = minsNumber * -1;
      var negative = "-";
    }

    var hours   = Math.floor(minsNumber / 60);
    var minutes = Math.floor((minsNumber - ((hours * 3600)) / 60));
    var seconds = Math.floor((minsNumber * 60) - (hours * 3600) - (minutes * 60));

    // Appends 0 when unit is less than 10
    var hoursString = "";
    var minutesString = "";
    var secondsString = "";
    if (hours   < 10)
      hoursString = "0" + hours.toString();
    else hoursString = hours.toString();
    if (minutes < 10)
      minutesString = "0" + minutes.toString();
    else
      minutesString = minutes.toString();
    if (seconds < 10)
      secondsString = "0" + seconds.toString();
    else
      secondsString = seconds.toString();

      let res = negative+hoursString+':'+minutesString+':'+secondsString;

    return res == 'NaN:NaN:NaN'  ? '' : res;
  }

  private paginate($event){
    if($event.type == 'page'){
      this.valuesTable.pageIndex = $event.data.pageIndex;
      this.valuesTable.paginate = $event.data.pageSize;
      this.valuesTable.filter = $event.data.filter;
    }
    this.search(true)
  }

  private js_yyyy_mm_dd_hh_mm_ss (date) {
    var year = "" + date.getFullYear();
    var month = "" + (date.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    var day = "" + date.getDate(); if (day.length == 1) { day = "0" + day; }
    var hour = "" + date.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    var minute = "" + date.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    var second = "" + date.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    if(this.valuesTable.total != null) this.paginate({type: 'page', data: {pageIndex, pageSize, sortField, sortOrder, filter}})
  }

  private initConfOptions(){
    this.dataExport = {
        object: {
          'Número de Pedido': {fun: (x)=>{return x.orderId}},
          'Cliente': {fun: (x)=>{return x.customerName}},
          'Documento': {fun: (x)=>{return x.documentNumber}},
          'Marc. Fraude': {fun: (x)=>{return x.isFraud}},
          'Usuario Monitor': {fun: (x)=>{return x.valueMap.userMonitor}},
          'Fecha de Creación': {fun: (x)=>{return x.valueMap.date}},
          'Estado': {fun: (x)=>{return x.valueMap.status}},
          'Tienda': {fun: (x)=>{return x.valueMap.storeName}},
          'Ciudad': {fun: (x)=>{return x.valueMap.cityName}},
          'Operador': {fun: (x)=>{return x.valueMap.acronymCourier}},
          'Reasignado': {fun: (x)=>{return x.valueMap.reassigned}},
          'Fechas de reasignación': {fun: (x)=>{return x.valueMap.dateStatusFormat}},
          'Tiempo Recibida (hh:mm:ss)': {fun: (x)=>{return x.valueMap.receivedTimeFormat}},
          'Tiempo Emitida (hh:mm:ss)': {fun: (x)=>{return x.valueMap.emittedTimeFormat}},
          'Tiempo Enviada (hh:mm:ss)': {fun: (x)=>{return x.valueMap.sentTimeFormat}},
          'Tiempo Asignada (hh:mm:ss)': {fun: (x)=>{return x.valueMap.assignedTimeFormat}},
          'Tiempo Picking (hh:mm:ss)': {fun: (x)=>{return x.valueMap.pickingTimeFormat}},
          'Tiempo Picking Terminado (hh:mm:ss)':{fun: (x)=>{return x.valueMap.finishedPickingTimeFormat}},
          'Tiempo Facturada (hh:mm:ss)': {fun: (x)=>{return x.valueMap.billedTimeFormat}},
          'Tiempo En Camino (hh:mm:ss)':{fun: (x)=>{return x.valueMap.itsWayTimeFormat}},
          'Tiempo Punto de entrega (hh:mm:ss)':{fun: (x)=>{return x.valueMap.pointDeliveryTimeFormat}},
          'Tiempo Entregada (hh:mm:ss)': {fun: (x)=>{return x.valueMap.deliveredTimeFormat}},
          'Tiempo Finalizada (hh:mm:ss)': {fun: (x)=>{return x.valueMap.finishedTimeFormat}},
          'Tiempo Total (hh:mm:ss)': {fun: (x)=>{return x.valueMap.totalTimeFormat}},
          'Km recorrido': {fun: (x)=>{return x.valueMap.kmOrder}},
          'Observación': {fun: (x)=>{return x.valueMap.observationsFormat.substring(0, 1024)}},
          'Fecha Observación': {fun: (x)=>{return x.valueMap.hoursObservationsFormat}},
          /*'Fecha Click Whatsapp Cliente': {fun: (x)=>{return x.valueMap.dateManagerWhatsapp}},
          'Número de Guía': {fun: (x)=>{return x.valueMap.numberGuide}},
          'Fecha registro de Guía': {fun: (x)=>{return x.valueMap.dateCreateGuide}},
          'Número de Datafono' : {fun: (x)=>{return x.valueMap.dataphoneNumber}},
          'PayU' : {fun: (x)=>{return x.valueMap.transactionStatusPayU}},
          'Valor PayU' : {fun: (x)=>{return x.valueMap.transactionValuePayU}},
          'Evidencias de Pago' : {fun: (x)=>{return x.valueMap.evidencesForma}}*/
          'Relanzadas' :{fun: (x)=> {return x.valueMap.relaunchedIds }},
          'Cant. Relanzamientos' :{fun: (x)=> {return x.valueMap.countRelaunchedIds }},
          'Lat. Cliente' :{fun: (x)=> {return x.valueMap.LatitudeCustomer }},
          'Log. Cliente' :{fun: (x)=> {return x.valueMap.LongitudeCustomer }},
          'Transferencia' :{fun: (x)=> {return x.valueMap.transfer }},
          'Programada' :{fun: (x)=> {return x.valueMap.programmed }},
          'Mensajero' :{fun: (x)=> {return x.valueMap.messengerName }},
          'tel. Mensajero' :{fun: (x)=> {return x.valueMap.messengerPhone }},
          'Nota credito' :{fun: (x)=> {return x.valueMap.hasCreditNote }},
          'Especial' :{fun: (x)=> {return x.isSpecial || '' }},
          
        },
        modifications: [
          {
            field: 'valueMap',
            func: (x) => {
              return this.transformData(x);
            }
          }
        ],
        nameReport: 'Reporte_Domicilio'
    }
    this.dataSearch = {
      url: this._rS.urls.reportManagament,
      req: {'employeeNumber': this._dS.getLocalUser().employeeNumber },
      url_list: this._dS.urls.searchOrdersId,
      req_list: {},
    }
    this.updateFilterInfo();
    
  }
  
  updateFilterInfo() {
    if(this.dateRange?.length > 0){
      let tmp: any = {
        url: this._rS.urls.reportManagament,
        req: {'employeeNumber': this._dS.getLocalUser().employeeNumber },
        url_list: this._dS.urls.searchOrdersId,
        req_list: {'employeeNumber': this._rS.getLocalUser().employeeNumber,
        startDate: moment(this.dateRange[0]).format('YYYY/MM/DD HH:mm'),
        endDate:moment(this.dateRange[1]).format('YYYY/MM/DD HH:mm')},
      }
      if(this.filters?.length>0){
        tmp.req_list.filters = {
          orderStatus: this.filters.map( o => { return {"orderStatus": o} })
        }
      } else {
        tmp.req_list.filters = null;
      }
      this.dataSearch = {...tmp};
    }
  }
}

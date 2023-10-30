import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService extends BaseService {

  urls = {
    countOrder : `${this.gateway}/orderMonitorEndpoint/getCountResumenOrders20`,
    reportManagament : `${this.gateway30Reports}/getReportManagamentMonitor20`,
    deliveryTimeAverage : `${this.gateway30Reports}/getOrdersDeliveryTimeAverage`,
    stuckAverageByCity : `${this.gateway30Reports}/getOrdersStuckAverageByCity`,
    stuckAverage : `${this.gateway30Reports}/getOrdersStuckAverage`,
    timeAverageByCity : `${this.gateway30Reports}/getOrdersDeliveryTimeAverageByCity`,
    ordersStuck : `${this.gateway30Reports}/getOrdersStuck`,
    ordersStuckCity : `${this.gateway30Reports}/getOrdersStuckByCity`,
    weeklyGlued : `${this.gateway30Reports}/weeklyGlued`,
    domiciliosCom : `${this.gateway30Reports}/getOrdersDomiciliosComReport`,
    declinedPayUReport : `${this.gateway30Reports}/getOrdersDeclinedPayUReport`,
    evidencesOrder : `${this.gateway}/orderMonitorEndpoint/getEvidencesOrder20`,
    ordersNoExpressReport: `${this.gateway30Reports}/getOrdersNoExpressReport`,
    ordersCanceled: `${this.gateway30Reports}/getOrdersCancelledReport`,
    dataUserBlocked: `${this.gateway30Reports}/getCustomersBlockedScanAndGo`,
    messengers: `${this.gateway30}/getReportCourierProviderByMessenger`,
    ordersCorrupted: `${this.gateway30Reports}/searchIdOrdersCorrupted`,
    sms: `${this.gateway30Reports}/getSMSDataReport`,
    updateReportsAmplitude : `${this.gateway30}/updateProperty`,
    reportsAmplitude : `${this.gateway30}/getDeliveryProperty/AMPLITUDE_REPORTS_MONITOR`,
    reportObservations: `${this.gateway30Reports}/getReportObservations20`,
    reportCanceledWithoutStock: `${this.gateway30Reports}/getReportOrderCancel/withoutStock`,
    reportIncentives: `${this.gateway30Reports}/getReportIncentiveModuleLog`,
    reportAware: `${this.gateway30Reports}/getReportCallAware`,
    reportReturnSuccess: `${this.gateway30Reports}/getReport/successfulReturn`,
    reportRefund:`${this.gateway30Reports}//getReportRefund`,
    messengerRating: {
      serviceLevelQuantity: `${this.gateway30Reports}/service-level-quantity-report`,
    }
  }

  colorsChart = ['#1b55e3', '#46be8a', '#ff0', '#f2a654']

  constructor(public http:HttpClient) {
    super(http);
  }

  getCountResumenOrders(){
    return this.get(this.urls.countOrder);
  }

  getReportManagament(orders){
    return this.post(this.urls.reportManagament, { employeeNumber: this.getLocalUser().employeeNumber, orders});
  }

  getOrdersDeliveryTimeAverage(startDate, endDate){
    return this.post(this.urls.deliveryTimeAverage, {startDate,endDate});
  }

  getOrdersStuckAverageByCity(startDate, endDate){
    return this.post(this.urls.stuckAverageByCity, {startDate,endDate});
  }

  getOrdersStuckAverage(startDate, endDate){
    return this.post(this.urls.stuckAverage, {startDate,endDate});
  }

  getOrdersDeliveryTimeAverageByCity(startDate, endDate) {
    return this.post(this.urls.timeAverageByCity, {startDate,endDate});
  }

  getOrdersStuck(startDate, endDate) {
    return this.post(this.urls.ordersStuck, {startDate,endDate});
  }

  getIncentives(startDate,endDate){
    return this.post(this.urls.reportIncentives,{startDate,endDate});
  }

  getOrdersStuckByCity(startDate, endDate) {
    return this.post(this.urls.ordersStuckCity, {startDate,endDate});
  }

  getReportObservations(startDate, endDate) {
    const params = `?startDate=${startDate}&finalDate=${endDate}`;
    return this.get(this.urls.reportObservations+params);
  }

  weeklyGlued(startDate, endDate){
    return this.post(this.urls.weeklyGlued, {startDate,endDate});
  }

  getOrdersDeclinedPayUReport(startDate, endDate, stores){
    return this.post(this.urls.declinedPayUReport, {startDate,endDate,stores });
  }

  getEvidencesCahsDetail(orderId, courierId){
    const data = {employeeNumber: this.getLocalUser().employeeNumber, orderId, courierId}
    return this.post(this.urls.evidencesOrder, data);
  }

  getReportSms(){
    return this.get(this.urls.sms);
  }

  getReportsAmplitude(){
    return this.get(this.urls.reportsAmplitude);
  }

  async saveReportAmplitude(report:any) {
    let res:any = await firstValueFrom(this.getReportsAmplitude());
    let data = JSON.parse(res.data.message);
    data.push(report);
    return firstValueFrom(
      this.post(this.urls.updateReportsAmplitude, {key: 'AMPLITUDE_REPORTS_MONITOR', value: JSON.stringify(data)})
    );
  }

  async deleteReportAmplitude(report:any) {
    let res:any = await firstValueFrom(this.getReportsAmplitude());
    let data = JSON.parse(res.data.message);
    data.splice(data.findIndex(r => r.url == report.url));
    return firstValueFrom(
      this.post(this.urls.updateReportsAmplitude, {key: 'AMPLITUDE_REPORTS_MONITOR', value: JSON.stringify(data)})
    );
  }

  getServiceLevelQuantity() {
    return firstValueFrom(
      this.get(this.urls.messengerRating.serviceLevelQuantity)
    );
  }


  getColsDelivery(){
    return [
      { name: 'orderId', label: 'Número de Pedido' },
      { name: 'customerName', label: 'Cliente' },
      { name: 'documentNumber', label: 'Documento' },
      { name: 'isFraud', label: 'Marc. Fraude' },
      { name: 'userMonitor', label: 'Usuario Monitor' },
      { name: 'date', label: 'Fecha de Creación' },
      { name: 'orderType', label: 'Tipo Orden' },
      { name: 'acronymCourier', label: 'Operador' },
      { name: 'reassigned', label: 'Resignado' },
      { name: 'dateStatusFormat', label: 'Fechas de reasignación' },
      { name: 'receivedTimeFormat', label: 'Tiempo Recibida (hh:mm:ss)' },
      { name: 'emittedTimeFormat', label: 'Tiempo Emitida (hh:mm:ss)' },
      { name: 'sentTimeFormat', label: 'Tiempo Enviada (hh:mm:ss)' },
      { name: 'assignedTimeFormat', label: 'Tiempo Asignada (hh:mm:ss)' },
      { name: 'pickingTimeFormat', label: 'Tiempo Picking (hh:mm:ss)' },
      { name: 'billedTimeFormat', label: 'Tiempo Facturada (hh:mm:ss)' },
      { name: 'deliveredTimeFormat', label: 'Tiempo Entregada (hh:mm:ss)' },
      { name: 'finishedTimeFormat', label: 'Tiempo Finalizada (hh:mm:ss)' },
      { name: 'totalTimeFormat', label: 'Tiempo Total (hh:mm:ss)' },
      { name: 'observationsFormat', label: 'Observación' },
      { name: 'hoursObservationsFormat', label: 'Fecha Observación' },
      /*{ name: 'dateManagerWhatsapp', label: 'Fecha Click Whatsapp Cliente' },
      { name: 'numberGuide', label: 'Número de Guía' },
      { name: 'dateCreateGuide', label: 'Fecha registro de Guía' },
      { name: 'dataphoneNumber', label: 'Número de Datafono' },
      { name: 'transactionStatusPayU', label: 'PayU' },
      { name: 'transactionValuePayU', label: 'Valor PayU' },
      { name: 'evidencesFormat', label: 'Evidencias de Pago' }*/
      { name: 'relaunchedIds', label: 'Relanzadas'},
      { name: 'countRelaunchedIds', label: 'Cant. Relanzamientos'},
			{ name: 'LatitudeCustomer', label: 'Lat. Cliente'},
			{ name: 'LongitudeCustomer', label: 'Log. Cliente'},
			{ name: 'transfer', label: 'Transferencia'},
			{ name: 'programmed', label: 'Programada'},
			{ name: 'messengerName', label: 'Mensajero'},
			{ name: 'messengerPhone', label: 'tel. Mensajero'},
      { name: 'hasCreditNote', label: 'Nota credito'},
      { name: 'isSpecial', label: 'Especial' }
    ]
  }


}

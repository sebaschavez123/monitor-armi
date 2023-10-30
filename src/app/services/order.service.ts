import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { countryConfig } from 'src/country-config/country-config';
import { environment } from 'src/environments/environment';
import { firstValueFrom, map, of, pipe, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseService {

  urls = {
    validateDelicery: `${this.gateway}/orderMonitorEndpoint/validateDeliveryOrder`,
    getEmployeeCanceled: `${this.gateway30Dashboard}/getEmployeeCanceledOrder/:id`,
    getEmployeeFinished: `${this.gateway30Dashboard}/getEmployeeFinalizedOrder/:id`,
    payu: `${this.gateway30}/getOrderPayUResponse`,
    pse: `${this.gateway30}/getOrderPSEResponse`,
    getPOSNumber: `${this.gateway30Dashboard}/getPOSNumberOrder`,
    getCreditNoteTicket: `${this.gateway30Dashboard}/getOrderCreditNoteTicket/:id`,
    getActivedAssociation: `${this.gateway30Dashboard}/getOrderActivedAssociation`,
    getDetailTheoretical: `${this.gateway30Reports}/getOrderDetailTheoretical`,
    getDetail: `${this.gateway30Reports}/getOrderDetail20`,
    get: `${this.gateway30Dashboard}/getOrder/:id`,
    update: `${this.gateway}/orderMonitorEndpoint/updateOrder`,
    // TODO: PENDIENTE PARA VENEZUELA
    reassing: `${this.gateway30}/reasignOrder`,
    // TODO: PENDIENTE PARA COLOMBIA
    reassingMessenger: `${this.gateway30}/reasignOrderToMessenger`,
    reassingAssociation: `${this.gateway30}/getOrderReassignedRelation`,
    reassingManual: `${this.gateway}/orderMonitorEndpoint/reassignOrderManual`,
    repush: `${this.gateway}/orderMonitorEndpoint/repushOrder`,
    cancel: `${this.gateway30}/cancelOrder`,
    modifyStatus: `${this.gateway30}/modifyOrderStatus20`,
    status: `${this.gateway30Dashboard}/getOrderStatusDetail/:id`,
    cancelProvider: `${this.gateway30}/modifyOrderStatus20Provider`,
    manage: `${this.gateway30}/manageOrder20`,
    // TODO: PENDIENTE PARA COLOMBIA
    finish: `${this.gateway30}/finalizeOrder`,
    finalizedAssociation: `${this.gateway30}/getOrderFinalizedAssociation`,
    transfer: `${this.gateway30}/insertOrderTransfersRelation`,
    finalizationReasonList: `${this.gateway30}/getListOrderFinalizationReason`,
    transfersReasonList: `${this.gateway30}/getListOrderTransfersReason`,
    finishProvider: `${this.gateway30}/modifyOrderStatus20Provider`,
    finalizarOrderEmployee: `${this.gateway30}/addOrderCourierStatus`,
    active: `${this.gateway30}/activateOrderCanceled`,
    updatePickingDate: `${this.gateway30}/updateOrderPickingDate`,
    updateExpress: `${this.gateway30}/updateOrderExpressPickingDate`,
    reschedule: `${this.gateway30}/rescheduleOrder`,
    reservate: `${this.gateway30}/reservateOrder/:id`,
    getCanceledAssociation: `${this.gateway30Dashboard}/getOrderCanceledAssociation`,
    getListCancellationReason: `${this.gateway30}/getListOrderCancellationReason`,
    addOrderGuideProvider: `${this.gateway30}/addOrderGuideProvider`,
    addOrderGuide: `${this.gateway30}/addOrderGuide`,
    getPresciption: `${this.gateway30}/getOrderPresciptionRx/:id`,
    getDetailNoExpressIncompleted: `${this.gateway30Dashboard}/getOrderDetailNoExpressIncompleted`,
    insertItemOrderIncomplete: `${this.gateway30}/insertItemOrderIncomplete`,
    isOrderReassigned: `${this.gateway30}/isOrderReassigned20/:id`,
    evidences: `${this.gateway30}/getOrderEvidence/:id`,
    incentiveInfo: `${this.gateway30}/getOrderIncentiveValues/:id`,
    detailV2: `${this.gateway30Dashboard}/getOrderDetailsDashboard/:id`,
    launch: `${this.gateway30}/launchOrderExpress`,
    pagoMovil: `${this.gateway30Dashboard}/getDetailPagoMovil/:id`,
    providerAssociated: `${this.gateway30Dashboard}/getOrderIdAssociated/:id`,
    guide: `${this.gateway30Dashboard}/getOrderGuide/:id`,
    reassing_list: `${this.gateway30}/getOrderReasignedAssociation/:id`,
    paymentChange: `${this.gateway30}/getChangeMethod/:id`,
    paymentDetail: `${this.payments}/getOutstandingBalance/idOrder/:id`,
    toPaypagoMovil: `${this.payments}/verifyPayment`,
    updatePagoMovil: `${this.payments}/updatePagoMovil`,
    invoiceManually: `${this.gateway30}/updateInvoicedManualOrder`,
    tickets: `${this.zendesk}/getOrderTicketZendeskByOrder/:id`,
    saveOrderWithoutStock: `${this.gateway30}/saveOrderWithoutStock`,
    orderChangeMonitor:`${this.gateway30Reports}/orderChangeMonitor`,
    getOrderChangeMonitor:`${this.gateway30Reports}/getOrderChangeMonitor`,  
    saveRefaudMonitor : `${this.gateway30Dashboard}//saveRefaudMonitor`, 
    startPicking: 'https://oms-dot-stunning-base-164402.uc.r.appspot.com/oms/v1/order/status/update',
    getOrderUuid: `${this.gateway30Reports}/getCourierAuctioned/`,
    addCustomerWhiteList: `${this.gateway30Dashboard}/addCustomerWhiteList/:id`,
    reverseTransaction: `${this.gateway30}/reverseTransaction/:id`,
    getReverseOrderStatus: `${this.gateway30}/getReverseOrderStatus/:id`,
    recalculate: `${this.gateway30Reports}/recalculate/payPerRoute/:id`,
    typification :`${this.gateway30}/getAwareTypicationValues` ,
    sendForm : `${this.gateway30}/saveAwareManagement` ,
    getParamsArea: `${this.gateway30}/managementArea` ,
    sendCall: `${this.gateway30}/aware/sendCall` ,
    getRefundPaymentMobileStatus: `${this.gateway30}/getRefundPaymentMobileStatus/:id`,  
    reassingAndRelaunch: `${this.gateway30}/launchAndReasingOrderExpress`,  
  }

  constructor(http:HttpClient) {
    super(http)
  }

  validateDelivery(idCustomer:number, idOrder:number, orderItems, storeId:number){
    const data ={
      id: idCustomer,
      idOrder,
      idStoreGroup: storeId,
      source: 'WEB',
      deliveryType: 'EXPRESS',
      orderItems
    }
    return this.post(this.urls.validateDelicery, data);
  }

  startPicking(data: any) {
    const params = {
      ...data, messenger: "Picker Rapicargo",
      phone: "3000000000", url: "http://"
    }
    return this.post(this.urls.startPicking, params);
  }

  getEmployeeCanceled(orderId){
    return this.get(this.urls.getEmployeeCanceled.replace(':id', orderId));
  }

  getEmployeeFinished(orderId){
    return this.get(this.urls.getEmployeeFinished.replace(':id', orderId));
  }

  getPayUResponse(orderId){
    return this.post(this.urls.payu, {orderId});
  }

  getPseResponse(orderId){
    return this.post(this.urls.pse, {orderId});
  }

  getPOSNumber(orderId){
    return this.post(this.urls.getPOSNumber, {orderId});
  }

  getCreditNoteTicket(orderId){
    return this.get(this.urls.getCreditNoteTicket.replace(':id', orderId));
  }

  getActivedAssociation(orderId){
    return this.post(this.urls.getActivedAssociation, { orderId,employeeNumber: this.getLocalUser()?.employeeNumber});
  }

  getDetailTheoretical(orderId: string){
    return this.post(this.urls.getDetailTheoretical, {orderId});
  }

  getDetail(orderId: string){
    return this.post(this.urls.getDetail, {orderId});
  }

  addCustomerWhiteList(customerId) {
    return this.get(this.urls.addCustomerWhiteList.replace(':id',customerId));
  }

  getOrder(orderId){
    return this.get(this.urls.get.replace(':id', orderId) );
  }

  getReassingList(orderId){
    if(environment.isVenezuela) return this.post(this.urls.reassingAssociation, {orderId,employeeNumber: this.getLocalUser()?.employeeNumber});
    return this.get(this.urls.reassing_list.replace(':id', orderId));
  }

  getOrderDetail(orderId){
    return this.get(this.urls.detailV2.replace(':id', orderId));
  }

  getPagoMovilPaymentList(orderId){
    return this.get(this.urls.pagoMovil.replace(':id', orderId));
  }

  getReverseOrderStatus(orderId){
    return this.get(this.urls.getReverseOrderStatus.replace(':id', orderId))
      .pipe(map((r:any)=>r.data));
  }

  getPagoMovilDetail(orderId) {
    return this.get(this.urls.paymentDetail.replace(':id', orderId));
  }

  toPayPagoMovil(form) {
    return this.post(this.urls.toPaypagoMovil, form);
  }

  incentiveInfo(orderId: string) {
    return this.get(this.urls.incentiveInfo.replace(':id', orderId));
  }

  getZendeskTickets(orderId) {
    return this.get(this.urls.tickets.replace(':id', orderId));
  }

  getOrderStatusDetail(orderId){
    return this.get(this.urls.status.replace(':id', orderId));
  }

  update(order,orderItems, tipoDomicilio){
    return this.put(this.urls.update, {orderId: order.orderId,items: orderItems,domicilio: tipoDomicilio});
  }

  getEvidences(orderId) {
    return this.get(this.urls.evidences.replace(':id', orderId));
  }

  reassing(orderId, courierId) {
    return this.post(this.urls.reassing, {orderId, courierId, employeeNumber: this.getLocalUser()?.employeeNumber});
  }

  assingMessenger(orderId, messengerId) {
    return this.post(this.urls.reassingMessenger, {orderId, messengerId, employeeNumber: this.getLocalUser()?.employeeNumber});
  }

  reassingManual(orderId, courierId){
    return this.post(this.urls.reassingManual, {orderId, courierId, employeeNumber: this.getLocalUser()?.employeeNumber});
  }

  providerAssociated(orderId) {
    return this.get(this.urls.providerAssociated.replace(':id', orderId));
  }

  getGuide(orderId) {
    return this.get(this.urls.guide.replace(':id', orderId));
  }

  recalculate(orderId) {
    return this.get(this.urls.recalculate.replace(':id', orderId));
  }

  repushOrder(orderId){
    return this.post(this.urls.repush, { orderId,employeeNumber: this.getLocalUser()?.employeeNumber});
  }

  getRefundPaymentMobileStatus(id) {
    return this.get(this.urls.getRefundPaymentMobileStatus.replace(':id',id));
  }

  paymentChange(orderId){
    return this.get(this.urls.paymentChange.replace(':id', orderId));
  }

  updatePagoMovil(form){
    return this.put(this.urls.updatePagoMovil, form);
  }

  getOrderUuid (orderId: string) {
    return this.get(`${this.urls.getOrderUuid}${orderId}`)
      .pipe(map((d:any) => d?.data));
  }

  cancelProvider(order, observation, cancellationReasonId){
    const data = {
      orderId: order.orderId,
      observation,
      rol: this.getLocalUser()?.rolUser,
      correoUsuario: this.getLocalUser()?.email,
      employeeNumber:  this.getLocalUser()?.employeeNumber,
      cancellationReasonId,
    };
    return this.post(this.urls.cancelProvider, data);
  }

  isReassigned(order){
    return this.get(this.urls.isOrderReassigned.replace(':id', order));
  }

  cancelNoExpress(order, observation, cancellationReasonId){
    const data = {
      orderId: order.orderId,
      observation,
      rol: this.getLocalUser()?.rolUser,
      correoUsuario: this.getLocalUser()?.email,
      employeeNumber:  this.getLocalUser()?.employeeNumber,
      cancellationReasonId,
      statusId: 14,
    };
    return this.post(this.urls.modifyStatus, data);
  }

  cancel(order, observation, cancellationReasonId, evidences: string[] = null){
    const data:any = {
      orderId: order.orderId,
      observation: (observation != 'on') ? observation : '',
      sendMessage: (observation == 'on') ? 1 : 0,
      rol: this.getLocalUser()?.rolUser,
      correoUsuario: this.getLocalUser()?.email,
      employeeNumber:  this.getLocalUser()?.employeeNumber,
      cancellationReasonId,
    };
    if(countryConfig.isVenezuela) { data.evidenceCanceled = evidences; }
    return this.post(this.urls.cancel, data);
  }
  saveOrderWithoutStock(data) {
    return this.post(this.urls.saveOrderWithoutStock, data);
  }

  manage(order){
    const data = {
      orderId: order.orderId,
      observation:'',
      rol: this.getLocalUser()?.rolUser,
      correoUsuario: this.getLocalUser()?.email,
      employeeNumber:  this.getLocalUser()?.employeeNumber,
    };
    return this.post(this.urls.manage, data);
  }

  finalize(orderId, observation, cancellationReasonId?, evidence?) {
    const data: any = {
      orderId,
      observation,
      rol: this.getLocalUser()?.rolUser,
      correoUsuario: this.getLocalUser()?.email,
      employeeNumber:  this.getLocalUser()?.employeeNumber,
    };
    if(evidence) data.evidence = evidence;
    if(cancellationReasonId) data.cancellationReasonId = cancellationReasonId;
    return this.post(this.urls.finish, data);
  }

  tranfer(orderId, observation, cancellationReasonId){
    const data = {
      orderId,
      observation,
      rol: this.getLocalUser()?.rolUser,
      correoUsuario: this.getLocalUser()?.email,
      employeeNumber:  this.getLocalUser()?.employeeNumber,
      cancellationReasonId
    };
    return this.post(this.urls.transfer, data);
  }

  roundTrip(orderId: string) {
    const data = {
      orderId, orderChangeType: 1, value: 1,
      employeeNumber: this.getLocalUser()?.employeeNumber
    };
    return firstValueFrom(this.post(this.urls.orderChangeMonitor, data));
  }

  recordTransfer(orderId: string, transfers: number, mileage: number) {
    const employeeNumber= this.getLocalUser()?.employeeNumber;
    const transfersData = { orderId, employeeNumber, orderChangeType: 2, value: transfers};
    const mileageData   = { orderId, employeeNumber, orderChangeType: 4, value:mileage};
    return Promise.all([
      firstValueFrom(this.post(this.urls.orderChangeMonitor, transfersData)),
      firstValueFrom(this.post(this.urls.orderChangeMonitor, mileageData))
    ]);
  }

  changeMenthod(orderId: string, value: number) {
    const data = {
      orderId, orderChangeType: 3, value,
      employeeNumber: this.getLocalUser()?.employeeNumber
    };
    return firstValueFrom(this.post(this.urls.orderChangeMonitor, data));
  }

  changeDistance(orderId: string, value: number) {
    const data = {
      orderId, orderChangeType: 4, value,
      employeeNumber: this.getLocalUser()?.employeeNumber
    };
    return firstValueFrom(this.post(this.urls.orderChangeMonitor, data));
  }

  getOrderChangeMonitor(orderId: string) {
    return firstValueFrom(this.get(`${this.urls.getOrderChangeMonitor}/${orderId}`));
  }

  finalizeProvider(order, observation){
    const data = {
      orderId: order.orderId,
      observation,
      rol: this.getLocalUser()?.rolUser,
      correoUsuario: this.getLocalUser()?.email,
      employeeNumber:  this.getLocalUser()?.employeeNumber,
      statusId: 5,
    };
    return this.post(this.urls.finishProvider, data);
  }

  modifyStatus(order, status){
    const data = {
      orderId: order.orderId,
      observation:'',
      rol: this.getLocalUser()?.rolUser,
      correoUsuario: this.getLocalUser()?.email,
      employeeNumber:  this.getLocalUser()?.employeeNumber,
      statusId: status,
    };
    return this.post(this.urls.modifyStatus, data);
  }

  launch(orderId: number, incentive = null) {
    const data:any = {
      orderId,
      rol: this.getLocalUser()?.rolUser,
      correoUsuario: this.getLocalUser()?.email,
      employeeNumber:  this.getLocalUser()?.employeeNumber,
      employeeName:  this.getLocalUser()?.employeeName,
    }
    data.relaunchIncentive = {
      ...incentive,
      employeeNumber:  this.getLocalUser()?.employeeNumber,
    };
    const postfix = countryConfig.isColombia ? `V2` : '';
    return this.post(this.urls.launch+postfix, data);
  }

  invoiceManually(orderId:string, invoice: boolean) {
    const data:any = {
      orderId,
      invoice: invoice ? 'TRUE' : 'FALSE',
    }
    return this.post(this.urls.invoiceManually, data);
  }

  activateCanceled(orderId){ 
    return this.post(this.urls.active, {orderId,employeeNumber: this.getLocalUser()?.employeeNumber});
  }

  updatePickingDate(orderId, pickingDate){
    return this.post(this.urls.updatePickingDate, {orderId,pickingDate});
  }

  finalizarEmployee(orderId){
    return this.put(this.urls.finalizarOrderEmployee, {orderId,employeeNumber: this.getLocalUser()?.employeeNumber,statusId: 7});
  }

  updateExpress(orderId:string, pickingDate:string, reschedule: boolean = false) {
    const data:any = {
        orderId,
        rol: this.getLocalUser()?.rolUser,
        correoUsuario: this.getLocalUser()?.email,
        employeeNumber:  this.getLocalUser()?.employeeNumber,
        employeeName:  this.getLocalUser()?.employeeName,
        pickingDate,
      }
      // solo envia cuando no es reschedule.
      if(!reschedule) { data.createDate = pickingDate; }
    const url = countryConfig.isColombia ? this.urls.updateExpress : this.urls.reschedule;
    return this.post(url, data);
  }

  addOrderGuideProvider(orderId:string, orderGuide:string, courierId:string, phoneCustomer=null){
      const data = {
        orderId,
        orderGuide,
        courierId,
        employeeNumber: this.getLocalUser()?.employeeNumber,
        phoneCustomer,
        rol: this.getLocalUser()?.rolUser,
        correoUsuario: this.getLocalUser()?.email,
        observation: '',
        statusId: 4
      };
      return this.post(this.urls.addOrderGuideProvider, data);
    }

  reservationExpress(orderId:string){
    return this.post(this.urls.reservate.replace(':id', orderId), {});
  }

  getCanceledAssociation(orderId){
    return this.post(this.urls.getCanceledAssociation, {orderId,employeeNumber: this.getLocalUser()?.employeeNumber});
  }

  getFinalizedAssociation(orderId){
    return this.post(this.urls.finalizedAssociation, {orderId,employeeNumber: this.getLocalUser()?.employeeNumber});
  }

  getListCancellationReason(){
    return this.get(this.urls.getListCancellationReason);
  }

  getListFinalizationReason(){
    return this.get(this.urls.finalizationReasonList);
  }

  getListTranfersReason(){
    return this.get(this.urls.transfersReasonList);
  }

  getPresciption(orderId){
    return this.get(this.urls.getPresciption.replace(':id', orderId));
  }

  getDetailNoExpressIncompleted(orderId: number){
    return this.post(this.urls.getDetailNoExpressIncompleted, {orderId});
  }

  insertItemOrderIncomplete (orderId,items){
    return this.post(this.urls.insertItemOrderIncomplete, {orderId,items});
  }


  sendValidationFromRefoundOrder( observation, orderId, employeeNumber ){
    return this.post(this.urls.saveRefaudMonitor, { observation, orderId, employeeNumber });
  }

  reverseTransaction(orderId) {
    return firstValueFrom(
      this.get(this.urls.reverseTransaction.replace(':id', orderId))
    );
  }

  getTypicationCallAwaure(id){
    return this.get(`${this.urls.typification}/${id}`);
  }

  sendFormAwaure(data){
    return this.post(this.urls.sendForm, data);
  }

  getParamasAreaAwaure(){
    return this.get(this.urls.getParamsArea);
  }

  sendCallUser(port, id, idOrder){
    return this.get(`${this.urls.sendCall}/${port}/${id}/${idOrder}`);
  }

  reassingAndRelaunch(orderId, courierId ) {
    return this.post(this.urls.reassingAndRelaunch, {orderId, messengerId: courierId, employeeNumber: this.getLocalUser()?.employeeNumber});
  }

}

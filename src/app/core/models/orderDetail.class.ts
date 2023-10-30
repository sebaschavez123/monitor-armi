import { countryConfig } from "src/country-config/country-config";
import * as _ from 'underscore';
import { Address } from '../interfaces';


export interface Item {
    storeName:                string;
    id:                       number;
    itemName:                 string;
    price:                    number;
    units:                    number;
    unitsInitial?:            number;
    image:                    string;
    barcode:                  string;
    storeAddress:             string;
    color:                    string;
    departamentId:            number;
    departament:              string;
    storeId:                  number;
    mediaDescription:         string;
    grayDescription:          string;
    componentId?:             number;
    totalDiscount?:           number;
    sustitute?:               boolean;
    alone?:                   boolean;
    sending?:                 boolean;
    offerComponentDetail?:    OfferComponentDetail;
    firstDescription?:        string;
    mediaImageUrl?:           string;
    fullPrice?:               string;
    stock?:                   number;
}

export interface Store {
    id:                 number;
    name:               string;
    address:            string;
    latitude:           number;
    longitude:          number;
    ip:                 string;
    city:               string;
    status:             number;
    deliveryCourier:    number;
    deliveryItem:       number;
    scheduleMsn:        string;
    operationStartTime: string;
    operationEndTime:   string;
    deliveryType:       string;
    photo:              string;
    phone:              string;
    storeSystem:        string;
    orId:               number;
    storeType:          string;
    updateDate:         string;
}

export interface OfferComponentDetail {
    componentId:      number;
    minAmount:        number;
    discountAmount:   number;
    offerId:          number;
    offerDescription: string;
    beginDate:        string;
    endDate:          string;
}

export interface User {
    employeeNumber: string;
    password:       string;
    rolId:          number;
    rolName:        string;
    storeId:        number;
    storeName:      string;
    storeAddress:   string;
    employeeName:   string;
    email:          string;
    createDate:     string;
    updateDate:     string;
    sessionToken:   number;
    employeePhone:  string;
    status:         number;
    isPrime?:       boolean;
}

export interface OrderTicketStore {
    storeName:     string;
    ticket:        number;
}

export interface OrderPayment {
    BIN:                   string;
    bankName:              string;
    status:                string;
    transactionValuePayU:  string;
    transactionStatusPayU: string;
    reponseErrorMessage:   string;
    providerName:          string;
    creditCardOwner:       string;
}

export interface OrderObservation {
    observationId?: number;
    orderId?:       number;
    observation:   string;
    userName?:      string;
    creationDate:  string;
    rolName:       string;
    employeeName:  string;
}

export interface TicketZendesk {
    orderId:    number;
    ticketId:   number;
    json:       any;
    statusId:   number;
    tmp:        string;
    userId:     number;
    createDate: Date;
}

export interface StatusDetail {
    orderStatusId:   number;
    orderStatusName: string;
    orderStatusDate: Date;
}

export interface CouponDetail {
    componentId:    number;
    minAmount:      number;
    discountAmount: number;
    offerId:        number;
    coupon:         string;
    beginDate:      string;
    endDate:        string;
}

export interface PagoMovil {
  reference:      number;
  amount:         number;
  name:           string;
  documentNumber: string;
  phone:          string;
}

export interface Reassignments {
    employeeNumber: string;
    createDate:     Date;
    user:           User;
    orderId:        number;
    courier:        string;
    date?:          Date;
    userName?:      string;
}

export class OrderDetail {

    private paymentChangesLog:        String[];
    orderId:                          string;
    uuid:                             string;
    storeName:                        string;
    storeAddress:                     string;
    customerDocument:                 string;
    customerName:                     string;
    customerPhone:                    string;
    customerAddress:                  string;
    customerAddressDelivery:          Address;
    customerEmail:                    string;
    customerId:                       number;
    date:                             Date;
    emitido:                          number;
    enviado:                          number;
    asignado:                         number;
    picking:                          number;
    facturado:                        number;
    totalMins:                        number;
    totalTime:                        number;
    idTracking:                       string;
    status:                           string;
    red:                              string;
    courierName:                      string;
    messenger:                        string;
    messengerPhone:                   string;
    messengerPhoto:                   string;
    messengerId:                      string;
    messengerEmail:                   string;
    messengerProvider:                string;
    messengerVehicleType:             string;
    messengerEvidences:               any;
    city:                             string;
    paymentMethod:                    string;
    createDate:                       Date;
    multiStore:                       number;
    delayed:                          number;
    observations:                     string;
    storeId:                          string;
    orderDelayed:                     string;
    store:                            Store;
    isOrderReasigned:                 string;
    isOrderRelaunched:                string;
    isOrderActivated:                 string;
    isHighPriceOrder:                 string;
    hasPrescription:                  string;
    hasCoupons:                       string;
    ticketZendesk:                    TicketZendesk[];
    hasTicketZendesk:                 string;
    productsTheoretical:              Item[];
    products:                         Item[]; 
    productsMissing:                  Item[];
    closerStoreName:                  string;
    orderObservations:                OrderObservation[];
    orderPayment:                     OrderPayment;
    POSNumber:                        string;
    distanceKM:                       string;
    employeeCanceledOrder:            string;
    employeeFinishedOrder:            string;
    statusDetail:                     StatusDetail[];
    stateDate:                        any[];
    stateDateMinutes:                 any[];
    stateDateMinutesReset:            string;
    time:                             any;
    token:                            string;
    pickingDate?:                     string;
    pickingHour?:                     string;
    creditNoteTicket?:                string;
    creditNoteTotal?:                 string;
    stateCustomer:                    boolean;
    ivaOrder:                         string;
    totalDomicilio:                   string;
    subTotalPrice:                    string;
    totalPrice:                       string;
    discount:                         string;
    couponDetail:                     CouponDetail;
    fraudDescription:                 string;
    numberReassignments:              number;
    deliveryType:                     string;
    billingNumber:                    string;
    idCanceled:                       string;
    userCanceled:                     User;
    idActivated:                      string;
    userActivated:                    User;
    userFinalize:                    User;
    pagoMovilDetail:                  PagoMovil[];
    associatedIdExpress:              string;
    associatedIdProvider:             string;
    source:                           string;
    entryDate:                        string;
    billedOrders:                     number;
    urlArmIrene:                      string;
    isOrderFlash:                     string;
    isPrime:                          string;
    orderExceedPrice:                 string;
    currentStatusTime:                Date;
    reassignments:                    Reassignments[] = [];
    channelName?:                     string;
    billingChannel?:                  string;
    orderStatusId:                    number;
    evidenceCanceled?:                string[];
    nameUpdateAddress?:               string;
    couponDiscount?:                  string;
    offerDiscount?:                   string;
    primeDiscount?:                   string;
    countRelaunched?:                 number;
    talonCouponDiscount?:             string;
    talonOfferDiscount?:             string;
    negativeRating?:                  string; 
    firstbuy?:                        string;


    constructor(product: any){
      Object.assign(this, product);
      this.observations = this.observations ? this.observations.replace(',', '') : '';
      if(this.pickingDate && this.pickingHour) this.pickingDate = this.formattedDate(this.pickingDate)+' '+this.pickingHour;
      this.time = {text: '', value: null};
    }

    set productsReal(products: any) {
      if(!this.products || _.difference(this.products.map(ot => {return ot.id}), products.map(ot => {return ot.id})).length > 0) {
        products.forEach(x => {x.unitsInitial = x.units;x.sustitute = false;});
        this.products = products;
      }
    }

    get isDataphone(): boolean {
      return this.POSNumber && this.POSNumber != 'Sin información';
    }

    get isCreditNote(): boolean {
      return this.creditNoteTicket && this.creditNoteTicket != '0';
    }

    get isAssociated(): boolean {
      return this.associatedIdExpress != null || this.associatedIdProvider != null;
    }

    get isTrackingUrl(): boolean {
      return this.idTracking != null && this.idTracking.indexOf('http') != -1;
    }

    get isTrxLinePayU(): boolean {
      return this.orderPayment != null && this.orderPayment.providerName == 'PAY_U';
    }

    get isPse(): boolean {
      return  this.paymentMethod == 'pse' && this.orderPayment != null;
    }

    get isTrxLineMercadoPago(): boolean {
      return this.orderPayment != null && this.orderPayment.providerName == 'MERCADO_PAGO';
    }

    get providerNameTrxLine(): string {
      if(!this.orderPayment) return null;
      if(this.isPse) return 'PSE';
      return this.orderPayment.providerName ? this.orderPayment.providerName.replace('_', ' ') : 'Transacción en línea';
    }

    get isReassingments(): boolean {
      return this.reassignments != null && this.reassignments.length > 0;
    }

    get inProgress(): boolean {
      return this.status !== 'EMITIDA' && this.status !== 'ENVIADA' &&
        this.status !== 'CANCELADA' && this.status !== 'FINALIZADA' && this.status !== 'ENTREGADA';
    }

    get prime(): boolean { return this.isPrime == 'TRUE'; }

    productHtml(product: Item): string {
        return '<div class=\'card\'>'+
        '<div class=\'card-body\'>'+
        '<div style=\'text-align: center;\'>'+
        '<img src=\''+product.mediaImageUrl+'\' alt=\'product image\' height=\'100px\' width=\'100px\'>'+
        '</div>'+
        '<div class=\'table-responsive\'>'+
        '<table class=\'table table-borderless\'>'+
          '<tr>'+
            '<td class=\'text-gray-6 pl-0 font-size-12\'><b>SKU/CUF/ID</b></td>'+
            '<td class=\'pr-0 text-right text-dark font-size-12\'>'+product.id+'</td>'+
          '</tr>'+
          '<tr>'+
            '<td class=\'text-gray-6 pl-0 font-size-12\'><b>Código de barras</b></td>'+
            '<td class=\'pr-0 text-right text-dark font-size-12\'>'+product.barcode+'</td>'+
          '</tr>'+
          '<tr>'+
            '<td class=\'text-gray-6 pl-0 font-size-12\'><b>Descripción</b></td>'+
            '<td class=\'pr-0 text-right text-dark font-size-12\'>'+product.firstDescription+'</td>'+
          '</tr>'+
          '<tr>'+
            '<td class=\'text-gray-6 pl-0 font-size-12\'><b>Precio unitario</b></td>'+
            '<td class=\'pr-0 text-right text-dark font-size-12\'>'+this.formatMoney(product.fullPrice, 0,  '.', ',')+'</td>'+
          '</tr>'+
        '</table>'+
        '</div>'+
        '</div>'+
      '</div>';
    }

    productsManage() {
      let productList: any[] = [];
      const idlist = _.uniq(this.productsTheoretical.map(p => p.id));
      idlist.forEach((id) => {
        productList = productList.concat(this.filterProducts(id));
        productList = productList.concat(this.productsNoDeliveried(id));
        productList = productList.concat(this.getTheoricalProducts(id));
      });
      productList = productList.concat(this.getProductsAlone());
      return [...productList];
    }

    private filterProducts(id){
      return this.products
        .filter((p:any) => p.id == id)
        .map(p => { return {...p, sending: true, nsending: false, alone: false} });
    }

    private getProductsAlone() {
      return this.products.filter((p:any) => {
        return this.getTheoricalProducts(p.id).length < 1;
      }).map((t:any) => ({...t, sending: true, nsending: false, alone: true}));
    }

    private getTheoricalProducts(id) {
      return this.productsTheoretical.filter((t:any) => t.id == id);
    }

    private productsNoDeliveried(id) {
      const theo = this.getTheoricalProducts(id);
      return theo.filter((t:any) => {
        return !(this.products.find((p:any) => (p.id == id && p.storeId == t.storeId)));
      }).map((t:any) => ({...t, sending: false, nsending: true, alone: false}));
    }

    set statusDet(status:StatusDetail[]) {
      this.statusDetail = status;
        const statusDetail = this.checkDuplicateInObject('orderStatusId', this.statusDetail);

        if(statusDetail){
          for(let i = statusDetail.length - 1; i >= 0; i--) {
            if (typeof statusDetail[i] !== 'undefined') {
              if(+statusDetail[i].orderStatusId === 0
                ||+statusDetail[i].orderStatusId === 7) {
                 statusDetail.splice(i, 1);
              }
            }
          }
          this.stateDate = [];
          this.time = {text: '', value: null};
          statusDetail.forEach( x => {
            x.active = x.orderStatusDate ? true:false;
            this.stateDate.push(x);
            this.time.text = x.orderStatusName === 'ENTREGADA' && x.orderStatusDate ? 'Tiempo total' : 'Tiempo transcurrido';
          });
        }
    
        this.stateDateMinutes = [];
    
        if (this.stateDate && this.stateDate.length > 0) {
          const currentMinutes = this.getDateMinutes(this.stateDate[this.stateDate.length - 1].orderStatusDate,new Date());
          const arrMinutes = [];
          let sumMinutes = 0;
          for(let i = 0; i < 5; i++) {
            if((this.stateDate[i] && this.stateDate[i].orderStatusDate)
            && (this.stateDate[i+1] && this.stateDate[i+1].orderStatusDate) ){
              const minutes = this.getDateMinutes(this.stateDate[i].orderStatusDate,this.stateDate[i+1].orderStatusDate);
              arrMinutes.push({m:minutes,state:true});
              sumMinutes += parseFloat(minutes);
            }else{
              arrMinutes.push({m:0,state:false});
            }
          }    
          if(statusDetail){
            let valueOrderStatusDate;
            statusDetail.forEach((states, i) =>{
              if(states?.orderStatusDate && states?.orderStatusId !== 54){
                valueOrderStatusDate = states?.orderStatusDate                
              }
              if(states?.orderStatusId === 54){
                const minutes = this.getDateMinutes(valueOrderStatusDate, states?.orderStatusDate); 
                this.stateDateMinutesReset = minutes;
              }
            })
          }
            
           
          // TODO: Verificar diferencias backend!
          /*if (countryConfig.isColombia) {
            this.time.value = (this.time.text === 'Tiempo total' ? (+currentMinutes + sumMinutes).toFixed(2) : sumMinutes.toFixed(2) )  ;
          } else {
          }*/
          this.time.value = this.totalTime || this.totalMins || '0';
          this.stateDateMinutes = arrMinutes;
        }

    }

    set paymentChanges(data: String[]) {
      this.paymentChangesLog = data.map(item => {
        const value = item.split('[').join('<b>');
        return value.split(']').join('</b>');
      });
    }

    get paymentChanges() {
      if(this.paymentChangesLog?.length == 0) return;
      return this.paymentChangesLog;
    }

    get productsId() : Number[] {
      return this.products.map<Number>(item => item.id);
    }

    set productsStock(list:any[]) {
      this.products = this.products.map(item => {
        const stock = list.find(x => x.id == item.id)?.stock || item.stock;
        return {...item, stock };
      });
      this.productsTheoretical = this.productsTheoretical.map(item => {
        const stock = list.find(x => x.id == item.id)?.stock || item.stock;
        return {...item, stock };
      });

    }

    /*
    oldOrderDate() {
      if(this.stateDate?.length > 0) {
        const creada = new Date(this.createDate);
        const enviada = new Date(this.stateDate[1]?.orderStatusDate);
        
        return ((enviada?.getTime() - creada?.getTime()) < 360000) ? null : enviada;
      }
      return null;
    }*/

    private checkDuplicateInObject(propertyName, inputArray) {
        let seenDuplicate = false;
        const testObject = [];
    
        inputArray.map((item) => {
            const itemPropertyName = item[propertyName];
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
    
    private formatMoney(numberx, places, thousand, decimal) {
        numberx = numberx || 0;
        places = !isNaN(places = Math.abs(places)) ? places : 2;
        const symbol = countryConfig.isColombia ? '$ ' : 'Bs. ';
        thousand = thousand || ',';
        decimal = decimal || '.';
        const negative = numberx < 0 ? '-' : '';
        const i = parseInt(numberx = Math.abs(+numberx || 0).toFixed(places), 10) + '';
        // tslint:disable-next-line: no-var-keyword
        var j =
        // tslint:disable-next-line: no-conditional-assignment
        (j = i.length) > 3 ? j % 3 : 0;
        return symbol + negative + (j ? i.substr(0, j) + thousand : '') +
         i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) +
         (places ? decimal + Math.abs(numberx - +i).toFixed(places).slice(2) : '');
    
    }

    private formattedDate(date: string) {
        const d = date.split('-');
        const formattedDate = `${d[1]}/${d[0]}/${d[2]}`
        return formattedDate;
    }

    private getDateMinutes(fech1, fech2){
        const startTime = new Date(fech1);
        const endTime = new Date(fech2);
        const difference = endTime.getTime() - startTime.getTime();
        const resultInMinutes = parseFloat((difference / 60000).toString()).toFixed(1);
        return resultInMinutes;
    }
}
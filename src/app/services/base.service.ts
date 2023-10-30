import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Storage } from '../core/storage';
import Swal from 'sweetalert2';
import { countryConfig } from 'src/country-config/country-config';
import { permissionsCol, permissionsVen } from '../core/permissions';
import { OrderDetail } from '../core/models/orderDetail.class';
import { Store, Courier, Provider, User, IncentivesKm } from '../core/interfaces';
import { EventEmitter, Injectable } from '@angular/core';
import * as _ from 'underscore';
import { of, delay, throwError, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseService {

  private hds: HttpHeaders;

  event = new EventEmitter();

  gateway: string = countryConfig.backend2;
  gateway30: string = countryConfig.backend3;
  gateway30Dashboard: string = countryConfig.dashboard;
  gateway30Reports: string = countryConfig.reports;
  gatewayFirebase: string = countryConfig.firebase;
  gateway30SAS: string = countryConfig.sas;
  gatewayAntifraud: string = countryConfig.antifraud;
  gatewaySB: string = countryConfig.sb;
  payments: string = countryConfig.payments;
  support: string = countryConfig.support;
  zendesk: string = countryConfig.zendesk;
  upload: string = countryConfig.uploadImages;
  searchCustomer: string = countryConfig.searchCustomer;
  nx1Retro: string = countryConfig.nx1Retro;
  publicKey = '558a3421de06298a87ea086bae6272b3';
  privateKey = 'bf814549a16be56b0dc66386b2038470e5984473';

  static _cities = [];
  static _stores: Array<Store> = [];
  static _couriers: Array<Courier> = [];
  static _providers: Array<Provider> = [];
  static _incentiveByKm: Array<IncentivesKm> = [];
  static _initList = false;

  paymentMethods: any[] = null;

  get cities() { return BaseService._cities; }
  get stores() { return BaseService._stores; }
  get couriers() { return BaseService._couriers; }
  get providers() { return BaseService._providers; }
  get incentiveByKm() { return BaseService._incentiveByKm; }

  constructor(protected http: HttpClient) { }


  protected httpOptions(): { headers: HttpHeaders } {
    const data = {
      'rol': this.getLocalUser()?.rolUser,
      'correoUsuario': this.getLocalUser()?.email,
      'employeeNumber': this.getLocalUser()?.employeeNumber,
      'Content-Type': 'application/json',
      ...countryConfig?.headersNgZorro,
    };
    if (this.orderActive != null) data['orderId'] = this.orderActive?.orderId?.toString();
    return { headers: new HttpHeaders(data) };
  }

  initList() {
    if (!BaseService._initList) {
      this.getCities();
      this.getStores();
      this.getCouriers();
      this.getProviders();
      this.getIncentiveKm();
      BaseService._initList = true;
      return true;
    } else {
      return false;
    }

  }

  protected getCities() {
    const cities = Storage.getAllSession('cities');
    if (cities) {
      if (BaseService._cities.length < 1) {
        BaseService._cities = cities;
        setTimeout(() =>
          this.event.emit({ type: 'init-cities', data: BaseService._cities }), 200
        );
      }
    } else {
      this.get(`${this.gateway30}/getCities`).subscribe({
        next: (res: any) => {
          BaseService._cities = res.data.filter(x => x.deliveryType === 'EXPRESS')
            .map(x => { return { label: x.name.toLowerCase(), value: x.city, ...x } });
          BaseService._cities = _.sortBy(BaseService._cities, (city) => { return city.label });
          Storage.setAllSession('cities', BaseService._cities);
          this.event.emit({ type: 'init-cities', data: BaseService._cities });
        },
        error: (err) => { setTimeout(this.getCities, 100); }
      });
    }
    return BaseService._cities;
  }

  protected async getIncentiveKm() {
    const km = Storage.getAllSession('incentiveByKm');
    console.log('entra a LA FUNCIÓN PPAL')
    if (km) {
      console.log('entra al primer if')
      if (BaseService._incentiveByKm.length < 1) {
        BaseService._incentiveByKm = km;
        setTimeout(() => this.emitIncentiveKmInitEvent(), 200);
      }
    } else {
      try {
        const res = await this.fetchMonitorIncentiveKmValues();
        BaseService._incentiveByKm = this.sortKmValues(res.data);
        Storage.setAllSession('incentiveByKm', BaseService._incentiveByKm);
        this.emitIncentiveKmInitEvent();
      } catch (err) {
        setTimeout(() => this.getStores(), 100);
      }
    }
  }

  private emitIncentiveKmInitEvent() {
    this.event.emit({ type: 'init-incentiveKm', data: BaseService._incentiveByKm });
  }

  private fetchMonitorIncentiveKmValues(): Promise<any> {
    return firstValueFrom(this.get(`${this.gateway30}/getMonitorIncentiveKmValues`));
  }

  private sortKmValues(kmData: any[]): any[] {
    return _.sortBy(kmData, (km) => km.name);
  }


  protected getStores() {
    const stores = Storage.getAllSession('stores');
    if (stores) {
      if (BaseService._stores.length < 1) {
        BaseService._stores = stores;
        setTimeout(() =>
          this.event.emit({ type: 'init-stores', data: BaseService._stores }), 200
        );
      }
    } else {
      this.get(`${this.gateway30}/getStores`).subscribe({
        next: (res: any) => {
          BaseService._stores = _.sortBy(res.data, (store) => { return store.name });
          Storage.setAllSession('stores', BaseService._stores);

          this.event.emit({ type: 'init-stores', data: BaseService._stores });
        },
        error: (err) => { setTimeout(this.getStores, 100); }
      });
    }
  }

  getStoreName(storeId: number) {
    const store: any = this.stores.filter((store: any) => Number(store.id) === storeId);
    return (!!store && !!store[0]) ? store[0].name : '';
  }

  protected getCouriers() {
    const couriers = Storage.getAllSession('couriers');
    if (couriers) {
      if (BaseService._couriers.length < 1) {
        let timer: any;
        BaseService._couriers = couriers;
        setTimeout(() =>
          this.event.emit({ type: 'init-couriers', data: BaseService._couriers }), 200
        );
      }
    } else {
      this.get(this.gateway30 + '/getCouriers').subscribe({
        next: (res: any) => {
          BaseService._couriers = res.data.filter(s => s.status === true);
          Storage.setAllSession('couriers', BaseService._couriers);
          this.event.emit({ type: 'init-couriers', data: BaseService._couriers });
        },
        error: (err) => { setTimeout(this.getCouriers, 100); }
      });
    }
  }

  getCourierName(id: number) {
    const courier: any = this.couriers.filter((cour: any) => Number(cour.id) === id);
    return (!!courier && !!courier[0]) ? courier[0].name : '';
  }

  protected getProviders() {
    const providers = Storage.getAllSession('providers2');
    if (providers) {
      BaseService._providers = providers;
      this.event.emit({ type: 'init-providers', data: BaseService._providers });
      return;
    }
    this.get(this.gateway30 + '/getMessengerProviders').subscribe((res: any) => {
      BaseService._providers = res.data.map(item => { return { label: item.providerName, value: item.messengerProviderId, email: item.providerEmail }; });
      this.event.emit({ type: 'init-providers', data: BaseService._providers });
      Storage.setAllSession('providers2', BaseService._providers);
    })
  }

  getProviderName(id: number) {
    const provider: any = BaseService._providers.filter((cour: any) => Number(cour.id) === id);
    return (!!provider && !!provider[0]) ? provider[0].name : '';
  }

  refreshProviders() {
    Storage.removeOneSession('providers2');
    this.getProviders();
  }

  get(url: string) {
    return this.http.get(url, this.httpOptions());
  }

  getWithJson(url: string, body: any) {
    body._method = 'get';
    return this.http.post(url, body, this.httpOptions());
  }

  // tslint:disable-next-line: ban-types
  getParams(url: string, param: Object) {
    let index = 0;
    Object.keys(param).forEach((b) => {
      index === 0 ? url += '?' : url += '&';
      url += b + '=' + param[b];
      index++;
    });
    return this.http.get(url, this.httpOptions());
  }

  post(url: string, body: any) {
    return this.http.post(url, body, this.httpOptions());
  }

  patch(url: string, body: any) {
    return this.http.patch(url, body, this.httpOptions());
  }

  put(url: string, body: any) {
    return this.http.put(url, body, this.httpOptions());
  }

  delete(url: string) {
    return this.http.delete(url, this.httpOptions());
  }

  uploadImage(file: File) {
    const url = `${this.uploadImage}/upload`;
    console.log('este es')

    return new Promise((resolve, reject) => {
      let formData = new FormData();
      let request = new XMLHttpRequest();

      formData.append('image', file.name);
      request.onreadystatechange = () => {
        if (request.readyState === 4) {
          if (request.status === 201 || request.status === 200) {
            resolve(JSON.parse(request.response));
          } else {
            reject(JSON.parse(request.response))
          }
        }
      };
      request.open('POST', url, true);
      request.setRequestHeader('Country', 'VEN');
      request.send(formData);

    });
  }

  formatMoney(value, decimals, thousandSimbol, decimalSimbol) {
    let numberx = value || 0;
    let thousand = thousandSimbol || ',';
    let decimal = decimalSimbol || '.';
    let symbol = 'Bs. ';
    let places = decimals || 2;
    if (countryConfig.isColombia) {
      places = !isNaN(places = Math.abs(decimals)) ? decimals : 2;
      symbol = '$ ';
    } else {
      places = decimals || 2
    }
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

  getFormatPrice(price: number): string {
    // return `${countryConfig.isColombia ? `${this.formatMoney(price, 0, '.', ',')}` : `Bs. ${price.toFixed(2)}`}`;
    return `$ ${price.toFixed(2)}`;
  }

  formattedDate(date: string) {
    const d = date.split('-');
    const formattedDate = `${d[1]}/${d[0]}/${d[2]}`
    return formattedDate;
  }

  // tslint:disable-next-line: ban-types
  basicLoadPromise(promise: Promise<any>, title: string, successMjs: string, errorMjs: string, aditional?: Function, nativeMessage: boolean = false) {
    Swal.fire({
      title,
      text: 'Estamos realizando su petición, por favor espere.',
      showCancelButton: false,
      showConfirmButton: false,
      onBeforeOpen: () => {
        Swal.showLoading();
        return promise.then((rta: any) => {
          Swal.hideLoading();
          Swal.close();
          if (successMjs) Swal.fire('', successMjs, 'success');
          if (aditional) aditional(true, rta);
        }, error => {
          Swal.close();
          if (!nativeMessage) Swal.fire('', errorMjs, 'error');
          else Swal.fire('', error.error.message, 'error');
          if (aditional) aditional(false, error);
        })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((res: any) => { });
  }

  get modules() {
    if (this.getLocalUser()) {
      const permissions = countryConfig.isColombia ? permissionsCol : permissionsVen;
      return permissions[this.getLocalUser().rolUser];
    } else return null;
  }

  getPermissions(moduleName?: string) {
    return !!this.modules
      ? this.modules[Object.keys(this.modules).filter(name => name.split('/')[0] === moduleName)[0]]
      : {};
  }

  getLocalUser(): User | any {
    return Storage.getAll('dataCount');
  }

  isArmiUser(): boolean {
    const user = Storage.getAll('dataCount');
    return user?.email.includes('@armirene.com');
  }

  callfake(value: any, time: number = 1800) {
    return of(value).pipe(delay(time));
  }

  callfakeError(time: number = 1800) {
    return throwError(() => { return { error: true } })
      .pipe(delay(time));
  }

  listPaymentMethods() {
    return (!this.paymentMethods)
      ? firstValueFrom(this.get(this.gateway30 + '/getPaymentMethods'))
      : Promise.resolve(this.paymentMethods);
  }

  set orderActive(order: OrderDetail | null) {
    if (order == null) Storage.remove('orderActive');
    else Storage.setAll('orderActive', order)
  }

  get orderActive(): OrderDetail | null {
    if (!Storage.check('orderActive')) return null;
    return Storage.getAll('orderActive');
  }

  get dbTrackingUrl(): string {
    const urls = {
      delivaryTrackingColombia: 'https://stunning-base-delivery-tracking.firebaseio.com',
      delivaryTrackingVenezuela: 'https://oracle-services-vzla-delivery-tracking.firebaseio.com'
    }
    return countryConfig.isColombia ? urls.delivaryTrackingColombia : urls.delivaryTrackingVenezuela;
  }

  get dbMessengerUrl(): string {
    return countryConfig.isColombia ? 'https://stunning-base-messengers.firebaseio.com/' : 'https://oracle-services-vzla-messengers.firebaseio.com/';
  }

  get dbMonitorUrl(): string {
    return countryConfig.isColombia ? 'https://stunning-base-monitor.firebaseio.com/' : 'https://oracle-services-vzla-monitor.firebaseio.com/';
  }

  copyTextToClipboard(text) {
    var txtArea = document.createElement("textarea");
    txtArea.id = 'txt';
    txtArea.style.position = 'fixed';
    txtArea.style.top = '0';
    txtArea.style.left = "0";
    txtArea.style.opacity = '0';
    txtArea.value = text;
    document.body.appendChild(txtArea);
    txtArea.select();

    try {
      if (document.execCommand('copy')) { return true; }
    } catch (err) {
      console.warn('Oops, unable to copy');
    }
    finally {
      document.body.removeChild(txtArea);
    }
    return false;
  }

}

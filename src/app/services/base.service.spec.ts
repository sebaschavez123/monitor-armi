import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { of } from 'rxjs';
import { BaseService } from './base.service';
import { Courier, Store } from '../core/interfaces';
import { Storage } from '../core/storage';

declare var _:any;

const responseMock = {data: [1,2,3,4,5]};
const citiesMock = [
    {"label":"anaco","value":"ANA","city":"ANA","name":"Anaco","deliveryType":"EXPRESS","municipalities":["anaco"]},
    {"label":"araure","value":"ARA","city":"ARA","name":"Araure","deliveryType":"EXPRESS","municipalities":["araure"]},
    {"label":"barcelona","value":"BRC","city":"BRC","name":"Barcelona","deliveryType":"EXPRESS","municipalities":["bolivar"]}
];
const storesMock: any[] = [
    {"id":311,"name":"ACERINA","address":"AV. 20 CON CALLE 8 MUNICIPIO CATEDRAL ","latitude":10.068994,"longitude":-69.298989,"municipality":"IRIBARREN","deliveryMethod":"DELIVERY","city":"BQTO","active":true,"deliveryCourier":2,"photoUrl":"http://images.farmatodo.com/bduc/img/ve/store/big/ve_store_311_big.png","phone":"0800-3276286","deliveryType":"EXPRESS","hasPicking":"\u0000","commercialName":"BARQUISIMETO - Av. 20 CON AV. MORAN","status":1,"scheduleMsn":"LUNES A DOMINGO DE 7:00AM A 10:00 PM"},
    {"id":698,"name":"ACERO","address":"CENTRO COMERCIAL ORINOKIA, PB H-136/137, AV LAS AMERICAS, SECTOR ALTA VISTA, PUERTO ORDAZ, MUNICIPIO AUTONOMO CARONI, ESTADO BOLIVAR.","latitude":8.292281,"longitude":-62.7430282,"municipality":"CARONI","deliveryMethod":"DELIVERY","city":"PTO","active":false,"deliveryCourier":2,"photoUrl":"http://images.farmatodo.com/bduc/img/ve/store/big/ve_store_702_big.png","phone":"0800-3276286","deliveryType":"EXPRESS","hasPicking":"\u0000","commercialName":"ORINOKIA PLAZA ACERO","status":1,"scheduleMsn":"LUNES A DOMINGO 7:00AM-10:00PM"},
    {"id":128,"name":"ACONCAGUA","address":"AV JOSE MARIA VARGAS CC SANTE FE NIVEL 2 LOCAL C201 URB SANTE FE NORTE","latitude":10.4664,"longitude":-66.8717,"municipality":"BARUTA","deliveryMethod":"DELIVERY","city":"CCS","active":true,"deliveryCourier":2,"photoUrl":"http://images.farmatodo.com/bduc/img/ve/store/big/ve_store_128_big.png","phone":"0800-3276286","deliveryType":"EXPRESS","hasPicking":"\u0000","commercialName":"C.C. SANTA FE","status":1,"scheduleMsn":"LUNES A SABADO 8:00AM-9:00PM DOMINGO 11:00AM-7:00PM"},
];
const couriersMock: Courier[] = [{"id":2,"name":"APOYO_FTD","status":true}];

const respCitiesMock = {data: citiesMock};
const respStoresMock = {data: storesMock};
const respCouriersMock = {data: couriersMock};

describe('BaseService', () => {
    let service: BaseService;
    let httpMock: HttpTestingController;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports:[HttpClientTestingModule],
        providers:[BaseService],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
      });
    });
  
    beforeEach(() => {
        service = TestBed.inject(BaseService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterAll(() =>{
        httpMock.verify();
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('initList Method', () => {
        BaseService._cities = citiesMock;
        BaseService._stores = storesMock;
        BaseService._couriers = couriersMock;
        const spyCities = spyOn((service as any), 'getCities').and.callThrough();
        const spyStores = spyOn((service as any), 'getStores');
        const spyCouriers = spyOn((service as any), 'getCouriers');
        service.initList();
        expect(spyCities).toHaveBeenCalled();
        expect(spyStores).toHaveBeenCalled();
        expect(spyCouriers).toHaveBeenCalled();
    });

    it('getCities Protected Method', fakeAsync (() => {
        const sessionCities = Storage.getAllSession('cities');
        const spyCities = spyOn(service, 'get').and.callFake(x=>of(respCitiesMock));
        const cities = (service as any).getCities();
        tick(1500);
        if(!!cities) expect(cities).toEqual(BaseService._cities);
        if(!sessionCities) expect(spyCities).toHaveBeenCalled();
    }));

    it('getStores Protected Method', fakeAsync (() => {
        const sessionStores = Storage.getAllSession('stores');
        const spyStores = spyOn(service, 'get').and.callFake(x => of(respStoresMock));
        const stores = (service as any).getStores();
        tick(2000);
        const sortlist = _.sortBy(respStoresMock.data,(store) =>{ return store.name });
        expect(BaseService._stores).toEqual(sortlist);
        if(!sessionStores) expect(spyStores).toHaveBeenCalled();
    }));

    it('getCouriers Protected Method', fakeAsync (() => {
        const sessionCouriers = Storage.getAllSession('couriers');
        const spyCouriers = spyOn(service, 'get').and.callFake(x => of(respCouriersMock));
        const couriers = (service as any).getCouriers();
        tick(2000);
        if(!!couriers) expect(couriers).toEqual(BaseService._couriers);
        if(!sessionCouriers) expect(spyCouriers).toHaveBeenCalled();
    }));
/*
it('Couriers property', () => {
    BaseService._cities = ['city_1','city_2','city_3'];
    const cities = service.cities;
    expect(cities).toEqual(BaseService._cities);
});*/

    it('Method GET', () => {
        const url = 'test/get';
        service.get(url).subscribe((resp) => {
            expect(resp).toEqual(responseMock);
        });
        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe('GET');
        req.flush(responseMock);
    });

    it('Method POST', () => {
        const url = 'test/post';
        service.post(url, {test:true}).subscribe((resp) => {
            expect(resp).toEqual(responseMock);
        });
        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe('POST');
        req.flush(responseMock);
    });
    it('Method PATCH', () => {
        const url = 'test/patch';
        service.patch(url, {test:true}).subscribe((resp) => {
            expect(resp).toEqual(responseMock);
        });
        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe('PATCH');
        req.flush(responseMock);
    });
    it('Method PUT', () => {
        const url = 'test/put';
        service.put(url, {test:true}).subscribe((resp) => {
            expect(resp).toEqual(responseMock);
        });
        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe('PUT');
        req.flush(responseMock);
    });
    it('Method DELETE', () => {
        const url = 'test/post';
        service.delete(url).subscribe((resp) => {
            expect(resp).toEqual(responseMock);
        });
        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe('DELETE');
        req.flush(responseMock);
    });

});
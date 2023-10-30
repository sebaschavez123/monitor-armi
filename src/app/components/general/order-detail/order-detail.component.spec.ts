import { HttpClientTestingModule } from '@angular/common/http/testing';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { OrderDetailComponent } from './order-detail.component';
import { provideMockStore } from '@ngrx/store/testing';

import { SharedModule } from 'src/app/shared.module';
import { DashboardService } from 'src/app/services/dashboard.service';
import { UserService } from 'src/app/services/user.service';
import { of } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { ToastrModule } from 'ngx-toastr/toastr/toastr.module';

const userMock = { rolUser: 'ADMINISTRADOR' };

const permissions = {
    edit: true,
    observations: true,
    reassign: true,
    assign: true,
    cancel: true,
    token: true,
    repush: true,
    relaunch: true,
    manager: true,
    reschedule: true,
    zendesk: true,
    blockUser: true,
    finalize: true,
    activeOrder: true,
    customer_phone: true,
    picking: true,
}

const OrderMock = {
    id: 123,
    orderId: 123,
    status: 'FINALIZADA',
};
const DashboardServiceMock = {
    getLocalUser: () => {},
    getPermissions: () => permissions,
    offEventsFirebase: () => {},
    formatMoney: () => {},
    getOrderCoordinates: () => {},
    getTracking: () => { 
        return { off:() => {} }
    },
    getOrderObservations: ()=>{},
    getBillingNumber: ()=>{},
    getCloserStoreNameCustomerByOrderId: ()=>{},
};
const OrderServiceMock = {
    getOrderStatusDetail: ()=>{},
    getOrder: ()=>{},
    getDetail: ()=>{},
    getZendeskTickets: ()=>{},
    getActivedAssociation: ()=>{},
    getCreditNoteTicket: ()=>{},
    getReassingList: ()=>{},
    incentiveInfo: ()=>of([]),
    getDetailTheoretical: ()=> of(TheoricalMock),
};
const UserServiceMock = {
    verify: () => {},
}

const orderDetailMock = {
    "code": "OK",
    "message": "Success",
    "data": {
        "token": 113,
        "couponDetail": {id:112},
        "orderDetail": [
            {
                "storeName": "PERLA",
                "id": 111455891,
                "itemName": "Aciclovir 5% (50mg) x 20 g Crema Polinac   ",
                "price": 39,
                "units": 1,
                "image": "https://lh3.googleusercontent.com/Q9iAyvwt5Y0fCtNQVsO6MKdb1NjCPLHCT0xcg39F_NUwKSWcczF1S9Z0-B6bTxtBR9brhgf9OE1vd9IjqtLks9jXBF-6omh4DRd-LB9y8lSrBko",
                "barcode": "7592348201117",
                "storeAddress": "AV INTERCOMUNAL DE SAN DIEGO SECTOR LOS JARALES (ARTERIA 1) MUNICIPIO SAN DIEGO",
                "color": "white",
                "departamentId": 1,
                "departament": "Salud y Medicamentos",
                "storeId": 279,
                "mediaDescription": "Aciclovir 5% (50mg) x 20 g Crema Polinac",
                "grayDescription": "  ",
                "store": {
                    "idOR": 2279,
                    "name": "PERLA",
                    "address": "AV INTERCOMUNAL DE SAN DIEGO SECTOR LOS JARALES (ARTERIA 1) MUNICIPIO SAN DIEGO",
                    "latitude": 10.214674,
                    "longitude": -67.964669,
                    "municipality": "SAN DIEGO",
                    "deliveryMethod": "DELIVERY",
                    "cityId": "VAL",
                    "active": true,
                    "photoUrl": "http://images.farmatodo.com/bduc/img/ve/store/big/ve_store_279_big.png",
                    "phone": "0800-3276286",
                    "scheduleMessage": "ABIERTA 24 HORAS",
                    "deliveryType": "EXPRESS",
                    "hasPicking": "N",
                    "emailPicker": "Perla.279@farmatodo.com",
                    "commercialName": "AV. INTERCOMUNAL SAN DIEGO",
                    "storeSystem": "XSTORE",
                    "updateDate": "Sep 29, 2022, 4:00:23 PM"
                }
            }
        ],
        "address": {
            "idAddress": 768721,
            "customerAddressId": 768721,
            "idCustomer": 53034,
            "customerId": 53034,
            "countryId": "VE",
            "city": "VAL",
            "cityId": "VAL",
            "closerStoreId": 288,
            "deliveryType": "EXPRESS",
            "nickname": "ga",
            "address": "Parque Comercial Industrial Castillito, Parroquia San Diego, Municipio San Diego, Carabobo, 2006, Venezuela",
            "comments": "g8 / centro empresarial dan can ",
            "geoAddress": "Parque Comercial Industrial Castillito, Parroquia San Diego, Municipio San Diego, Carabobo, 2006, Venezuela",
            "longitude": -67.9519,
            "latitude": 10.1904,
            "active": true,
            "creationDate": "Sep 20, 2022, 9:50:19 AM",
            "municipality": "San Diego"
        },
        "invoice": "FALSE"
    }
}

const TheoricalMock = {
    "code": "OK",
    "message": "Success",
    "data": {
        "token": 113,
        "orderDetail": [
            {
                "storeName": "GUATAPARO",
                "id": 111455891,
                "itemName": "Aciclovir 5% (50mg) x 20 g Crema Polinac   ",
                "price": 39,
                "units": 1,
                "image": "https://lh3.googleusercontent.com/Q9iAyvwt5Y0fCtNQVsO6MKdb1NjCPLHCT0xcg39F_NUwKSWcczF1S9Z0-B6bTxtBR9brhgf9OE1vd9IjqtLks9jXBF-6omh4DRd-LB9y8lSrBko",
                "barcode": "7592348201117",
                "storeAddress": "AV CUATRICENTENARIO SECTOR VM6 URB LOS MANGOS PARROQUIA SAN JOSE",
                "color": "white",
                "departamentId": 1,
                "departament": "Salud y Medicamentos",
                "storeId": 288,
                "mediaDescription": "Aciclovir 5% (50mg) x 20 g Crema Polinac",
                "grayDescription": "  "
            }
        ]
    }
}

describe('Order Detail Component', () => {
    let component: OrderDetailComponent;
    let fixture: ComponentFixture<OrderDetailComponent>;
    let _ds: DashboardService;
    let _Os: OrderService;
    let _Us: UserService;
  
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OrderDetailComponent],
        imports:[HttpClientTestingModule, ToastrModule.forRoot()],
        providers:[
            provideMockStore({}),
            { provide: DashboardService, useValue: DashboardServiceMock },
            { provide: OrderService, useValue: OrderServiceMock },
            { provide: UserService, useValue: UserServiceMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
      })
      .compileComponents();
    }));
  
    beforeEach(() => {
      fixture = TestBed.createComponent(OrderDetailComponent);
      _ds = fixture.debugElement.injector.get(DashboardService);
      _Os = fixture.debugElement.injector.get(OrderService);
      _Us = fixture.debugElement.injector.get(UserService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnchange Method', () => {
        const previousValue = null;
        const currentValue = {};
        const changesObj: SimpleChanges = { order: new SimpleChange(previousValue, currentValue, true) };
        
        const spyGetActivationAssociated = spyOn((component as any), 'getActivationAssociated').and.callThrough();
        const spyGetActivedAssociation = spyOn(_Os, 'getActivedAssociation')
            .and.returnValue(of({code: 'OK',data: {orderIdCanceled: 123233, user: {}}}));
        
        const spyGetDetailOrder = spyOn((component as any), 'getDetailOrder').and.callThrough();
        const spyGetDetail = spyOn(_Os, 'getDetail')
            .and.returnValue(of(orderDetailMock));

        const spyGetStatusOrder = spyOn((component as any), 'getStatusOrder').and.callThrough();
        const spyGetOrderStatusDetail = spyOn(_Os, 'getOrderStatusDetail')
            .and.returnValue(of({data: []}));
        
        const spyGetOrderValues = spyOn((component as any), 'getOrderValues').and.callThrough();
        const spyGetOrder = spyOn(_Os, 'getOrder').and.returnValue(of({data: []}));
        const spyUpdateCancelInfo = spyOn((component as any), 'updateCancelInfo');
            
        const spyGetSatusCustomer = spyOn((component as any), 'getSatusCustomer').and.callThrough();
        const spyVerify = spyOn(_Us, 'verify').and.returnValue(of({confirmation: true}));
        
        const spyGetBillingNumber = spyOn((component as any), 'getBillingNumber').and.callThrough();
        const spyGetBillingNumber2 = spyOn(_ds, 'getBillingNumber')
            .and.returnValue(of({code:'OK',data: [{storeName: 'xxx', ticket: 'xxx'}]}));
        
        const spyGetDistance = spyOn((component as any), 'getDistance').and.callThrough();
        const spyGetOrderCoordinates = spyOn(_ds, 'getOrderCoordinates')
            .and.returnValue(of({code: 'OK',data: { distance:111}}));

        const spyGetNameStore = spyOn((component as any), 'getNameStore').and.callThrough();
        const spyGetCloserStoreNameCustomerByOrderId = spyOn(_ds, 'getCloserStoreNameCustomerByOrderId')
            .and.returnValue(of({data: { mmessage:'test'}}));

        const spyGetTickets = spyOn((component as any), 'getTickets').and.callThrough();
        const spyGetZendeskTickets = spyOn(_Os, 'getZendeskTickets')
            .and.returnValue(of({data: [{json:'{"test":true}'}]}));
        
        const spyGetCreditNote = spyOn((component as any), 'getCreditNote').and.callThrough();
        const spyGetCreditNoteTicket = spyOn(_Os, 'getCreditNoteTicket')
            .and.returnValue(of({data: [{json:'{"test":true}'}]}));

        const spyGetReassingList = spyOn((component as any), 'getReassingList').and.callThrough();
        const spyGetReassingList2 = spyOn(_Os, 'getReassingList')
            .and.returnValue(of({data: [{json:'{"test":true}'}]}));
        
        
        const spyGetObservations = spyOn((component as any), 'getObservations').and.callThrough();
        const spyGetOrderObservations = spyOn(_ds, 'getOrderObservations')
            .and.returnValue(of({data: []}));
            
        //const spyGetTracking = spyOn((component as any), 'getTracking');

        component.order = OrderMock;
        component.ngOnChanges(changesObj);

        expect(spyGetDetailOrder).toHaveBeenCalled();
        expect(spyGetDetail).toHaveBeenCalled();
        
        expect(spyGetActivationAssociated).toHaveBeenCalled();
        expect(spyGetActivedAssociation).toHaveBeenCalled();
                
        expect(spyGetStatusOrder).toHaveBeenCalled();
        expect(spyGetOrderStatusDetail).toHaveBeenCalled();
        
        expect(spyGetOrderValues).toHaveBeenCalled();
        expect(spyGetOrder).toHaveBeenCalled();
        expect(spyUpdateCancelInfo).toHaveBeenCalled();
        
        expect(spyGetSatusCustomer).toHaveBeenCalled();
        expect(spyVerify).toHaveBeenCalled();
        expect(component.orderDetail.stateCustomer).toBe(true);
        
        expect(spyGetBillingNumber).toHaveBeenCalled();
        expect(spyGetBillingNumber2).toHaveBeenCalled();
        
        expect(spyGetDistance).toHaveBeenCalled();
        expect(spyGetOrderCoordinates).toHaveBeenCalled();

        expect(spyGetNameStore).toHaveBeenCalled();
        expect(spyGetCloserStoreNameCustomerByOrderId).toHaveBeenCalled();
        
        expect(spyGetObservations).toHaveBeenCalled();
        expect(spyGetOrderObservations).toHaveBeenCalled(); 
        expect(component.addComment).toBe(true);
        
        expect(spyGetTickets).toHaveBeenCalled();

        expect(spyGetCreditNote).toHaveBeenCalled();
        expect(spyGetCreditNoteTicket).toHaveBeenCalled();

        expect(spyGetReassingList).toHaveBeenCalled();
        expect(spyGetReassingList2).toHaveBeenCalled();

        //expect(spyGetTracking).toHaveBeenCalled();        
    });

                
});
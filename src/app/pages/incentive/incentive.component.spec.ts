import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncentiveComponent } from './incentive.component';
import { FormsModule } from '@angular/forms';

import { of } from 'rxjs';
import { IncentiveService } from 'src/app/services/incentive.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('IncentiveComponent', () => {
    let component: IncentiveComponent;
    let fixture: ComponentFixture<IncentiveComponent>;
    let incentiveService: IncentiveService;
    let cities = [];
    let stores = [];
    let item = {};
    let index = 0;
    let couriers = [];
    let incentives;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IncentiveComponent],
            imports: [FormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes([])],

            providers: [IncentiveService]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IncentiveComponent);
        component = fixture.componentInstance;
        incentiveService = TestBed.inject(IncentiveService);
        spyOn(incentiveService, 'setIncentives').and.returnValue(of({ message: 'success' }));
        spyOn(incentiveService, 'validateIncentives').and.returnValue(of({ message: 'success' }));
        fixture.detectChanges();

        couriers = [
            { id: '1', name: 'Courier 1' },
            { id: '2', name: 'Courier 2' }
        ]

        stores = [
            { id: '1', name: 'Tienda 1' },
            { id: '2', name: 'Tienda 2' }
        ];

        item = {
            cityId: '1',
            value: 0,
            incentiveStartDate: 1622505600000,
            incentiveEndDate: 1625097600000,
            valueMin: 0,
            valueMax: 0
        };

        cities = [
            { id: '1', name: 'Medellín' },
            { id: '2', name: 'Bogotá' }
        ]

        incentives = {
            id: '1',
            name: 'Incentive 1',
            description: 'Incentive 1',
            active: true,
            incentiveStartDate: 1622505600000,
            incentiveEndDate: 1625097600000,
            defaultIncentive: 0,
            incentiveByCity: [
                {
                    cityId: '1',
                    value: 0,
                    incentiveStartDate: 1622505600000,
                    incentiveEndDate: 1625097600000,
                    valueMin: 0,
                    valueMax: 0
                }
            ],
            incentiveByStore: [
                {
                    storeId: '1',
                    value: 0,
                    incentiveStartDate: 1622505600000,
                    incentiveEndDate: 1625097600000,
                    valueMin: 0,
                    valueMax: 0
                }
            ],
            incentiveByCourier: [
                {
                    courierId: 1,
                    value: 0,
                    incentiveStartDate: 1622505600000,
                    incentiveEndDate: 1625097600000,
                    valueMin: 0,
                    valueMax: 0
                }
            ],
            incentiveByKm: [
                {
                    km: 0,
                    value: 0,
                    incentiveStartDate: 1622505600000,
                    incentiveEndDate: 1625097600000,
                    valueMin: 0,
                    valueMax: 0
                }
            ]
        };

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });


    it('should get city name getCityName()', () => {
        let spyCity = component.getCityName('2');
        let city = cities?.filter(city => city.id === '2');
        expect(city[0].name).toEqual('Bogotá');
        expect(spyCity).toBeTruthy();
    }
    );

    it('should get store name ', () => {
        let spyStore = component.getStoreName('2');
        let store = stores?.filter(store => store.id === '2');
        expect(store[0].name).toEqual('Tienda 2');
        expect(spyStore).toBeTruthy();
    });

    it('should get courier name getCourierName()', () => {
        let spyCourier = component.getCourierName(2);
        let courier = couriers?.filter(courier => courier.id === '2');
        expect(courier[0].name).toEqual('Courier 2');
        expect(spyCourier).toBeTruthy();
    });

    it('should get data km getDataKm()', () => {
        let spyDataKm = component.getDataKm(2);
        expect(spyDataKm).toBeTruthy();
    });

  
    it('should load data loadData()', () => {
        let spyIncentives = spyOn(incentiveService, 'getIncentives').and.returnValue(of(incentives));
        component.loadData();
        expect(component.loadData).toBeTruthy();
        expect(spyIncentives).toHaveBeenCalled();
    });

    it('should change type changeType()', () => {
        let spyChangeType = spyOn(component, 'changeType').and.callThrough();
        component.changeType();
        expect(component.changeType).toBeTruthy();
        expect(spyChangeType).toHaveBeenCalled();
    });

    it('should change list changeList()', () => {
        let spyChangeList = spyOn(component, 'changeList').and.callThrough();
        component.changeList();
        expect(component.changeList).toBeTruthy();
        expect(spyChangeList).toHaveBeenCalled();
    });

    it('should append info appendInfo()', () => {
        let item = {
            cityId: '1',
            value: 0,
            incentiveStartDate: 1622505600000,
            incentiveEndDate: 1625097600000,
            valueMin: 0,
            valueMax: 0
        };
        if(item.cityId) item['cityName'] = component.getCityName(item.cityId);
        let spyAppendInfo = spyOn(component, 'appendInfo').and.callThrough();
        component.appendInfo(item, index);
        expect(component.appendInfo).toBeTruthy();
        expect(spyAppendInfo).toHaveBeenCalled();
        expect(item.cityId).toEqual('1');
    });

});
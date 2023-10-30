import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IncentiveService } from './incentive.service';
import { of } from 'rxjs';

describe('IncentiveService', () => {
    let service: IncentiveService;
    let httpMock: HttpTestingController;
    let params;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [IncentiveService]
        });
        service = TestBed.inject(IncentiveService);
        httpMock = TestBed.inject(HttpTestingController);

        params = {

        };

    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });


    it('should get incentives', () => {
        const dummyIncentives = [
            { id: '1', name: 'Incentive 1' },
            { id: '2', name: 'Incentive 2' }
        ];
        let spyIncentives = spyOn(service, 'getIncentives').and.returnValue(of(dummyIncentives));
        service.getIncentives().subscribe(incentives => {
            expect(incentives.length).toBe(2);
            expect(incentives).toEqual(dummyIncentives);
        });
        expect(spyIncentives).toHaveBeenCalled();
    });

  
    it('should set incentives', () => {
      const mockData = { data: 'mock data' };
      service.setIncentives(mockData).subscribe(data => {
        expect(data).toEqual(mockData);
      });
      const req = httpMock.expectOne(service.urls.setIncentives);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockData);
      req.flush(mockData);
    });
  
    it('should validate incentives', () => {
      const mockData = { data: 'mock data' };
      const mockAction = 'mock action';
      service.validateIncentives(mockData, mockAction).subscribe(data => {
        expect(data).toEqual(mockData);
      });
      const req = httpMock.expectOne(service.urls.validateIncentives);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockData);
    });

    it('should get vip stores', () => {
        const dummyVipStores = [
            { id: '1', name: 'Vip Store 1' },
            { id: '2', name: 'Vip Store 2' }
        ];
        let spyVipStores = spyOn(service, 'getVipStores').and.returnValue(of(dummyVipStores));
        service.getVipStores().subscribe(vipStores => {
            expect(vipStores.length).toBe(2);
            expect(vipStores).toEqual(dummyVipStores);
        });
        expect(spyVipStores).toHaveBeenCalled();
    });

    it('should get incentive types', () => {
        const dummyIncentiveTypes = [
            { id: '1', name: 'Incentive Type 1' },
            { id: '2', name: 'Incentive Type 2' }
        ];
        let spyIncentiveTypes = spyOn(service, 'getIncentiveTypes').and.returnValue(of(dummyIncentiveTypes));
        service.getIncentiveTypes().subscribe(incentiveTypes => {
            expect(incentiveTypes.length).toBe(2);
            expect(incentiveTypes).toEqual(dummyIncentiveTypes);
        });
        expect(spyIncentiveTypes).toHaveBeenCalled();
    });

    it('should set armirene incentives', () => {
        const mockData = { data: 'mock data' };
        service.setArmireneIncentives(mockData).subscribe(data => {
            expect(data).toEqual(mockData);
        });
        const req = httpMock.expectOne(service.urls.setArmireneIncentive);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockData);
        req.flush(mockData);
    });

    it('should get armirene incentives', () => {
        const dummyArmireneIncentives = [
            { id: '1', name: 'Armirene Incentive 1' },
            { id: '2', name: 'Armirene Incentive 2' }
        ];
        let spyArmireneIncentives = spyOn(service, 'getArmireneIncentives').and.returnValue(of(dummyArmireneIncentives));
        service.getArmireneIncentives().subscribe(armireneIncentives => {
            expect(armireneIncentives.length).toBe(2);
            expect(armireneIncentives).toEqual(dummyArmireneIncentives);
        });
        expect(spyArmireneIncentives).toHaveBeenCalled();
    });

    it('should set vip stores', () => {
        const mockData = { data: 'mock data' };
        service.setVipStores(mockData).subscribe(data => {
            expect(data).toEqual(mockData);
        });
        const req = httpMock.expectOne(service.urls.setVipStores);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockData);
        req.flush(mockData);
    });

    it('should get values list', () => {
        const dummyValuesList = [
            { id: '1', name: 'Value 1' },
            { id: '2', name: 'Value 2' }
        ];
        let spyValuesList = spyOn(service, 'getValuesList').and.returnValue(of(dummyValuesList));
        service.getValuesList().subscribe(valuesList => {
            expect(valuesList.length).toBe(2);
            expect(valuesList).toEqual(dummyValuesList);
        });
        expect(spyValuesList).toHaveBeenCalled();
    });

    it('should set incentive module log', () => {
        const mockData = { data: 'mock data' };
        service.setIncentiveModuleLog(mockData).subscribe(data => {
            expect(data).toEqual(mockData);
        });
        const req = httpMock.expectOne(service.urls.setIncentiveModuleLog);
        expect(req.request.method).toBe('POST');
        req.flush(mockData);
    });
});


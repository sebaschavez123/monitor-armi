import { HttpClientTestingModule } from '@angular/common/http/testing';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/services/auth.service';
import { SearchOrdersComponent } from './search-orders.component';
import { DashboardService } from 'src/app/services/dashboard.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { CustomerService } from 'src/app/services/customer.service';

const OrderMock = {
  id: 123,
  orderId: 123,
  status: 'FINALIZADA',
};
const DashboardServiceMock = {
  urls: {
    searchIdOrdersReports: '/searchIdOrdersReports',
  },
  getLocalUser: () => {return {}},
  getPermissions: () => {return {}},
  getCols: () => {return {}},
};
const OrderServiceMock = {};
const i18Mock = {
  setLocale: () => {}
};
const UserServiceMock = {
  verify: () => {},
}

describe('Search Orders Component', () => {
    let component: SearchOrdersComponent;
    let fixture: ComponentFixture<SearchOrdersComponent>;
  
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SearchOrdersComponent],
        imports:[
          FormsModule,
          HttpClientTestingModule,
          FormsModule,
          ReactiveFormsModule,
          RouterTestingModule
        ],
        providers:[
          OrderService,
          { provide: DashboardService, useValue: DashboardServiceMock },
          { provide: NzI18nService, useValue: i18Mock },
          { provide: CustomerService, useValue: UserServiceMock },
          { provide: ToastrService, useValue: {fire: ()=>{}} },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
      })
      .compileComponents();
    }));

    /*
    private _dS:DashboardService,
              private i18n: NzI18nService,
              private _oS:OrderService,
              private _cS:CustomerService,
              private toastr: ToastrService
    */
  
    beforeEach(() => {
      fixture = TestBed.createComponent(SearchOrdersComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
    
    it('getRequest Method', () => {
      const spyGetRequest = spyOn((component as any), 'getRequest');
      component.changeValues();
      expect(spyGetRequest).toHaveBeenCalled();
    });
});
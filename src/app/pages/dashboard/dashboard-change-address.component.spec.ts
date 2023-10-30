import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DashboardChangeAddressComponent } from "./dashboard-change-address.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { DashboardService } from "src/app/services/dashboard.service";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";
import { countryConfig } from "src/country-config/country-config";
import { ToastrModule } from "ngx-toastr";
import { of } from "rxjs";


describe('DashboardChangeAddress Component', () => {
  let component: DashboardChangeAddressComponent;
  let fixture: ComponentFixture<DashboardChangeAddressComponent>;
  let _dS: DashboardService;
  let response;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AngularFireModule.initializeApp(countryConfig?.firebaseConfig),
        AngularFireDatabaseModule,
        ToastrModule.forRoot({
          timeOut: 1000,
          positionClass: 'toast-bottom-right',
          preventDuplicates: true,
        }),
      ],
      declarations: [DashboardChangeAddressComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardChangeAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    _dS = TestBed.inject(DashboardService);
    response = {
      code: 'OK',
      data: [
        {
          orderId: 4473088,
          JSON: { orderId: 4473088, storeName: 'FRANCISCO', storeAddress: 'Ave. 76 entre las calles 79 (antes Av. La Limpia) y 79B, Sector La Macandona, No 79-54', customerDocument: '17416500', customerName: 'jose chirinos', customerPhone: '5804246170134', customerAddress: 'Parroquia Cacique Mara, Municipio Maracaibo, Estado Zulia, 4012, Venezuela / CALLE 83 A / entregar a NORENA CHIRINOS', customerAddressId: 1334984, date: '2023-05-10 11:09:02', emitido: 0, enviado: 0, asignado: 0, picking: 5, facturado: 1282, proceso: null, finalizado: null, totalMins: 2547, idTracking: 'Por definir', status: 'FINALIZADA', red: 'R', courier: null, courierName: 'Armirene', messenger: 'José Fuenmayor', messengerPhone: '5804246417972', city: 'Maracaibo', paymentMethod: 'Pago Movil', createDate: '2023-05-10 11:09:02', multiStore: 1, delayed: 0, observations: ' escribir para informacion de direccion al 56933046343 gracias', callCenterComments: null, storeId: '604', messengerEmail: 'josearmandofa31@gmail.com', messengerId: '22177800', messengerPhoto: 'Por definir', customerId: '1896223', customerEmail: 'joserchg12@gmail.com', pickingDate: null, pickingHour: null, statusDetail: null, viewOrder: null, orderDelayed: 'FALSE', hasCreditNote: null, providerName: null, store: null, isOrderReasigned: 'FALSE', isOrderRelaunched: 'FALSE', isOrderActivated: 'FALSE', isHighPriceOrder: 'TRUE', exceedKilometers: null, orderDeliveryType: null, hasPrescription: null, reasonCancelation: null, userNameCancelation: null, statusDate: null, itemId: null, itemBarcode: null, itemUrlImage: null, itemDescription: null, quantity: null, unitPrice: null, totalPrice: null, deliveryValue: null, employeeName: null, reason: null, lifeMiles: null, email: null, transactionStatusPayU: null, transactionStatusProviderPayU: null, orderIdProvider: null, transactionValuePayU: null, ticketNumber: null, creditNoteTicketNumber: null, hasCoupons: 'FALSE', deliveryType: null, hasPinBlocked: null, dateOrderGuide: null, fraudDescription: null, ticketZendesk: null, messengerProvider: null, totalTime: null, evidence: null, tipoOrden: null, assignmentHour: null, invoiceHour: null, finishedHour: null, providerMessengerName: null, theoricalValue: null, realValue: null, orderCancellationReason: null, numberReassignments: 0, theoricalDistance: 4.2379, theoricalDuration: 4.3966666666666665, orderCancellationObservation: null, orderCancellationUserName: null, orderTransfersRelation: null, messengerVehicleType: 'MOTO', kmOrder: null, hasTicketZendesk: 'FALSE', exceedWeight: 'FALSE', exceedVolume: 'FALSE', manySkus: 'FALSE', realKm: 4.24, currentStatusTime: 1260 },
        },
      ],
      message: 'Success',
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initCols', () => {
    component.initCols();
    expect(component.cols).toBeTruthy();
  });

  it('getData', () => {
    const spy = spyOn(_dS, 'getOrders20JSON').and.returnValue(of(response));
    component.getData();
    expect(spy).toHaveBeenCalled();
  });

  it('searchData', () => {
    const spy = spyOn(_dS, 'getOrders20JSON').and.returnValue(of(response));
    component.searchData();
    expect(spy).toHaveBeenCalled();
  });

  it('filterData', () => {
    const newData = component.filterData(response?.data);
    expect(newData).toEqual(response?.data);
  });

  it('isIndicator', () => {
    const item = response?.data[0];
    expect(component.isIndicator('km', item)).toBe(false);
    expect(component.isIndicator('price', item)).toBe(false);
    expect(component.isIndicator('transfer', item)).toBe(false);
    expect(component.isIndicator('weight', item)).toBe(false);
    expect(component.isIndicator('volume', item)).toBe(false);
  });
});

import { CustomerEditComponent } from "./customer-edit.component";

describe('CustomerEditComponent', () => {
let component: CustomerEditComponent;

  beforeEach(() => {
    component = new CustomerEditComponent(null, null, null);
  });

  it('should return "Mensual" for type subscription "MONTH"', () => {
    expect(component.getPrimeType('MONTH')).toEqual('Mensual');
  });

  it('should return "Anual" for type subscription "YEAR"', () => {
    expect(component.getPrimeType('YEAR')).toEqual('Anual');
  });

  it('should return "Semestral" for type subscription "SEMESTER"', () => {
    expect(component.getPrimeType('SEMESTER')).toEqual('Semestral');
  });

  it('should return "No se encontró tipo de suscripción" for unknown type subscription', () => {
    expect(component.getPrimeType('UNKNOWN')).toEqual('No se encontró tipo de suscripción');
  });
});
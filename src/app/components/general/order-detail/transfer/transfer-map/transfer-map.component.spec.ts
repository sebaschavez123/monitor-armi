import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferMapComponent } from './transfer-map.component';

describe('TransferMapComponent', () => {
  let component: TransferMapComponent;
  let fixture: ComponentFixture<TransferMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

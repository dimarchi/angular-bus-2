import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusStopComponent } from './bus-stop.component';

describe('BusStopComponent', () => {
  let component: BusStopComponent;
  let fixture: ComponentFixture<BusStopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusStopComponent]
    });
    fixture = TestBed.createComponent(BusStopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

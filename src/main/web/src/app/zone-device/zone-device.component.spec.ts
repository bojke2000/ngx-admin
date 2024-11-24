import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneDeviceComponent } from './zone-device.component';

describe('ZoneDeviceComponent', () => {
  let component: ZoneDeviceComponent;
  let fixture: ComponentFixture<ZoneDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoneDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

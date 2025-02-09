import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneDeviceAssignComponent } from './zone-device-assign.component';

describe('ZoneDeviceAssignComponent', () => {
  let component: ZoneDeviceAssignComponent;
  let fixture: ComponentFixture<ZoneDeviceAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoneDeviceAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneDeviceAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

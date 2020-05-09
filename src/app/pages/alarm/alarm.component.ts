import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, of } from 'rxjs';

import { AbstractComponent } from '../../AbstractComponent';
import { Alarm } from '../../domain/alarm';
import { AlarmService } from '../../service/alarm.service';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { NgPrimeGridResponse } from './../../domain/ngprime-grid-response';
import { Table } from 'primeng/table';
import { TranslateService } from '@ngx-translate/core';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'ngx-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css'],
})
export class AlarmComponent extends AbstractComponent implements OnInit, OnDestroy {
  alarms: Alarm[];
  alarm: Alarm;
  totalRecords: number;
  cols: any[];
  loading: boolean;
  alarmSearch: string;

  protected destroy$ = new Subject<void>();
  @ViewChild('table', { static: false }) table: Table;

  constructor(
    private alarmService: AlarmService,
    translate: TranslateService) {
    super(translate);
  }

  ngOnInit(): void {

    this.loadAlarms(0, 20, 'id,asc');

    this.cols = [
      { field: 'customerName', header: 'Customer name', width: '180px' },
      { field: 'address', header: 'Address', width: '200px' },
      { field: 'addressNo', header: 'AddressNo', width: '100px' },
      { field: 'deviceId', header: 'Device ID', width: '100px' },
      { field: 'batteryLow', header: 'Battery Low', width: '100px' },
      { field: 'flowDirection', header: 'Flow Direction', width: '100px' },
      { field: 'memoryThreshold', header: 'Memory Threshold', width: '100px' },
      { field: 'residualLeak', header: 'Residual Leak', width: '100px' },
      { field: 'sensor1', header: 'Sensor1', width: '100px' },
      { field: 'sensor2', header: 'Sensor2', width: '100px' },
      { field: 'stateLeap', header: 'State Leap', width: '100px' },
      { field: 'noFlow', header: 'No Flow', width: '100px' },
      { field: 'underDimensioned', header: 'Under Dimensioned', width: '150px' },
      { field: 'overDimensioned', header: 'Over Dimensioned', width: '150px' },
      { field: 'disassembly', header: 'Disassembly', width: '100px' },
      { field: 'freezing', header: 'Freezing', width: '100px' },
      { field: 'updateAt', header: 'Updated At', width: '150px' },
    ];

    const pageable = {page: 1, size: 20, sort: 'id'};
    this.alarmService.getAll(pageable).then((response: NgPrimeGridResponse) => {
      this.alarms = response.data;
      this.totalRecords = response.totalRecords;
      this.loading = false;
    });
  }

  get loading$() {
    return of(this.loading).pipe(
      distinctUntilChanged(),
    );
  }

  get alarms$() {
    return of(this.alarms).pipe(
      distinctUntilChanged(),
    );
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAlarms(page: number, size: number, sort?: string) {
    const pageable = { page, size, sort};
    this.alarmService.getAll(pageable).then((response: NgPrimeGridResponse) => {
      this.alarms = response.data;
      this.totalRecords = response.totalRecords;
      this.loading = false;
    });
  }

  loadAlarmsLazy(event: LazyLoadEvent) {
    this.loading = true;
    const sortBy = event.sortField === undefined ? 'id' : event.sortField === 'role' ? 'role.name' : event.sortField;
    const sortOrder = event.sortOrder === -1 ? 'desc' : 'asc';
    this.loadAlarms(event.first / event.rows, event.rows, sortBy + ',' + sortOrder);
  }
}

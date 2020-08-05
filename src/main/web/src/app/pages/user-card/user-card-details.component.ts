import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { AbstractComponent } from '../../AbstractComponent';
import { LazyLoadEvent } from 'primeng/api';
import { NgPrimeGridResponse } from '../../domain/ngprime-grid-response';
import { TranslateService } from '@ngx-translate/core';
import { UsageHistoryService } from '../../service/usage-history.service';

@Component({
  selector: 'ngx-user-card-details',
  templateUrl: './user-card-details.component.html',
  styleUrls: ['./user-card-details.component.css'],

})
export class UserCardDetailsComponent extends AbstractComponent implements OnInit {

  customerId = '12345';
  customerName = 'Petar Petrovic';
  address = 'Zike Zikica';
  addressNo = '2';
  deviceId = '1243423';
  gsmId = '21414';
  readTimestamp = '23.07.2020 12:23';
  usageCurrent: number = 123.12;
  usageCurrentReverse: number = 321.21;
  usageCurrentMonth: number = 213.32;
  diffLastRead: number = 12.41;

  userCardId = undefined;
  cols = [];
  usageHistory = [];
  totalRecords = 0;
  loading = false;
  sortBy = 'id';
  sortOrder = 'desc';
  page = undefined;
  rows = undefined;



  @Input()
  displayDialog = false;
  @Output()
  closeFunction = new EventEmitter();

  constructor (translate: TranslateService,
    private readonly usageHistoryService: UsageHistoryService) {
   super(translate);
  }

  onHide(): void {
    const {displayDialog} = this;

    if (this.closeFunction) {
      this.closeFunction.emit(displayDialog);
    }
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'id', header: '#', width: '70px' },
      { field: 'usageCurrent', header: 'usageCurrent', width: '70px' },
      { field: 'usageCurrent', header: 'usageCurrent', width: '70px' },
      { field: 'usageCurrentReverse', header: 'usageCurrentReverse', width: '70px' },
      { field: 'usageCurrentMonth', header: 'usageCurrentMonth', width: '70px' },
      { field: 'readAt', header: 'readAt', width: '70px' },
    ];
  }

  private loadPage(page: number, size: number, sort?: string) {
    const pageable = { page, size, sort};
    this.usageHistoryService.findBy(this.getSearchCriteria(), pageable).then((ngresp: NgPrimeGridResponse) => {
      this.usageHistory = ngresp.data;
      this.totalRecords = ngresp.totalRecords;
      this.loading = false;
    });
  }

  loadUsageHistoryLazy(event: LazyLoadEvent) {
    this.loading = true;
    this.sortBy = event.sortField === undefined ? 'id' : event.sortField === 'city' ? 'cityId' : event.sortField;
    this.sortOrder = event.sortOrder === -1 ? 'desc' : 'asc';
    this.page = event.first / event.rows;
    this.rows = event.rows;
    this.loadPage(event.first / event.rows, event.rows, this.sortBy + ',' + this.sortOrder);
  }

  getSearchCriteria() {
    const {
      userCardId
    } = this;

    return {userCardId};
  }
}

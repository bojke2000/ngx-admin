import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { AbstractComponent } from '../../AbstractComponent';
import { LazyLoadEvent } from 'primeng/api';
import { NgPrimeGridResponse } from '../../domain/ngprime-grid-response';
import { TranslateService } from '@ngx-translate/core';
import { UsageHistoryService } from '../../service/usage-history.service';
import { UserCard } from '../../domain/user-card';
import { UserCardService } from './../../service/user-card.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ngx-user-card-details',
  templateUrl: './user-card-details.component.html',
  styleUrls: ['./user-card-details.component.css'],

})
export class UserCardDetailsComponent extends AbstractComponent implements OnInit {

  customerId = undefined;
  customerName = undefined;
  address = undefined;
  addressNo = undefined;
  deviceId = undefined;
  gsmId = undefined;
  readTimestamp = undefined;
  usageCurrent: number = undefined;
  usageCurrentReverse: number = undefined;
  usageCurrentMonth: number = undefined;
  diffLastRead: number = undefined;
  magneticSabotageTime: string = undefined;

  @Input()
  userCardId = undefined;
  cols = [];
  usageHistory = [];
  totalRecords = 0;
  loading = false;
  sortBy = 'id';
  sortOrder = 'desc';
  page = undefined;
  rows = undefined;
  initialized = false;

  // chart
  data = {};



  @Input()
  displayDialog = false;
  @Output()
  closeFunction = new EventEmitter();

  constructor (translate: TranslateService,
    private readonly userCardService: UserCardService,
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
      { field: 'usageCurrent', header: 'Watermeter Status', width: '70px' },
      { field: 'usageCurrentReverse', header: 'Reverse Flow Status', width: '70px' },
      { field: 'usageCurrentMonth', header: 'Status on day of reading', width: '70px' },
      //{ field: 'usageAverage', header: 'Average Usage', width: '70px' },
      { field: 'readAt', header: 'Read Datetime', width: '70px' },
    ];
  }

  onShow() {
    if (this.initialized) {
      this.loadPage(0, 7, this.sortBy + ',' + this.sortOrder);
    } else {
      this.initialized = true;
    }

    this.userCardService.getById(this.userCardId).then((dto: UserCard) => {
      this.customerId = dto.customerId;
      this.address = dto.address + ' ' + dto.addressNo;
      this.addressNo = dto.addressNo;
      this.customerName = dto.customerName;
      this.deviceId = dto.deviceId;
      this.gsmId = dto.gsmId;
      this.usageCurrent = dto.usageCurrent;
      this.usageCurrentReverse = dto.usageCurrentReverse;
      this.usageCurrentMonth = dto.usageCurrentMonth;
      this.readTimestamp = dto.readTimestamp;
      this.diffLastRead = dto.diffLastRead;
      this.magneticSabotageTime = dto.magneticSabotageTime;
    });

    this.usageHistoryService.getCharData(this.userCardId).then(resp => {
      var data = [];
      for (const el of resp as Array<any>) {
        data.push(el.usageCurrentMonth);
      }

      const label = this.translate.instant('Monthly Usage') ? this.translate.instant('Monthly Usage') : 'Monthly Usage';
      this.data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
            {
              label,
              backgroundColor: '#9CCC65',
              borderColor: '#7CB342',
              data
            }
        ]
      }
    });

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

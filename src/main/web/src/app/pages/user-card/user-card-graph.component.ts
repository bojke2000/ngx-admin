import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AbstractComponent } from '../../AbstractComponent';
import { LazyLoadEvent } from 'primeng/api';
import { NgPrimeGridResponse } from '../../domain/ngprime-grid-response';
import { TranslateService } from '@ngx-translate/core';
import { UserCard } from '../../domain/user-card';
import { UserCardService } from '../../service/user-card.service';

@Component({
  selector: 'ngx-user-card-graph',
  templateUrl: './user-card-graph.component.html',
  styleUrls: ['./user-card-graph.component.css'],

})
export class UserCardGraphComponent extends AbstractComponent implements OnInit {

  @Input()
  criteria = undefined;

  cols = [];
  userCards: UserCard[];
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
  displayGraph = false;
  @Output()
  closeFunction = new EventEmitter();

  constructor (translate: TranslateService,
    private readonly userCardService: UserCardService) {
   super(translate);
  }

  onHide(): void {
    const {displayGraph: displayDialog} = this;

    if (this.closeFunction) {
      this.closeFunction.emit(displayDialog);
    }
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'customerName', header: 'Customer name', width: '140px' },
      { field: 'usageCurrent', header: 'Trenutna', width: '70px' },
      { field: 'usageCurrentReverse', header: 'Reverza', width: '70px' },
      { field: 'usageCurrentMonth', header: 'Mesecna', width: '70px' },
      { field: 'usageAverage', header: 'Srednja', width: '70px' },
      { field: 'diffLastRead', header: 'Stanje', width: '70px' },
      { field: 'readTimestamp', header: 'Read Datetime', width: '140px' },
    ];

    this.data = {
      labels: ['Usage'],
      datasets: [
          {
            label: 'Monthly Usage',
            backgroundColor: '#9CCC65',
            borderColor: '#7CB342',
            data: [],
            width: '200px',
            height: '50px'
          }
      ]}
  }

  onShow() {
    if (this.initialized) {
      this.loadPage(0, 8, this.sortBy + ',' + this.sortOrder);
    } else {
      this.initialized = true;
    }
  }

  private loadPage(page: number, size: number, sort?: string) {
    const pageable = { page, size, sort};
    this.userCardService.findBy(this.criteria, pageable).then((ngresp: NgPrimeGridResponse) => {
      this.userCards = ngresp.data;
      this.totalRecords = ngresp.totalRecords;
      this.loading = false;
    });
  }

  loadUsageLazy(event: LazyLoadEvent) {
    this.loading = true;
    this.sortBy = 'id';
    this.sortOrder = 'desc';
    this.page = event.first / event.rows;
    this.rows = event.rows;
    this.loadPage(event.first / event.rows, event.rows, this.sortBy + ',' + this.sortOrder);
  }
}

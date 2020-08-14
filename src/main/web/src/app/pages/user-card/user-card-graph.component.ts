import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AbstractComponent } from '../../AbstractComponent';
import { LazyLoadEvent } from 'primeng/api';
import { NgPrimeGridResponse } from '../../domain/ngprime-grid-response';
import { TranslateService } from '@ngx-translate/core';
import { UserCard } from '../../domain/user-card';
import { UserCardService } from '../../service/user-card.service';
import { of } from 'rxjs';

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

  get graphData$() {
    return of(this.data);
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'customerName', header: 'Customer name', width: '120px' },
      { field: 'usageCurrent', header: 'Trenutna', width: '80px' },
      { field: 'usageCurrentReverse', header: 'Reverza', width: '80px' },
      { field: 'usageCurrentMonth', header: 'Mesecna', width: '80px' },
      { field: 'usageAverage', header: 'Srednja', width: '80px' },
      { field: 'diffLastRead', header: 'Stanje', width: '80px' },
      { field: 'readTimestamp', header: 'Read Datetime', width: '140px' },
    ];
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

      const labels = [];
      const usageCurrent = [];
      const usageCurrentMonth = [];
      const usageAverage = [];
      const diffLastRead = [];
      const usageCurrentReverse = [];
      this.userCards.forEach(uc => {
        labels.push(uc.customerName.substr(0,14));
        usageCurrent.push(uc.usageCurrent);
        usageCurrentMonth.push(uc.usageCurrentMonth);
        usageAverage.push(uc.usageAverage);
        diffLastRead.push(uc.diffLastRead);
        usageCurrentReverse.push(uc.usageCurrentReverse);
      });

      this.data = {
        labels,
        datasets: [
          {
            label: 'Ukupna',
            backgroundColor: '#9CCC65',
            borderColor: '#7CB342',
            data: usageCurrent,
          },
          {
              label: 'Mesecna',
              backgroundColor: '#42A5F5',
              borderColor: '#1E88E5',
              data: usageCurrentMonth,
          },
          {
            label: 'Prosek',
            backgroundColor: '#ffc77d',
            borderColor: '#AFFFFF',
            data: usageAverage
          },
          {
          label: 'Stanje',
          backgroundColor: '#03DAC5',
          borderColor: '#1E88E5',
          data: diffLastRead
          },
          {
            label: 'Reverzna',
            backgroundColor: '#eaed87',
            borderColor: '#AFFFFF',
            data: usageCurrentReverse
          }
        ]}
    });
  }

  loadUsageLazy(event: LazyLoadEvent) {
    this.loading = true;
    this.sortBy = event.sortField === undefined ? 'id' : event.sortField;
    this.sortOrder = event.sortOrder === 1 ? 'desc' : 'asc';
    this.page = event.first / event.rows;
    this.rows = event.rows;
    this.loadPage(event.first / event.rows, event.rows, this.sortBy + ',' + this.sortOrder);
  }
}

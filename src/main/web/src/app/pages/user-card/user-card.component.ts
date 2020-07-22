import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent, SelectItem } from 'primeng/api/public_api';
import { Observable, of } from 'rxjs';

import { Grid } from '../../domain/grid';
import { MunicipalityService } from '../../service/municipailty.service';
import { NgPrimeGridResponse } from '../../domain/ngprime-grid-response';
import { Pageable } from './../../domain/pageable';
import { ReadingBookService } from '../../service/reading-book.service';
import { RouteService } from '../../service/route.service';
import { Table } from 'primeng/table';
import { TranslateService } from '@ngx-translate/core';
import { UserCard } from '../../domain/user-card';
import { UserCardColumnService } from '../../service/user-card-column.service';
import { UserCardService } from '../../service/user-card.service';

@Component({
  selector: 'ngx-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css'],

})
export class UserCardComponent implements OnInit {

  userCards: UserCard[];
  totalRecords: number;
  cols: any[];
  isResisable: boolean = true;
  loading: boolean;
  @ViewChild('table', {static: false}) table: Table;
  selectedUserCard: UserCard;

  customerName: string;
  customerId; string;
  route: string;
  routes: SelectItem[];
  address: string;
  readingBook: string;
  readingBooks: SelectItem[];
  municipality: string;
  municipalities: SelectItem[];
  usageCurrentFrom: number;
  usageCurrentTo: number;
  usageReverseFrom: number;
  usageReverseTo: number;

  // state of pagination
  sortBy: string;
  sortOrder: string;
  first: number;
  rows: number;

  constructor(
    private userCardService: UserCardService,
    private userCardColumnService: UserCardColumnService,
    private routeService: RouteService,
    private readingBookService: ReadingBookService,
    private municipalityService: MunicipalityService,
    translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('rs');
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'id', header: '#', width: '70px' },
    ];

    this.userCardColumnService.findAll(Grid.USER_CARD).then(columns => {
      this.cols = [...this.cols, ...columns];
    });

    this.loading = true;

    this.routeService.getRoutesAsOptions().then(routes => {
      this.routes = routes;
    });

    this.readingBookService.getReadingBooksAsOptions().then(readingBooks => {
      this.readingBooks = readingBooks;
    });

    this.municipalityService.getMunicipalitiesAsOptions().then(municipalities => {
      this.municipalities = municipalities;
    });
  }

  get cols$(): Observable<any[]> {
    return of(this.cols);
  }

  private loadPage(page: number, size: number, sort?: string) {
    const pageable = { page, size, sort};
    this.userCardService.findAll(pageable).then((ngresp: NgPrimeGridResponse) => {
      this.userCards = ngresp.data;
      this.totalRecords = ngresp.totalRecords;
      this.loading = false;
    });
  }

  loadUserCardsLazy(event: LazyLoadEvent) {
    this.loading = true;
    this.sortBy = event.sortField === undefined ? 'id' : event.sortField === 'city' ? 'cityId' : event.sortField;
    this.sortOrder = event.sortOrder === -1 ? 'desc' : 'asc';
    this.first = event.first;
    this.rows = event.rows;
    this.loadPage(event.first / event.rows, event.rows, this.sortBy + ',' + this.sortOrder);
  }

  resetSort() {
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();
   }

   onImportClick() {
      alert('onImportClick');
   }

   onCustomerNameClick(payload) {
    alert(payload);
  }

  fontWeight(rowData: any[], columnName: string) {
    if (columnName !== 'diffLastRead') {
      return 'normal';
    } else {
      const status = rowData[`${columnName}Color`];

      return (status > 0) ? 'bold' : 'normal';
    }
  }

  styleColor(rowData: any[], columnName: string) {
    if (columnName !== 'diffLastRead') {
      return null;
    } else {
      const status = rowData[`${columnName}Color`];

      return (status > 0) ? 'red' : null;
    }
  }

  search () {
    const { customerName,
            route,
            address,
            readingBook,
            municipality,
            usageCurrentFrom,
            usageCurrentTo,
            usageReverseFrom,
            usageReverseTo
          } = this;

    const searchCriteria = {customerName};
    const pageable = this.getPageable();

    this.userCardService.findBy(searchCriteria, pageable).then((ngresp: NgPrimeGridResponse) => {
      this.userCards = ngresp.data;
      this.totalRecords = ngresp.totalRecords;
      this.loading = false;
    });



    console.log("search: %s, %s, %s, %s, %s, %s, %s, %s, %s",
      customerName,
      route,
      address,
      readingBook,
      municipality,
      usageCurrentFrom,
      usageCurrentTo,
      usageReverseFrom,
      usageReverseTo);
  }

  getPageable(): Pageable {
    return {page: this.first, size: this.rows, sort: `${this.sortBy},${this.sortOrder}`};
  }

  clear() {
    this.customerName = '';
    this.route = '';
    this.address = '';
    this.readingBook = '';
    this.municipality = '';
    this.usageCurrentFrom = undefined;
    this.usageCurrentTo = undefined;
    this.usageCurrentFrom = undefined;
    this.usageReverseTo = undefined;

    this.userCardService.findBy({}, this.getPageable()).then((ngresp: NgPrimeGridResponse) => {
      this.userCards = ngresp.data;
      this.totalRecords = ngresp.totalRecords;
      this.loading = false;
    });
  }
}

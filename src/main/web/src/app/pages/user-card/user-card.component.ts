import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent, SelectItem } from 'primeng/api/public_api';
import { Observable, of } from 'rxjs';

import { AbstractComponent } from '../../AbstractComponent';
import { AddressService } from '../../service/address.service';
import { Grid } from '../../domain/grid';
import { MunicipalityService } from '../../service/municipailty.service';
import { NgPrimeGridResponse } from '../../domain/ngprime-grid-response';
import { NgxTableComponent } from '../../libs/toolbox-components/ngx-table/ngx-table.component';
import { Pageable } from './../../domain/pageable';
import { ReadingBookService } from '../../service/reading-book.service';
import { RouteService } from '../../service/route.service';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { TranslateService } from '@ngx-translate/core';
import { UserCard } from '../../domain/user-card';
import { UserCardColumnService } from '../../service/user-card-column.service';
import { UserCardService } from '../../service/user-card.service';
import { UserCardUsage } from './../../domain/user-card-usage';
import {saveAs as importedSaveAs} from 'file-saver';

const CURRENT_VIEW = 1;

@Component({
  selector: 'ngx-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css'],

})
export class UserCardComponent extends AbstractComponent implements OnInit {

  userCards: UserCard[];
  totalRecords: number;
  cols: any[];
  isResisable: boolean = true;
  loading: boolean;
  @ViewChild('table', {static: false}) table: Table;
  selectedUserCard: UserCard;

  @ViewChild(NgxTableComponent) child: NgxTableComponent;

  customerName: string;
  customerId; string;
  route: string;
  routes: SelectItem[];
  address: string;
  addresses: SelectItem[];
  readingBook: string;
  readingBooks: SelectItem[];
  municipality: string;
  municipalities: SelectItem[];
  usageCurrentFrom: number;
  usageCurrentTo: number;
  usageReverseFrom: number;
  usageReverseTo: number;
  deviceId: string;
  gsmId: string;
  dateFrom: string = undefined;
  dateTo: string = undefined;
  zoneDevice = false;
  displayType: number = 1;
  displayTypes: SelectItem[];

  // state of pagination
  sortBy: string;
  sortOrder: string;
  page: number;
  rows: number;

  displayDialog = false;
  id: string = undefined;

  // Summary
  sumUsageCurrent: number;
  sumUsageCurrentReverse: number;
  sumUsageCurrentMonth: number;
  sumUsageAverage: number;
  sumDiffLastRead: number;

  // graph
  displayGraph = false;
  displaySummaries = false;

  // chart
  data = {};

  constructor(
    private userCardService: UserCardService,
    private userCardColumnService: UserCardColumnService,
    private routeService: RouteService,
    private addressService: AddressService,
    private readingBookService: ReadingBookService,
    private municipalityService: MunicipalityService,
    private router: Router,
    translate: TranslateService) {
      super(translate);
    translate.setDefaultLang('en');
    translate.use('rs');
  }

  ngOnInit(): void {
    const {translate} = this;

    translate.use('rs');

    this.cols = [];

    this.userCardColumnService.findAll(Grid.USER_CARD).then(columns => {
      this.cols = [...this.cols, ...columns];
    });

    this.loading = true;

    this.routeService.getRoutesAsOptions().then(routes => {
      this.routes = routes;
    });

    this.addressService.getAddresssAsOptions().then(addresses => {
      this.addresses = addresses;
    });

    this.readingBookService.getReadingBooksAsOptions().then(readingBooks => {
      this.readingBooks = readingBooks;
    });

    this.municipalityService.getMunicipalitiesAsOptions().then(municipalities => {
      this.municipalities = municipalities;
    });


    translate.get('Current').subscribe(value => {
      this.displayTypes = [{value: 1, label:  translate.instant('Current')}, {value: 2, label: translate.instant('Historical')}];
    });


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

  get zoneDevice$() {
    return of(this.zoneDevice);
  }

  handleZoneDeviceChange(event: any) {
    this.zoneDevice = !this.zoneDevice;
  }

  get cols$(): Observable<any[]> {
    return of(this.cols);
  }

  get sumUsageCurrent$(){
    return of(this.sumUsageCurrent);
  }

  get sumUsageCurrentReverse$(){
    return of(this.sumUsageCurrentReverse);
  }

  get sumUsageCurrentMonth$(){
    return of(this.sumUsageCurrentMonth);
  }

  get sumUsageAverage$(){
    return of(this.sumUsageAverage);
  }

  get sumDiffLastRead$(){
    return of(this.sumDiffLastRead);
  }

  get displayId$() {
    return of(this.id)  ;
  }

  get displayGraph$() {
    return of(this.displayGraph);
  }

  private getSummaryData() {
    if (this.page === 0) {
      this.userCardService.findSumBy(this.getSearchCriteria()).then((dto: UserCardUsage) => {
        this.sumUsageCurrent = dto.usageCurrent;
        this.sumUsageCurrentReverse = dto.usageCurrentReverse;
        this.sumUsageCurrentMonth = dto.usageCurrentMonth;
        this.sumUsageAverage = dto.usageAverage;
        this.sumDiffLastRead = dto.diffLastRead;

        this.data = {
          labels: ['Usage'],
          datasets: [
            {
                label: 'Ukupna',
                backgroundColor: '#9CCC65',
                borderColor: '#7CB342',
                data: [this.sumUsageCurrent],
                width: '200px',
                height: '50px'
            },
            {
                label: 'Mesecna',
                backgroundColor: '#42A5F5',
                borderColor: '#1E88E5',
                data: [this.sumUsageCurrentMonth]
            },
            {
              label: 'Prosek',
              backgroundColor: '#ffc77d',
              borderColor: '#AFFFFF',
              data: [this.sumUsageAverage]
            },
            {
            label: 'Stanje',
            backgroundColor: '#03DAC5',
            borderColor: '#1E88E5',
            data: [this.sumDiffLastRead]
            },
            {
              label: 'Reverzna',
              backgroundColor: '#eaed87',
              borderColor: '#AFFFFF',
              data: [this.sumUsageCurrentReverse]
            }
          ]}

      });
    }
  }

  private loadPage(page: number, size: number, sort?: string) {
    const pageable = { page, size, sort};
    this.userCardService.findBy(this.getSearchCriteria(), pageable).then((ngresp: NgPrimeGridResponse) => {
      this.userCards = ngresp.data;
      this.totalRecords = ngresp.totalRecords;
      this.loading = false;
    });

    this.getSummaryData();
  }

  loadUserCardsLazy(event: LazyLoadEvent) {
    this.loading = true;
    this.sortBy = event.sortField === undefined ? 'id' : event.sortField === 'city' ? 'cityId' : event.sortField;
    this.sortOrder = event.sortOrder === -1 ? 'desc' : 'asc';
    this.page = event.first / event.rows;
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

   onCustomerNameClick(data: any) {
     if (data.column === 'customerName') {
      this.displayDialog = true;
      this.id = data.row.id;
     } else if (data.column === 'address') {
       this.addresses.forEach(add => {
         if (add.label === data.row.address) {
          this.address = add.value;
          return;
         }
       })

     } else if (data.column === 'gsmId') {
      this.gsmId = data.row.gsmId;
     }
  }

  fontWeight(rowData: any[], columnName: string) {
    if (columnName !== 'diffLastRead') {
      return 'normal';
    } else {
      const status = rowData[`diffLastReadColor`];

      return (status > 0) ? 'bold' : 'normal';
    }
  }

  styleColor(rowData: any[], columnName: string) {
    if (columnName === 'customerId') {
      return '#263238';
    } else if (columnName !== 'diffLastRead' && columnName != 'customerName') {
      return null;
    } else {
      const status = rowData[`diffLastReadColor`];

      return (status > 0) ? 'red' : null;
    }
  }

  search () {
    this.page = 0;
    this.userCardService.findBy(this.getSearchCriteria(), this.getPageable()).then((ngresp: NgPrimeGridResponse) => {
      this.userCards = ngresp.data;
      this.totalRecords = ngresp.totalRecords;
      this.loading = false;
    });

    this.getSummaryData();
  }

  getSearchCriteria() {
    const {
      displayType,
      customerName,
      customerId,
      deviceId,
      gsmId,
      address,
      route,
      municipality,
      readingBook,
      usageCurrentFrom,
      usageCurrentTo,
      usageReverseFrom,
      usageReverseTo,
      dateFrom,
      dateTo,
      zoneDevice
    } = this;

  return {displayType,
          customerName,
          customerId,
          deviceId,
          gsmId,
          address: address ? address.toString() : undefined,
          route: route ? route.toString() : undefined,
          municipality: municipality ? municipality.toString() : undefined,
          readingBook: readingBook ? readingBook.toString() : undefined,
          usageCurrentFrom,
          usageCurrentTo,
          usageReverseFrom,
          usageReverseTo,
          dateFrom,
          deviceType: zoneDevice ? 1 : 0,
          dateTo};

  }

  getPageable(): Pageable {
    return {page: this.page, size: this.rows, sort: `${this.sortBy},${this.sortOrder}`};
  }

  clear() {
    this.customerName = '';
    this.customerId = undefined;
    this.route = '';
    this.address = '';
    this.readingBook = '';
    this.municipality = '';
    this.usageCurrentFrom = undefined;
    this.usageCurrentTo = undefined;
    this.usageCurrentFrom = undefined;
    this.usageReverseTo = undefined;
    this.usageReverseFrom = undefined;
    this.deviceId = undefined;
    this.gsmId = undefined;
    this.dateFrom = undefined;
    this.dateTo = undefined;
    this.sortBy = '';
    this.sortOrder = 'asc';
    this.page = 0;
    this.zoneDevice = false;
    this.child.reset();

    this.userCardService.findBy({displayType: CURRENT_VIEW, deviceType: 0}, this.getPageable()).then((ngresp: NgPrimeGridResponse) => {
      this.userCards = ngresp.data;
      this.totalRecords = ngresp.totalRecords;
      this.loading = false;
    });

    this.getSummaryData();
  }

  onDisplayTypeChange(event) {
    console.log("VALUE", event.value);
  }

  onUserCardDialogClose(event) {
    this.displayDialog = event.value;
  }

  onUserCardGraphClose(event) {
    this.displayGraph = event.value;
  }

  onGraphButtonClick() {
    this.displaySummaries = false;
    this.displayGraph = true;
  }

  onSummariesButtonClick() {
    this.displaySummaries = true;
    this.displayGraph = true;
  }

  onReportButtonClick() {
    this.userCardService.reportBy(this.getSearchCriteria())
    .subscribe((data: any) => this.downloadFile(data, "report.pdf"));
  }

  downloadFile(data: any, fileName) {
    importedSaveAs(new Blob([data], { type: 'application/pdf' }), fileName);
  }

  onExportButtonClick() {
    this.router.navigate(['/pages/export-user-card']);
  }
}

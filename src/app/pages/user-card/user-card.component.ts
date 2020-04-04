import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { Table } from 'primeng/table';

import { UserCard } from '../../domain/user-card';
import { UserCardService } from '../../service/user-card.service';
import { of, Observable } from 'rxjs';


@Component({
  selector: 'ngx-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css'],

})
export class UserCardComponent implements OnInit {

  datasource: UserCard[];
  userCards: UserCard[];
  totalRecords: number;
  cols: any[];
  isResisable: boolean = true;
  loading: boolean;
  @ViewChild('table', {static: false}) table: Table;
  selectedUserCard: UserCard;

  constructor(private userCardService: UserCardService, translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('rs');
  }

  ngOnInit(): void {
    this.userCardService.getUserCards().then(userCards => {
      this.datasource = userCards;
      this.totalRecords = this.datasource.length;
    }) ;

    this.cols = [
      { field: 'id', header: 'ID', width: '50px' },
      { field: 'customerId', header: 'Customer ID', width: '150px' },
      { field: 'customerName', header: 'Customer name', width: '250px' },
      { field: 'address', header: 'Address', width: '200px' },
      { field: 'addressNo', header: 'Address number', width: '90px' },
      { field: 'addressNo2', header: 'Address number 2', width: '90px' },
      { field: 'deviceId', header: 'Device ID', width: '150px' },
      { field: 'gsmId', header: 'ADOGSM-2 ID', width: '150px' },
      { field: 'wmbusId', header: 'WMBUS ID', width: '150px' },
      { field: 'medium', header: 'Medium', width: '100px' },
      { field: 'custmerRemarks', header: 'Customer remarks', width: '250px' },
      { field: 'siteRemarks', header: 'Site remarks', width: '250px' },
      { field: 'routeRemarks', header: 'Route Remarks', width: '250px' },
      { field: 'route', header: 'Route', width: '200px' },
      { field: 'adogsmLocation', header: 'AdoGsm location', width: '250px' },
      { field: 'adogsmRemarks', header: 'AdoGsm remarks', width: '250px' },
      { field: 'multiplier', header: 'Multiplier', width: '100px' },
      { field: 'readTimestamp', header: 'Read Datetime', width: '200px' },
      { field: 'watermeterStatus', header: 'Watermeter Status', width: '200px' },
      { field: 'reverseFLowStatus', header: 'Reverse Flow Status', width: '200px' },
      { field: 'diffLastRead', header: 'Difference from last reading', width: '350px' },
      { field: 'readDayStatus', header: 'Status on day of reading', width: '300px' },
      { field: 'magneticSabotageTime', header: 'Magnetic sabotage time', width: '250px' },
      { field: 'signalStrength', header: 'Signal Strength', width: '150px' },
      { field: 'alarms', header: 'Alarms', width: '120px' },
      { field: 'mainBattery', header: 'Main Battery', width: '150px' },
      { field: 'gmsBattery', header: 'GSM Battery', width: '150px' },
    ];

    /*
    this.cols.forEach(col => {
      if (col.field !== 'addressNo' && col.field !== 'addressNo2' && col.field !== 'address') {
        col.width = `${ this.translate.instant(col.header).length * 11 + 40}px`;
      }
    });
    */

    this.loading = true;
  }

  get cols$(): Observable<any[]> {
    return of(this.cols);
  }

  loadUserCardsLazy(event: LazyLoadEvent) {
    this.loading = true;

    // in a real application, make a remote request to load data using state metadata from event
    // event.first = First row offset
    // event.rows = Number of rows per page
    // event.sortField = Field name to sort with
    // event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    // filters: FilterMetadata object having field as key and filter value, filter matchMode as value

    // imitate db connection over a network
    setTimeout(() => {
        if (this.datasource) {
            this.userCards = this.datasource.slice(event.first, (event.first + event.rows));
            this.loading = false;
        }
    }, 1000);
  }

  resetSort() {
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();
   }

   onImportClick() {
      alert('onImportClick');
   }
}

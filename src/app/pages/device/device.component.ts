import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { Table } from 'primeng/table';
import { UserCard } from '../../domain/user-card';
import { UserCardService } from '../../service/user-card.service';
import { of, Observable } from 'rxjs';
import { UserCardColumnService } from '../../service/user-card-column.service';
import { NgPrimeGridResponse } from '../../domain/ngprime-grid-response';
import { Grid } from '../../domain/grid';
import { DeviceType } from '../../domain/device-type';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css'],

})
export class DeviceComponent implements OnInit {

  userCards: UserCard[];
  totalRecords: number;
  cols: any[];
  isResisable: boolean = true;
  loading: boolean;
  @ViewChild('table', {static: false}) table: Table;
  selectedUserCard: UserCard;

  constructor(
    private userCardService: UserCardService,
    private userCardColumnService: UserCardColumnService,
    private router: Router,
    translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('rs');
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'id', header: 'ID', width: '50px' },
    ];

    this.userCardColumnService.findAll(Grid.DEVICE_GSM).then(columns => {
      this.cols = [...this.cols, ...columns];
    });

    this.loading = true;
  }

  get cols$(): Observable<any[]> {
    return of(this.cols);
  }

  private loadPage(page: number, size: number, sort?: string) {
    const pageable = { page, size, sort};
    this.userCardService.findAllByDeviceType(DeviceType.DEVICE_GSM, pageable).then((ngresp: NgPrimeGridResponse) => {
      this.userCards = ngresp.data;
      this.totalRecords = ngresp.data.length * ngresp.totalPages;
      this.loading = false;
    });
  }

  loadUserCardsLazy(event: LazyLoadEvent) {
    this.loading = true;
    const sortBy = event.sortField === undefined ? 'id' : event.sortField === 'city' ? 'cityId' : event.sortField;
    const sortOrder = event.sortOrder === -1 ? 'desc' : 'asc';
    this.loadPage(event.first / event.rows, event.rows, sortBy + ',' + sortOrder);
  }

  resetSort() {
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();
   }

   onImportClick() {
    this.router.navigate(['/pages/import-user-card']);
   }
}

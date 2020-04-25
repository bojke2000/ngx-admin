import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { Table } from 'primeng/table';
import { Observable, of } from 'rxjs';
import { AbstractComponent } from '../../AbstractComponent';
import { DeviceType } from '../../domain/device-type';
import { Grid } from '../../domain/grid';
import { NgPrimeGridResponse } from '../../domain/ngprime-grid-response';
import { UserCard } from '../../domain/user-card';
import { UserCardColumnService } from '../../service/user-card-column.service';
import { UserCardService } from '../../service/user-card.service';

@Component({
  selector: 'ngx-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css'],

})
export class DeviceComponent extends AbstractComponent implements OnInit {
  deviceForm: FormGroup;
  device = { name: undefined, password: undefined };
  displayDialog: boolean;
  submitted = false;

  userCards: UserCard[];
  totalRecords: number;
  cols: any[];
  isResisable: boolean = true;
  loading: boolean;
  @ViewChild('table', { static: false }) table: Table;
  selectedUserCard: UserCard;

  constructor(
    private formBuilder: FormBuilder,
    private userCardService: UserCardService,
    private userCardColumnService: UserCardColumnService,
    private router: Router,
    translate: TranslateService) {
    super(translate);
  }

  ngOnInit(): void {

    this.deviceForm = this.formBuilder.group({
      customerId: ['', [Validators.required]],
      regNr: [''],
      regNr2: [''],
      customerName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      addressNo: ['', [Validators.required]],
      addressNo2: [''],
      route: ['', [Validators.required]],
      readingBook: ['', [Validators.required]],
      variance: ['', [Validators.required]],
      customerRemarks: [''],
      siteRemarks: [''],
      routeRemarks: [''],
      gsmRemarks: [''],
      deviceNo: ['', [Validators.required]],
      deviceId: ['', [Validators.required]],
      profile: ['', [Validators.required]],
      medium: ['', [Validators.required]],
      gsmLongitude: [''],
      gsmLatitude: [''],
      multiplier: ['', [Validators.required]],
      gsmId: [''],
    });

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

  get f() { return this.deviceForm.controls; }


  private loadPage(page: number, size: number, sort?: string) {
    const pageable = { page, size, sort };
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

  showDialogToAdd() {
    this.device = { name: 'Test', password: 'Password' };
    this.displayDialog = true;
  }

  showDialogToEdit() {
    this.displayDialog = true;
  }

  save() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.deviceForm.invalid) {
      return;
    }
  }

  delete() {
    alert('Delete FIXME');
  }
}

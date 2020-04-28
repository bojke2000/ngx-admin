import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { Dropdown } from 'primeng/dropdown';
import { Table } from 'primeng/table';
import { Observable, of } from 'rxjs';
import { AbstractComponent } from '../../AbstractComponent';
import { Grid } from '../../domain/grid';
import { NgPrimeGridResponse } from '../../domain/ngprime-grid-response';
import { UserCard } from '../../domain/user-card';
import { MunicipalityService } from '../../service/municipailty.service';
import { ReadingBookService } from '../../service/reading-book.service';
import { UserCardColumnService } from '../../service/user-card-column.service';
import { UserCardService } from '../../service/user-card.service';
import { Option } from './../../domain/option';
import { RouteService } from './../../service/route.service';

@Component({
  selector: 'ngx-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css'],
})
export class DeviceComponent extends AbstractComponent implements OnInit {
  deviceForm: FormGroup;
  device: UserCard = undefined;
  displayDialog: boolean;
  submitted = false;
  zoneDevice  = false;
  routes: Option[];
  readingBooks: Option[];
  municipalities: Option[];
  modes: Option[];
  profiles: Option[];
  meduiums: Option[];
  units: Option[];
  multipliers: Option[];
  indexes: Option[];

  userCards: UserCard[];
  totalRecords: number;
  cols: any[];
  isResisable: boolean = true;
  loading: boolean;
  @ViewChild('table', { static: false }) table: Table;
  selectedUserCard: UserCard;

  @ViewChild('ddStatus')
  routeStatus: Dropdown;

  @ViewChild('ddReadingBookStatus')
  readingBookStatus: Dropdown;

  @ViewChild('ddMunicipalityStatus')
  ddMunicipalityStatus: Dropdown;

  @ViewChild('ddModeStatus')
  ddModeStatus: Dropdown;

  @ViewChild('dddMultiplierStatus')
  ddMultiplierStatus: Dropdown;

  constructor(
    private formBuilder: FormBuilder,
    private userCardService: UserCardService,
    private userCardColumnService: UserCardColumnService,
    private routeService: RouteService,
    private readingBookService: ReadingBookService,
    private municipalityService: MunicipalityService,
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
      municipality: ['', [Validators.required]],
      route: ['', [Validators.required]],
      readingBook: ['', [Validators.required]],
      variance: ['20', [Validators.required]],
      customerRemarks: [''],
      siteRemarks: [''],
      routeRemarks: [''],
      gsmRemarks: [''],
      deviceNo: ['', [Validators.required]],
      deviceId: ['', [Validators.required]],
      mode: ['', [Validators.required]],
      profile: ['', [Validators.required]],
      medium: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      gsmLongitude: [''],
      gsmLatitude: [''],
      multiplier: ['', [Validators.required]],
      gsmId: [''],
      zoneDevice: [null],
      indexa: [''],
      indexb: [''],
      indexc: [''],
      indexd: [''],
    });

    this.routeService.getRoutesAsOptions().then(routes => {
      this.routes = routes;
    });

    this.readingBookService.getReadingBooksAsOptions().then(readingBooks => {
      this.readingBooks = readingBooks;
    });

    this.municipalityService.getMunicipalitiesAsOptions().then(municipalities => {
      this.municipalities = municipalities;
    });

    this.modes = [
        {label: 'Mode A', value: '0'},
        {label: 'Mode B', value: '1'},
        {label: 'Mode C', value: '2'},
    ];

    this.profiles = [
      {label: 'DN15', value: 'DN15'},
      {label: 'DN25', value: 'DN25'},
      {label: 'DN32', value: 'DN32'},
      {label: 'DN40', value: 'DN40'},
      {label: 'DN50', value: 'DN50'},
      {label: 'DN80', value: 'DN80'},
      {label: 'DN100', value: 'DN100'},
      {label: 'DN150', value: 'DN150'},
      {label: 'DN200', value: 'DN200'},
    ];


    this.meduiums = [
      {label: this.translate.instant('Cold Water'), value: '0'},
      {label: this.translate.instant('Hot Water'), value: '1'},
      {label: this.translate.instant('Gasoline'), value: '2'},
    ];

    this.units = [
      {label: '㎥ ', value: '0'},
      {label: 'L ', value: '1'},
    ];

    this.multipliers = [
      {label: '0.001 ', value: '0.001'},
      {label: '0.010', value: '0.010'},
      {label: '0.100', value: '0.100'},
    ];

    this.indexes = [
      {label: this.translate.instant('Direct'), value: '0'},
      {label: this.translate.instant('Reverse'), value: '1'},
      {label: this.translate.instant('Preasure'), value: '2'},
      {label: this.translate.instant('Temperature'), value: '3'},
    ];

    this.cols = [
      { field: 'id', header: 'ID', width: '50px' },
    ];

    this.userCardColumnService.findAll(Grid.USER_CARD).then(columns => {
      this.cols = [...this.cols, ...columns];
    });

    this.loading = true;
  }

  get routes$() {
    return of(this.routes);
  }

  get zoneDevice$() {
    return of(this.zoneDevice);
  }

  get cols$(): Observable<any[]> {
    return of(this.cols);
  }

  get f() { return this.deviceForm.controls; }


  private loadPage(page: number, size: number, sort?: string) {
    const pageable = { page, size, sort };
    this.userCardService.findAllByDeviceType(Grid.USER_CARD, pageable).then((ngresp: NgPrimeGridResponse) => {
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
    this.device = {
      id : undefined,
      customerId : undefined,
      regNr : undefined,
      regNr2 : undefined,
      customerName : undefined,
      address : undefined,
      addressNo : undefined,
      addressNo2 : undefined,
      municipality : undefined,
      route : undefined,
      readingBook : undefined,
      variance : undefined,

      deviceNo : undefined,
      deviceId : undefined,
      profile : undefined,
      medium : undefined,
      mode : undefined,
      multiplier : undefined,
      unit: undefined,

      gsmId : undefined,
      gsmLongitude : undefined,
      gsmLatitude : undefined,

      readTimestamp : undefined,
      watermeterStatus : undefined,
      reverseFlowStatus : undefined,
      diffLastRead : undefined,
      readDayStatus : undefined,
      magneticSabotageTime : undefined,

      signalLevel : undefined,
      alarms : undefined,
      mainBattery : undefined,
      gsmBattery : undefined,

      customerRemarks : undefined,
      siteRemarks : undefined,
      routeRemarks : undefined,
      gsmRemarks : undefined,

      deviceType : undefined,
      indexa : undefined,
      indexb : undefined,
      indexc : undefined,
      indexd : undefined,
    };
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

    this.device = {...this.deviceForm.value};

    this.device.municipality = this.getValue(this.device.municipality);
    this.device.readingBook = this.getValue(this.device.readingBook);
    this.device.route = this.getValue(this.device.route);
    this.device.unit = this.getValue(this.device.unit);
    this.device.mode = this.getValue(this.device.mode);
    this.device.multiplier = this.getValue(this.device.multiplier);
    this.device.profile = this.getValue(this.device.profile);
    if (this.zoneDevice) {
      this.device.deviceType = 1;
      this.device.indexa = this.getValue(this.device.indexa);
      this.device.indexb = this.getValue(this.device.indexb);
      this.device.indexc = this.getValue(this.device.indexc);
      this.device.indexd = this.getValue(this.device.indexd);
    }

    this.userCardService.saveUser(this.device);

  }

  getValue(value: any): string {
    if (value === undefined) {
      return value;
    } else if (value === 'string' || value instanceof String) {
      return value;
    } else if (value.hasOwnProperty('value')) {
      return value.value;
    }
  }

  delete() {
    alert('Delete FIXME');
  }

  handleChange(event: any) {
    this.zoneDevice = !this.zoneDevice;
  }

  onRouteChange(evt) {
    this.routeStatus.filled = true;
  }

  onReadingBookChange(evt) {
    this.readingBookStatus.filled = true;
  }

  onMunicipalityChange(evt) {
    this.ddMunicipalityStatus.filled = true;
  }

  onModeChange(evt) {
    this.ddModeStatus.filled = true;
  }

  onProfileChange(evt) {
    switch (evt.value.value) {
      case 'DN15':
      case 'DN20':
      case 'DN25':
        this.deviceForm.patchValue({multiplier: this.multipliers[0]});
        break;
      case 'DN32':
      case 'DN40':
        this.deviceForm.patchValue({multiplier: this.multipliers[1]});
        break;
      case 'DN50':
      case 'DN65':
      case 'DN80':
      case 'DN100':
      case 'DN150':
      case 'DN200':
        this.deviceForm.patchValue({multiplier: this.multipliers[2]});
        break;
    }
  }
}

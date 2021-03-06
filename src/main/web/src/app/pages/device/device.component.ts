import * as _ from "lodash";

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, SelectItem } from 'primeng/api/public_api';
import { Observable, of } from 'rxjs';

import { AbstractComponent } from '../../AbstractComponent';
import { AddressService } from '../../service/address.service';
import { Dropdown } from 'primeng/dropdown';
import { Grid } from '../../domain/grid';
import { MunicipalityService } from '../../service/municipailty.service';
import { NgPrimeGridResponse } from '../../domain/ngprime-grid-response';
import { NgxTableComponent } from '../../libs/toolbox-components/ngx-table/ngx-table.component';
import { Option } from './../../domain/option';
import { ReadingBookService } from '../../service/reading-book.service';
import { RouteService } from './../../service/route.service';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { TranslateService } from '@ngx-translate/core';
import { UserCard } from '../../domain/user-card';
import { UserCardColumnService } from '../../service/user-card-column.service';
import { UserCardService } from '../../service/user-card.service';
import { takeUntil } from 'rxjs/operators';

const CURRENT_VIEW = 1;

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
  routes: SelectItem[];
  addresses: SelectItem[];
  readingBooks: SelectItem[];
  municipalities: SelectItem[];
  modes: Option[];
  profiles: Option[];
  meduiums: Option[];
  units: Option[];
  multipliers: Option[];
  indexes: Option[];
  pageable: {};

  // search
  customerName: string;
  address: string;
  deviceId: string;
  gsmId: string;
  displayType: number = 1;
  // search end

   // state of pagination
   sortBy: string;
   sortOrder: string;
   page: number;
   rows: number;
   // state of pagination end

  userCards: UserCard[];
  totalRecords: number;
  cols: any[];
  isResisable: boolean = true;
  loading: boolean;
  @ViewChild('table', { static: false }) table: Table;
  selectedUserCard: UserCard;

  @ViewChild('ddStatus')
  routeStatus: Dropdown;

  @ViewChild('ddAddressStatus')
  addressStatus: Dropdown;

  @ViewChild('ddReadingBookStatus')
  readingBookStatus: Dropdown;

  @ViewChild('ddMunicipalityStatus')
  ddMunicipalityStatus: Dropdown;

  @ViewChild('ddModeStatus')
  ddModeStatus: Dropdown;

  @ViewChild('dddMultiplierStatus')
  ddMultiplierStatus: Dropdown;

  @ViewChild(NgxTableComponent)
  child: NgxTableComponent;

  constructor(
    private formBuilder: FormBuilder,
    private userCardService: UserCardService,
    private userCardColumnService: UserCardColumnService,
    private routeService: RouteService,
    private addressService: AddressService,
    private readingBookService: ReadingBookService,
    private municipalityService: MunicipalityService,
    private router: Router,
    translate: TranslateService) {
    super(translate);
  }

  ngOnInit(): void {

    this.deviceForm = this.formBuilder.group({
      id: [''],
      customerId: ['', [Validators.required]],
      regNr: [''],
      regNr2: [''],
      customerName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      addressNo: [''],
      addressNo2: [''],
      municipality: [''],
      route: [''],
      readingBook: [''],
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

    this.loadStaticData();

    this.modes = [
        {label: 'Mode A', value: '0'},
        {label: 'Mode B', value: '1'},
        {label: 'Mode C', value: '2'},
    ];

    this.profiles = [
      {label: 'DN15', value: '0'},
      {label: 'DN25', value: '1'},
      {label: 'DN32', value: '2'},
      {label: 'DN40', value: '3'},
      {label: 'DN50', value: '4'},
      {label: 'DN80', value: '5'},
      {label: 'DN100', value: '6'},
      {label: 'DN150', value: '7'},
      {label: 'DN200', value: '8'},
    ];

    this.meduiums = [
      {label: 'Cold Water', value: '0'},
      {label: 'Hot Water', value: '1'},
      {label: 'Gasoline', value: '2'},
    ];

    this.units = [
      {label: 'm3', value: '0'},
      {label: 'Litre', value: '1'},
    ];

    this.multipliers = [
      {label: '0.1', value: '0.1'},
      {label: '0.01', value: '0.01'},
      {label: '0.001', value: '0.001'},
      // {label: '0.010', value: '0.010'},
      // {label: '0.100', value: '0.100'},
    ];

    this.indexes = [
      {label: '', value: undefined},
      {label: 'Direct', value: '0'},
      {label: 'Reverse', value: '1'},
      {label: 'Pressure', value: '2'},
      {label: 'Temperature', value: '3'},
    ];

    this.cols = [];

    this.userCardColumnService.findAll(Grid.DEVICE).then(columns => {
      this.cols = [...this.cols, ...columns];
    });

    this.loading = true;
  }

  get routes$() {
    return of(this.routes);
  }

  get addresses$() {
    return of(this.addresses);
  }

  get municipalities$() {
    return of(this.municipalities);
  }

  get readingBooks$() {
    return of(this.readingBooks);
  }

  get zoneDevice$() {
    return of(this.zoneDevice);
  }

  get cols$(): Observable<any[]> {
    return of(this.cols);
  }

  get f() { return this.deviceForm.controls; }

  private loadPageable() {
    this.userCardService.findBy(this.getSearchCriteria(), this.pageable).then((ngresp: NgPrimeGridResponse) => {
      this.userCards = ngresp.data;
      this.totalRecords = ngresp.totalRecords;
      this.loading = false;
    });
  }

   private loadPage(page: number, size: number, sort?: string) {
    this.pageable = { page, size, sort};
    this.userCardService.findBy(this.getSearchCriteria(), this.pageable).then((ngresp: NgPrimeGridResponse) => {
      this.userCards = ngresp.data;
      this.totalRecords = ngresp.totalRecords;
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
    this.submitted = false;
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
      usageCurrent : undefined,
      usageCurrentReverse : undefined,
      usageAverage: undefined,
      diffLastRead : undefined,
      usageCurrentMonth : undefined,
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
    this.deviceForm.patchValue({...this.device});
    this.displayDialog = true;
  }

  showDialogToEdit() {
      this.submitted = false;
      this.deviceForm.patchValue({...this.device});

      let selected = this.modes.filter(mode => mode.label === this.device.mode.toString());
      this.deviceForm.patchValue({mode: selected && selected.length > 0 ? selected[0] : undefined});
      selected = this.meduiums.filter(medium => medium.label === this.device.medium.toString());
      this.deviceForm.patchValue({medium: selected && selected.length > 0 ? selected[0] : undefined});

      if (this.device.unit) {
        selected = this.units.filter(unit => unit.label === this.device.unit.toString());
        this.deviceForm.patchValue({unit: selected && selected.length > 0 ? selected[0] : undefined});
      }
      selected = this.profiles.filter(profile => profile.label === this.device.profile.toString());
      this.deviceForm.patchValue({profile: selected && selected.length > 0 ? selected[0] : undefined});

      selected = this.multipliers.filter(multiplier => parseInt(multiplier.value) === parseInt(this.device.multiplier.toString()));
      this.deviceForm.patchValue({multiplier: selected && selected.length > 0 ? selected[0] : undefined});

      this.zoneDevice = (this.device.deviceType && this.device.deviceType > 0) ? true : false;

      if (!_.isNil(this.device.indexa)) {
        selected = this.indexes.filter(index => index.label === this.device.indexa);
        this.deviceForm.patchValue({indexa: selected && selected.length > 0 ? selected[0] : undefined});
      }

      if (!_.isNil(this.device.indexb)) {
        selected = this.indexes.filter(index => index.label === this.device.indexb);
        this.deviceForm.patchValue({indexb: selected && selected.length > 0 ? selected[0] : undefined});
      }

      if (!_.isNil(this.device.indexc)) {
        selected = this.indexes.filter(index => index.label === this.device.indexc);
        this.deviceForm.patchValue({indexc: selected && selected.length > 0 ? selected[0] : undefined});
      }

      if (!_.isNil(this.device.indexd)) {
        selected = this.indexes.filter(index => index.label === this.device.indexd);
        this.deviceForm.patchValue({indexd: selected && selected.length > 0 ? selected[0] : undefined});
      }

      this.readingBookStatus.filled = true;
      this.ddMunicipalityStatus.filled = true;
      this.routeStatus.filled = true;
      this.addressStatus.filled = true;

      this.displayDialog = true;
  }

  save() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.deviceForm.invalid) {
      return;
    }

    this.device = {...this.deviceForm.value};

    this.device.municipality = this.getLabel(this.device.municipality);
    this.device.readingBook = this.getLabel(this.device.readingBook);
    this.device.route = this.getLabel(this.device.route);
    this.device.address = this.getLabel(this.device.address);

    this.device.unit = this.getLabel(this.device.unit);
    this.device.mode = this.getLabel(this.device.mode);
    this.device.multiplier = this.getValue(this.device.multiplier);
    this.device.profile = this.getLabel(this.device.profile);
    this.device.medium = this.getLabel(this.device.medium);

    if (this.zoneDevice) {
      this.device.deviceType = 1;
      this.device.indexa = _.isNil(this.device.indexa) ? undefined : this.getLabel(this.device.indexa);
      this.device.indexb = _.isNil(this.device.indexb) ? undefined : this.getLabel(this.device.indexb);
      this.device.indexc = _.isNil(this.device.indexc) ? undefined : this.getLabel(this.device.indexc);
      this.device.indexd = _.isNil(this.device.indexd) ? undefined : this.getLabel(this.device.indexd);
    }

    this.userCardService.saveUser(this.device)
      .pipe(takeUntil(this.destroy$)).subscribe(val => {

        this.loadPageable();
        this.loadStaticData();
      });


    if (!this.device.id) {
      this.submitted = false;
      this.readingBookStatus.filled = true;
      this.ddMunicipalityStatus.filled = true;
      this.routeStatus.filled = true;
      this.addressStatus.filled = true;
    } else {
      this.displayDialog = false;
    }
  }

  get device$() {
    return of(this.device);
  }

  close () {
    this.displayDialog = false;
  }

  delete() {
     this.userCardService.deleteUserCard(this.device)
     .pipe(takeUntil(this.destroy$)).subscribe(val => {
      this.displayDialog = false;
      this.loadPageable();
     });
  }

  loadStaticData() {
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
  }

  getValue(value: any): any {
    if (value === undefined) {
      return value;
    } else if (typeof value === 'string' || value instanceof String) {
        return value;
    } else if (value.hasOwnProperty('value')) {
      return value.value;
    }
  }

  getLabel(selection: any): any {
    if (selection === undefined) {
      return selection;
    } else if (typeof selection === 'string' || selection instanceof String) {
      return selection;
    } else if (selection.hasOwnProperty('value')) {
      return selection.label;
    }
  }

  handleChange(event: any) {
    this.zoneDevice = !this.zoneDevice;
  }

  onRouteChange(evt) {
    this.routeStatus.filled = true;
  }

  onAddressChange(evt) {
    this.addressStatus.filled = true;
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

  onMultiplierChange(evt) {
    switch (evt.value.label) {
      case '0.1':
        this.deviceForm.patchValue({profile: this.profiles[7]});
        break;
      case '0.01':
        this.deviceForm.patchValue({profile: this.profiles[3]});
        break;
      case '0.001':
        this.deviceForm.patchValue({profile: this.profiles[0]});
        break;
    }
  }

  onProfileChange(evt) {
    switch (evt.value.label) {
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

  onRowSelect(event: any) {
    this.device = {...event.data};
  }

  onRowUnselect(event: any) {
    this.device = undefined;
  }

  getSearchCriteria() {
    const {
      displayType,
      customerName,
      deviceId,
      gsmId,
      address,
      } = this;

  return {displayType,
          customerName,
          deviceId,
          gsmId,
          address: address ? address.toString() : undefined,
          };

  }

  clear() {
    this.customerName = '';
    this.address = '';
    this.deviceId = undefined;
    this.gsmId = undefined;
    this.sortBy = '';
    this.sortOrder = 'asc';
    this.page = 0;
    this.child.reset();

    this.userCardService.findBy({displayType: CURRENT_VIEW, deviceType: 0}, this.pageable).then((ngresp: NgPrimeGridResponse) => {
      this.userCards = ngresp.data;
      this.totalRecords = ngresp.totalRecords;
      this.loading = false;
    });
  }

  search () {
    this.page = 0;
    this.userCardService.findBy(this.getSearchCriteria(), this.pageable).then((ngresp: NgPrimeGridResponse) => {
      this.userCards = ngresp.data;
      this.totalRecords = ngresp.totalRecords;
      this.loading = false;
    });
  }

  onCustomerNameClick(data: any) {
    if (data.column === 'customerName') {
     this.customerName = data.row.customerName;
    } else if (data.column === 'address') {
      this.addresses.forEach(add => {
        if (add.label === data.row.address) {
         this.address = add.value;
         return;
        }
      })
    } else if (data.column === 'gsmId') {
     this.gsmId = data.row.gsmId;
    } else if (data.column === 'deviceId') {
      this.deviceId = data.row.deviceId;
     }
 }

}

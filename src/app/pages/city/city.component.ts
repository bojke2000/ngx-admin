import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { Table } from 'primeng/table';
import { of, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { AbstractComponent } from '../../AbstractComponent';
import { City } from '../../domain/city';
import { CityService } from '../../service/city.service';
import { RoleService } from '../../service/role.service';



@Component({
  selector: 'ngx-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css'],
})
export class CityComponent extends AbstractComponent implements OnInit, OnDestroy, AfterViewInit {
  cityForm: FormGroup;
  submitted = false;
  cities: City[];
  city: City;
  selectedCity: City;
  newCity: boolean;
  totalRecords: number;
  cols: any[];
  loading: boolean;
  citySearch: string;

  protected destroy$ = new Subject<void>();
  @ViewChild('table', { static: false }) table: Table;

  constructor(private citieservice: CityService,
    private cityService: CityService,
    private roleService: RoleService,
    translate: TranslateService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef) {
    super(translate);
  }

  ngOnInit(): void {

    this.loadCities(0, 20, 'id,asc');

    this.cols = [
      { field: 'id', header: 'ID', width: '50px' },
      { field: 'name', header: 'Name', width: '120px' },
      { field: 'country', header: 'Country', width: '120px' },
    ];

    this.cityForm = this.formBuilder.group({
      id : [''],
      name: ['', Validators.required],
    });

    const pageable = {page: 1, size: 20, sort: 'id'};
    this.cityService.getAll(pageable).then((cities: City[]) => {
      this.cities = cities;
      this.totalRecords = cities.length / 20;
    });
  }

  get loading$() {
    return of(this.loading).pipe(
      distinctUntilChanged(),
    );
  }

  get cities$() {
    return of(this.cities).pipe(
      distinctUntilChanged(),
    );
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCities(page: number, size: number, sort?: string) {
    const pageable = { page, size, sort};
    this.citieservice.getAll(pageable).then((cities: City[]) => {
      this.cities = cities;
      this.totalRecords = cities.length;
      this.loading = false;
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.cityForm.controls; }

  loadCitiesLazy(event: LazyLoadEvent) {
    this.loading = true;
    const sortBy = event.sortField === undefined ? 'id' : event.sortField === 'role' ? 'role.name' : event.sortField;
    const sortOrder = event.sortOrder === -1 ? 'desc' : 'asc';
    this.loadCities(event.first, event.rows, sortBy + ',' + sortOrder);
  }

  onCitySearch() {
    const pageable = {page: 0, size: 20, sort: 'username,asc'};
    this.loading = true;
    this.citieservice.search(this.citySearch, pageable).then((cities: City[]) => {
      this.cities = cities;
      this.totalRecords = cities.length;
      this.loading = false;
    });
  }

  resetSort() {
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();
    this.loading = false;
  }

  showDialogToAdd() {
    this.newCity = true;
    this.submitted = false;
    this.city = {
      id: undefined,
      name: undefined,
      country: undefined,
    };
    this.cityForm.patchValue({...this.city});
  }

  save() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.cityForm.invalid) {
        return;
    }

    const cities = [...this.cities];
    this.city = {...this.cityForm.value};
    if (this.newCity) {
      this.citieservice.createCity(this.city)
      .pipe(takeUntil(this.destroy$))
      .subscribe((city: City) => {
        cities.push(city);
      });
    } else {
      this.citieservice.updateCity(this.city)
      .pipe(takeUntil(this.destroy$))
      .subscribe((ua: City) => {
        cities[this.cities.indexOf(this.selectedCity)] = ua;
      });
    }

    this.cities = cities;
    this.city = null;
  }

  delete() {
    const index = this.cities.indexOf(this.selectedCity);
    if (index !== 0) {
      this.citieservice.deleteCity(this.city)
      .pipe(takeUntil(this.destroy$))
      .subscribe(ua => {
        this.cities = this.cities.filter((val, i) => i !== index);
      });
    }
    this.city = null;
  }

  onRowSelect(event) {
    this.city = this.cloneCity(event.data);
  }

  onRowUnselect(event) {
    this.city = undefined;
  }

  showDialogToEdit() {
    if (this.city !== undefined) {
      this.newCity = false;
      this.submitted = false;
      this.cityForm.patchValue({...this.city});
    }

  }

  cloneCity(c: City): City {
    const city = {
      id: undefined,
      name: undefined,
      country: undefined,
    };

    for (const prop in c) {
      if (c[prop] !== undefined) {
        city[prop] = c[prop];
      }
    }

    return city;
  }
}

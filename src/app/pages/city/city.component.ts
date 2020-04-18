import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { Table } from 'primeng/table';
import { of, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';

import { AbstractComponent } from '../../AbstractComponent';
import { City } from '../../domain/city';
import { CityService } from '../../service/city.service';


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
  displayDialog: boolean;

  protected destroy$ = new Subject<void>();
  @ViewChild('table', { static: false }) table: Table;

  constructor(private citieservice: CityService,
    private cityService: CityService,
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
      country: ['', Validators.required],
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

  save() {
    this.submitted = true;
    this.displayDialog = false;

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
      .subscribe((city: City) => {
        cities[0] = city;
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
      this.displayDialog = true;
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

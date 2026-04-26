import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { AbstractComponent } from '../../AbstractComponent';
import { City } from '../../domain/city';
import { CityService } from '../../service/city.service';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { Table } from 'primeng/table';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

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
  displayConfigDialog = false;
  configValue: string = '';
  configError: string | null = null;
  editorOptions = { theme: 'vs', language: 'json', automaticLayout: true, minimap: { enabled: false } };
  private monacoEditor: any = null;

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
      { field: 'id', header: '#', width: '50px' },
      { field: 'name', header: 'Name', width: '120px' },
      { field: 'organisation', header: 'Organisation', width: '120px' },
      { field: 'address1', header: 'Address1', width: '120px' },
      { field: 'address2', header: 'Address2', width: '120px' },
      { field: 'phone', header: 'Phone', width: '120px' },
      { field: 'email', header: 'Email', width: '120px' },
      { field: 'lang', header: 'Language', width: '120px' },
    ];

    this.cityForm = this.formBuilder.group({
      id : [''],
      name: ['', Validators.required],
      organisation: [''],
      address1: [''],
      address2: [''],
      phone: [''],
      email: [''],
      lang: [''],
      config: [''],
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
      organisation: undefined,
      address1: undefined,
      address2: undefined,
      phone: undefined,
      email: undefined,
      lang: undefined,
      config: undefined,
    };

    for (const prop in c) {
      city[prop] = (c[prop] !== undefined) ? c[prop] : "";
      // if (c[prop] !== undefined) {
      //   city[prop] = c[prop];
      // }
    }

    return city;
  }

  onEditorInit(editor: any) {
    this.monacoEditor = editor;
    editor.setValue(this.configValue);
  }

  openConfigEditor() {
    this.cityService.getCityById(this.city.id)
      .then((fresh: City) => {
        this.setConfigValue((fresh && fresh.config) ? fresh.config : (this.city.config || '{}'));
        this.displayConfigDialog = true;
        this.cdr.detectChanges();
      })
      .catch((err) => {
        console.error('getCityById failed, using cached value', err);
        this.setConfigValue(this.city.config || '{}');
        this.displayConfigDialog = true;
        this.cdr.detectChanges();
      });
  }

  private setConfigValue(raw: string) {
    try {
      this.configValue = JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      this.configValue = raw;
    }
    if (this.monacoEditor) {
      this.monacoEditor.setValue(this.configValue);
    }
  }

  saveConfig() {
    const value = this.monacoEditor ? this.monacoEditor.getValue() : this.configValue;
    try {
      JSON.parse(value);
    } catch (e) {
      this.configError = 'Invalid JSON: ' + e.message;
      return;
    }
    this.configError = null;
    const updatedCity: City = { ...this.city, config: value };
    this.cityService.updateCity(updatedCity)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (saved: City) => {
          this.city = saved;
          this.cityForm.patchValue({ config: saved.config });
          this.monacoEditor = null;
          this.displayConfigDialog = false;
        },
        (err) => {
          this.configError = 'Save failed: ' + (err.message || err.status);
        }
      );
  }

  closeDialog() {
    this.cityForm.reset();
    this.city = undefined;
    this.displayDialog = false;
  }

  closeConfigEditor() {
    this.configError = null;
    this.monacoEditor = null;
    this.displayConfigDialog = false;
  }
}

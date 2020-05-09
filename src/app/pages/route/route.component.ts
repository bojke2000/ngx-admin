import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { AbstractComponent } from '../../AbstractComponent';
import { City } from '../../domain/city';
import { CityService } from '../../service/city.service';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { Route } from '../../domain/route';
import { RouteService } from '../../service/route.service';
import { Table } from 'primeng/table';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css'],
})
export class RouteComponent extends AbstractComponent implements OnInit, OnDestroy {
  routeForm: FormGroup;
  submitted = false;
  routes: Route[];
  route: Route;
  newRoute: boolean;
  totalRecords: number;
  cols: any[];
  loading: boolean;
  routeSearch: string;
  displayDialog: boolean;

  protected destroy$ = new Subject<void>();
  @ViewChild('table', { static: false }) table: Table;

  constructor(private routeservice: RouteService,
    private routeService: RouteService,
    private cityService: CityService,
    translate: TranslateService,
    private formBuilder: FormBuilder) {
    super(translate);
  }

  ngOnInit(): void {

    this.loadRoutes(0, 20, 'id,asc');

    this.cols = [
      { field: 'id', header: '#', width: '50px' },
      { field: 'name', header: 'Name', width: '120px' },
      { field: 'city', header: 'Route', width: '120px' },
    ];

    this.routeForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      city: ['', Validators.required],
    });

    const pageable = { page: 1, size: 20, sort: 'id' };
    this.routeService.getAll(pageable).then((routes: Route[]) => {
      this.routes = routes;
      this.totalRecords = routes.length / 20;
    });
  }

  get loading$() {
    return of(this.loading).pipe(
      distinctUntilChanged(),
    );
  }

  get routes$() {
    return of(this.routes).pipe(
      distinctUntilChanged(),
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadRoutes(page: number, size: number, sort?: string) {
    const pageable = { page, size, sort };
    this.routeservice.getAll(pageable).then((routes: Route[]) => {
      this.routes = routes;
      this.totalRecords = routes.length;
      this.loading = false;
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.routeForm.controls; }

  loadRoutesLazy(event: LazyLoadEvent) {
    this.loading = true;
    const sortBy = event.sortField === undefined ? 'id' : event.sortField === 'role' ? 'role.name' : event.sortField;
    const sortOrder = event.sortOrder === -1 ? 'desc' : 'asc';
    this.loadRoutes(event.first, event.rows, sortBy + ',' + sortOrder);
  }

  save() {
    this.submitted = true;
    this.displayDialog = false;

    // stop here if form is invalid
    if (this.routeForm.invalid) {
      return;
    }

    const routes = [...this.routes];
    this.route = { ...this.routeForm.value };
    if (this.newRoute) {
      this.routeservice.createRoute(this.route)
        .pipe(takeUntil(this.destroy$))
        .subscribe((route: Route) => {
          routes.push(route);
        });
    } else {
      this.routeservice.updateRoute(this.route)
        .pipe(takeUntil(this.destroy$))
        .subscribe((route: Route) => {
          routes[0] = route;
        });
    }

    this.routes = routes;
    this.route = null;
  }

  delete() {
    this.displayDialog = false;
    const index = this.routes.findIndex(x => x.id === this.route.id);
    if (index >= 0) {
      this.routeservice.deleteRoute(this.route)
        .pipe(takeUntil(this.destroy$))
        .subscribe(deleted => {
          this.routes = this.routes.filter((val, i) => i !== index);
        });
    }
    this.route = null;
  }

  onRowSelect(event) {
    this.route = this.cloneRoute(event.data);
  }

  onRowUnselect(event) {
    this.route = undefined;
  }

  showDialogToAdd() {
    this.newRoute = true;
    this.submitted = false;
    const pageable = { page: 0, size: 20, sort: 'account,asc' };
    this.cityService.getAll(pageable).then((cities: City[]) => {
      this.route = {
        id: undefined,
        name: undefined,
        city: cities[0].name,
      };
      this.routeForm.patchValue({ ...this.route });
      this.displayDialog = true;
    });
  }

  showDialogToEdit() {
    if (this.route !== undefined) {
      this.newRoute = false;
      this.submitted = false;
      this.routeForm.patchValue({ ...this.route });
      this.displayDialog = true;
    }

  }

  cloneRoute(c: Route): Route {
    const route = {
      id: undefined,
      name: undefined,
      city: undefined,
    };

    for (const prop in c) {
      if (c[prop] !== undefined) {
        route[prop] = c[prop];
      }
    }

    return route;
  }

  onFileUpload(data: { files: File }) {
    this.loading = true;
    const formData: FormData = new FormData();

    const file = data.files[0];
    formData.append('importFile', file, file.name);
    const pageable = { page: 0, size: 20, sort: 'id,asc' };
    this.routeService.upload(formData).then(() => {
      this.routeService.getAll(pageable).then((routes: Route[]) => {
        this.routes = routes;
        this.loading = false;
      });
    });
  }
}

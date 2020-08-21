import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { AbstractComponent } from '../../AbstractComponent';
import { CityService } from '../../service/city.service';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { RoleService } from '../../service/role.service';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { TranslateService } from '@ngx-translate/core';
import { UserAccount } from '../../domain/user-account';
import { UserAccountService } from '../../service/user-account.service';
import { of } from 'rxjs';

@Component({
  selector: 'ngx-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.css'],
})
export class UserAccountComponent extends AbstractComponent implements OnInit, OnDestroy, AfterViewInit {
  userAccountForm: FormGroup;
  submitted = false;
  userAccounts: UserAccount[ ]= [];
  userAccount: UserAccount = undefined;
  newUserAccount: boolean;
  displayDialog: boolean;
  totalRecords: number;
  cols: any[];
  loading: boolean;
  statuses: SelectItem[];
  roles: SelectItem[];
  cities: SelectItem[];
  accessLevels: SelectItem[];
  userSearch: string;

  constructor(private userAccountservice: UserAccountService,
    private cityService: CityService,
    private roleService: RoleService,
    translate: TranslateService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef) {
    super(translate);
  }

  ngOnInit(): void {

    this.loadUserAccounts(0, 20, 'id,asc');

    this.cols = [
      { field: 'id', header: '#', width: '50px' },
      { field: 'username', header: 'Name', width: '200px' },
      { field: 'password', header: 'Password', width: '200px' },
      { field: 'email', header: 'Email', width: '200px' },
      { field: 'city', header: 'City', width: '200px' },
      { field: 'role', header: 'Role', width: '150px' },
      { field: 'accessLevel', header: 'Access Level', width: '150px' },
      { field: 'active', header: 'Status', width: '150px' },
      { field: 'lastLogin', header: 'Last Login', width: '150px' },
    ];

    this.statuses = [{label: 'Active', value: 'Active'}, {label: 'Disabled', value: 'Disabled'}];

    this.userAccountForm = this.formBuilder.group({
      id : [''],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required,
        Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      city: [undefined, Validators.required],
      role: [undefined, Validators.required],
      accessLevel: [undefined, Validators.required],
      active: ['Active', Validators.required],

    });

    this.cityService.getCitiesAsOptions().then(cities => {
      this.cities = cities;
      this.userAccountForm.patchValue({city: this.cities[0].value});
    });

    this.roleService.getRoles().then(roles => {
        this.roles = roles;
        this.userAccountForm.patchValue({role: this.roles[0].value});
    });

    this.accessLevels = [
      {label: 'All', value: "All"},
      {label: 'Manual', value: "Manual"},
      {label: 'GSM2', value: "GSM2"},
    ];
  }

  get loading$() {
    return of(this.loading).pipe(
      distinctUntilChanged(),
    );
  }

  get userAccounts$() {
    return of(this.userAccounts).pipe(
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

  private loadUserAccounts(page: number, size: number, sort?: string) {
    const pageable = { page, size, sort};
    this.userAccountservice.getUserAccounts(pageable).then(ngresp => {
      this.userAccounts = ngresp.data;
      this.totalRecords = ngresp.totalRecords;
      this.loading = false;
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.userAccountForm.controls; }

  loadUserAccountsLazy(event: LazyLoadEvent) {
    this.loading = true;
    const sortBy = event.sortField === undefined ? 'id' : event.sortField === 'role' ? 'role.name' : event.sortField;
    const sortOrder = event.sortOrder === -1 ? 'desc' : 'asc';
    this.loadUserAccounts(event.first, event.rows, sortBy + ',' + sortOrder);
  }

  onUserSearch(event: any) {
    if (event.keyCode === 13) {
      const pageable = {page: 0, size: 20, sort: 'username,asc'};
      this.loading = true;
      this.userAccountservice.searchUserAccounts(this.userSearch, pageable).then(ngresp => {
        this.userAccounts = ngresp.data;
        this.totalRecords = ngresp.totalRecords;
        this.loading = false;
      });
    }
  }

  resetSort() {
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();
    this.loading = false;
  }

  showDialogToAdd() {
    this.newUserAccount = true;
    this.submitted = false;
    this.userAccount = {
      id: undefined,
      username: undefined,
      password: undefined,
      email: undefined,
      city: this.cities[0].value,
      role: this.roles[0].value,
      accessLevel: this.accessLevels[0].value,
      active: 'Active',
      lastLogin: undefined,
    };
    this.userAccountForm.patchValue({...this.userAccount});
    this.displayDialog = true;
  }

  save() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.userAccountForm.invalid) {
        return;
    }

    const userAccounts = [...this.userAccounts];
    this.userAccount = {...this.userAccountForm.value};
    if (this.newUserAccount) {
      this.userAccountservice.addUserAccount(this.userAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe(ua => {
        userAccounts.push(ua);
      });
    } else {
      this.userAccountservice.updateUserAccount(this.userAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe(ua => {
        const idx = this.userAccounts.map( el => el.id ).indexOf(ua.id);
        userAccounts[idx] = ua;
      });
    }

    this.userAccounts = userAccounts;
    this.userAccount = null;
    this.displayDialog = false;
  }

  delete() {
    const index = this.userAccounts.map( el => el.id ).indexOf(this.userAccount.id);
    if (index !== 0) {
      this.userAccountservice.deleteUserAccount(this.userAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe(ua => {
        this.userAccounts = this.userAccounts.filter((val, i) => i !== index);
      });
    }
    this.userAccount = null;
    this.displayDialog = false;
  }

  onRowSelect(event) {
    this.userAccount = this.cloneUserAccount(event.data);
  }

  onRowUnselect(event) {
    this.userAccount = undefined;
  }

  close () {
    this.displayDialog = false;
  }

  showDialogToEdit() {
    if (this.userAccount !== undefined) {
      this.newUserAccount = false;
      this.submitted = false;
      this.userAccountForm.patchValue({...this.userAccount});

      const selectedCity = this.cities.filter(el => el.label === this.userAccount.city);
      this.userAccountForm.patchValue({
        city: selectedCity[0].value});

      const selectedRole = this.roles.filter(el => el.label === this.userAccount.role);
      this.userAccountForm.patchValue({
        role: selectedRole[0].value});
    }

    this.displayDialog = true;
  }

  cloneUserAccount(c: UserAccount): UserAccount {
    const userAccount = {
      id: undefined,
      username: undefined,
      password: undefined,
      email: undefined,
      city: undefined,
      role: undefined,
      accessLevel: undefined,
      active: undefined,
      lastLogin: undefined,
    };

    for (const prop in c) {
      if (c[prop] !== undefined) {
        userAccount[prop] = c[prop];
      }
    }

    return userAccount;
  }
}

import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Table } from 'primeng/table';
import { AbstractComponent } from '../../abstract.component';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api/public_api';
import {SelectItem} from 'primeng/api';
import { UserAccount } from '../../domain/user-account';
import { UserAccountService } from '../../service/user-account.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {CityService} from '../../service/cityservice';
import { Option } from '../../domain/option';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.css'],
})
export class UserAccountComponent extends AbstractComponent implements OnInit, AfterViewInit {
  userAccountForm: FormGroup;
  submitted = false;
  userAccounts: UserAccount[];
  userAccount: UserAccount;
  selectedUserAccount: UserAccount;
  newUserAccount: boolean;
  displayDialog: boolean;
  totalRecords: number;
  cols: any[];
  loading: boolean;
  accountTypes: SelectItem[];
  statuses: SelectItem[];
  cities: Option[];
  userSearch: string;
  @ViewChild('table', { static: false }) table: Table;

  constructor(private userAccountservice: UserAccountService,
    private cityService: CityService,
    translate: TranslateService, private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef) {
    super(translate);
  }

  ngOnInit(): void {

    this.loadUserAccounts(0, 20, 'id,asc');

    this.cols = [
      { field: 'id', header: 'ID', width: '50px' },
      { field: 'username', header: 'Name', width: '120px' },
      { field: 'password', header: 'Password', width: '120px' },
      { field: 'email', header: 'Email', width: '150px' },
      { field: 'city', header: 'City', width: '150px' },
      { field: 'accountType', header: 'Account Type', width: '120px' },
      { field: 'active', header: 'Status', width: '120px' },
      { field: 'lastLogin', header: 'Last Login', width: '120px' },
    ];

    this.accountTypes = [
      {label: 'Select Account Type', value: null},
      {label: 'Citizen', value: 'Citizen'},
      {label: 'User', value: 'User'},
      {label: 'Admin', value: 'Admin'},
      {label: 'Superadmin', value: 'Superadmin'},
    ];

    this.statuses = [{label: 'Active', value: 'Active'}, {label: 'Disabled', value: 'Disabled'}];

    this.userAccountForm = this.formBuilder.group({
      id : [''],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required,
        Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      city: [{label: '', value: ''}, Validators.required],
      accountType: ['', Validators.required],
      active: ['Active', Validators.required],

    });

    this.cityService.getCities().then(cities => {
      this.cities = cities;
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  private loadUserAccounts(page: number, size: number, sort?: string) {
    const pageable = { page, size, sort};
    this.userAccountservice.getUserAccounts(pageable).then(ngresp => {
      this.userAccounts = ngresp.data;
      this.totalRecords = ngresp.totalPages;
      this.loading = false;
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.userAccountForm.controls; }

  loadUserAccountsLazy(event: LazyLoadEvent) {
    this.loading = true;
    const sortBy = event.sortField === undefined ? 'id' : event.sortField;
    const sortOrder = event.sortOrder === -1 ? 'desc' : 'asc';
    this.loadUserAccounts(event.first, event.rows, sortBy + ',' + sortOrder);
  }

  onUserSearch() {
    const pageable = {page: 0, size: 20, sort: 'username,asc'};
    this.loading = true;
    this.userAccountservice.searchUserAccounts(this.userSearch, pageable).then(ngresp => {
      this.userAccounts = ngresp.data;
      this.totalRecords = ngresp.totalPages;
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
    this.newUserAccount = true;
    this.submitted = false;
    this.userAccount = {
      id: undefined,
      username: undefined,
      password: undefined,
      email: undefined,
      city: undefined,
      accountType: 'User',
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
    this.userAccount.city = this.userAccountForm.value.city.label;

    if (this.newUserAccount) {
      this.userAccountservice.addUserAccount(this.userAccount).subscribe(ua => {
        userAccounts.push(ua);
      });
    } else {
      this.userAccountservice.updateUserAccount(this.userAccount).subscribe(ua => {
        userAccounts[this.userAccounts.indexOf(this.selectedUserAccount)] = ua;
      });
    }

    this.userAccounts = userAccounts;
    this.userAccount = null;
    this.displayDialog = false;
  }

  delete() {
    const index = this.userAccounts.indexOf(this.selectedUserAccount);
    if (index !== 0) {
      this.userAccountservice.deleteUserAccount(this.userAccount).subscribe(ua => {
        this.userAccounts = this.userAccounts.filter((val, i) => i !== index);
      });
    }
    this.userAccount = null;
    this.displayDialog = false;
  }

  onRowSelect(event) {
    this.newUserAccount = false;
    this.submitted = false;
    this.userAccount = this.cloneUserAccount(event.data);
    this.userAccountForm.patchValue({...this.userAccount});

    const selectedCity = this.cities.filter(el => el.label === this.userAccount.city);
    this.userAccountForm.patchValue({
      city: selectedCity[0]});

    this.displayDialog = true;
  }

  cloneUserAccount(c: UserAccount): UserAccount {
    const userAccount = {
      id: undefined,
      username: undefined,
      password: undefined,
      email: undefined,
      city: undefined,
      accountType: undefined,
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

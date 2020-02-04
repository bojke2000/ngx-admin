import { Component, ViewChild, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { AbstractComponent } from '../../abstract.component';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api/public_api';
import {SelectItem} from 'primeng/api';
import { UserAccount } from '../../domain/user-account';
import { UserAccountService } from '../../service/user-account.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserAccountTypesService } from '../../service/useraccounttypes.service';
import {CityService} from '../../service/cityservice';
import {City} from '../../domain/city';


@Component({
  selector: 'user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.css'],
})
export class UserAccountComponent extends AbstractComponent implements OnInit {
  userAccountForm: FormGroup;
  submitted = false;
  userAccounts: UserAccount[];
  userAccount: UserAccount;
  selectedUserAccount: UserAccount;
  newUserAccount: boolean;
  displayDialog: boolean;
  datasource: UserAccount[];
  totalRecords: number;
  cols: any[];
  loading: boolean;
  accountTypes: SelectItem[];
  statuses: SelectItem[];
  cities: City[];



  @ViewChild('table', { static: false }) table: Table;

  constructor(private userAccountservice: UserAccountService,
    private userAccountTypesService: UserAccountTypesService,
    private cityService: CityService,
    translate: TranslateService, private formBuilder: FormBuilder) {
    super(translate);
  }

  ngOnInit(): void {
    this.userAccountservice.getUserAccounts().then(userAccounts => {
      this.datasource = userAccounts;
      this.totalRecords = this.datasource.length;
    });
    this.cols = [
      { field: 'id', header: 'ID', width: '70px' },
      { field: 'username', header: 'Name', width: '120px' },
      { field: 'password', header: 'Password', width: '120px' },
      { field: 'email', header: 'Email', width: '150px' },
      { field: 'city', header: 'City', width: '150px' },
      { field: 'accountType', header: 'Account Type', width: '120px' },
      { field: 'active', header: 'Status', width: '120px' },
      { field: 'lastLogin', header: 'Last Login', width: '120px' },
    ];
    this.loading = true;

    this.accountTypes = [
      {label: 'Select Account Type', value: null},
      {label: 'Citizen', value: 'Citizen'},
      {label: 'User', value: 'User'},
      {label: 'Admin', value: 'Admin'},
      {label: 'Superadmin', value: 'Superadmin'},
    ];

    this.statuses = [{label: 'Active', value: 'Active'}, {label: 'Disabled', value: 'Disabled'}]


    this.userAccountForm = this.formBuilder.group({
      id : [''],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required,
        Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      city: ['', Validators.required],
      accountType: ['', Validators.required],
      active: ['Active', Validators.required],

    });
  }

      // convenience getter for easy access to form fields
  get f() { return this.userAccountForm.controls; }

  loadUserAccountsLazy(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      if (this.datasource) {
        this.userAccounts = this.datasource.slice(event.first, (event.first + event.rows));
        this.loading = false;
      }
    }, 1000);
  }

  search(event) {
    this.cityService.getCities(event).then(cities => {
        this.cities = cities;
    });
  }


  resetSort() {
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();
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

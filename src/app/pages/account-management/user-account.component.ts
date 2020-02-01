import { Component, ViewChild, OnInit } from '@angular/core';
import {Table} from 'primeng/table';
import { AbstractComponent } from '../../abstract.component';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { UserAccount } from '../../domain/user-account';
import { UserAccountService } from '../../service/user-account.service';


@Component({
    selector: 'user-account',
    templateUrl: './user-account.component.html',
    styleUrls: ['./user-account.css'],
  })
  export class UserAccountComponent extends AbstractComponent implements OnInit {
    userAccounts: UserAccount[];
    userAccount: UserAccount;
    selectedUserAccount: UserAccount;
    newUserAccount: boolean;
    displayDialog: boolean;
    datasource: UserAccount[];
    totalRecords: number;
    cols: any[];
    loading: boolean;
  @ViewChild('table', {static: false}) table: Table;

    constructor(private userAccountservice: UserAccountService, translate: TranslateService) {
      super(translate);
    }

    ngOnInit(): void {
      this.userAccountservice.getUserAccounts().then(userAccounts => {
        this.datasource = userAccounts;
        this.totalRecords = this.datasource.length;
      }) ;
      this.cols = [
        { field: 'id', header: 'ID', width: '70px' },
        { field: 'username', header: 'Name' , width: '120px' },
        { field: 'password', header: 'Password' , width: '120px' },
        { field: 'email', header: 'Email' , width: '150px' },
        { field: 'city', header: 'City' , width: '150px' },
        { field: 'accountType', header: 'Account Type' , width: '120px' },
        { field: 'active', header: 'Status' , width: '120px' },
        { field: 'lastLogin', header: 'Last Login' , width: '120px' },
      ];
      this.loading = true;
    }

    loadUserAccountsLazy(event: LazyLoadEvent) {
      this.loading = true;
      setTimeout(() => {
          if (this.datasource) {
              this.userAccounts = this.datasource.slice(event.first, (event.first + event.rows));
              this.loading = false;
          }
      }, 1000);
    }

    resetSort() {
      this.table.sortOrder = 0;
      this.table.sortField = '';
      this.table.reset();
     }

     showDialogToAdd() {
      this.newUserAccount = true;
      this.userAccount = { id: undefined,
        username: undefined,
        password: undefined,
        email: undefined,
        city: undefined,
        accountType: undefined,
        active: undefined,
        lastLogin: undefined};
      this.displayDialog = true;
  }

  save() {
      const userAccounts = [...this.userAccounts];
      if (this.newUserAccount)
          userAccounts.push(this.userAccount);
      else
          userAccounts[this.userAccounts.indexOf(this.selectedUserAccount)] = this.userAccount;

      this.userAccounts = userAccounts;
      this.userAccount = null;
      this.displayDialog = false;
  }

  delete() {
      const index = this.userAccounts.indexOf(this.selectedUserAccount);
      this.userAccounts = this.userAccounts.filter((val, i) => i !== index);
      this.userAccount = null;
      this.displayDialog = false;
  }

  onRowSelect(event) {
      this.newUserAccount = false;
      this.userAccount = this.cloneUserAccount(event.data);
      this.displayDialog = true;
  }

  cloneUserAccount(c: UserAccount): UserAccount {
      const userAccount = { id: undefined,
                            username: undefined,
                            password: undefined,
                            email: undefined,
                            city: undefined,
                            accountType: undefined,
                            active: undefined,
                            lastLogin: undefined};

      for (const prop in c) {
        if (c[prop] !== undefined) {
          userAccount[prop] = c[prop];
        }
      }
      return userAccount;
  }
  }

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
    datasource: UserAccount[];
    totalRecords: number;
    cols: any[];
    loading: boolean;
  @ViewChild('table', {static: false}) table: Table;
    selectedUserAccount: UserAccount;

    constructor(private userAccountService: UserAccountService, translate: TranslateService) {
      super(translate);
    }

    ngOnInit(): void {
      this.userAccountService.getUserAccounts().then(userAccounts => {
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
  }

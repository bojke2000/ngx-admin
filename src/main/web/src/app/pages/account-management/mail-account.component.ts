import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AbstractComponent } from '../../AbstractComponent';
import { ChangeDetectorRef } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { MailAccount } from '../../domain/mail-account';
import { MailAccountService } from '../../service/mail-account.service';
import { Option } from '../../domain/option';
import {SelectItem} from 'primeng/api';
import { Subject } from 'rxjs';
import { Table } from 'primeng/table';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-mail-account',
  templateUrl: './mail-account.component.html',
  styleUrls: ['./mail-account.component.css'],
})
export class MailAccountComponent extends AbstractComponent implements OnInit, OnDestroy, AfterViewInit {
  mailAccountForm: FormGroup;
  submitted = false;
  mailAccounts: MailAccount[];
  mailAccount: MailAccount;
  selectedMailAccount: MailAccount;
  newMailAccount: boolean;
  displayDialog: boolean;
  totalRecords: number;
  cols: any[];
  loading: boolean;
  protocols: SelectItem[];
  statuses: SelectItem[];
  cities: Option[];
  mailAccountSearch: string;
  @ViewChild('table', { static: false }) table: Table;

  constructor(private mailAccountService: MailAccountService,
    translate: TranslateService, private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef) {
    super(translate);
  }

  ngOnInit(): void {

    this.loadMailAccounts(0, 20, 'id,asc');

    this.cols = [
      { field: 'id', header: '#', width: '50px' },
      { field: 'account', header: 'Account', width: '200px' },
      { field: 'password', header: 'Password', width: '150px' },
      { field: 'server', header: 'Server', width: '200px' },
      { field: 'protocol', header: 'Protocol', width: '150px' },
      { field: 'port', header: 'Port', width: '100px' },
      { field: 'active', header: 'Status', width: '200px' },
      { field: 'sender', header: 'Sender', width: '200px' },
      { field: 'checkTime', header: 'Check Time', width: '250px' },
      { field: 'lastCheck', header: 'Last Check', width: '200px' },
    ];

    this.protocols = [
      {label: 'imap', value: 'imap'},
      {label: 'pop3', value: 'pop3'},
    ];

    this.statuses = [{label: 'Active', value: 'Active'}, {label: 'Disabled', value: 'Disabled'}];

    this.mailAccountForm = this.formBuilder.group({
      id : [''],
      account: ['', [Validators.required,
         Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      server: ['', [Validators.required]],
      protocol: ['imap', Validators.required],
      port: ['', Validators.required],
      active: ['Active', Validators.required],
      sender: ['', Validators.required],
      checkTime: [''],
      lastCheck: ['']
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  private loadMailAccounts(page: number, size: number, sort?: string) {
    const pageable = { page, size, sort};
    this.mailAccountService.getMailAccounts(pageable).then(ngresp => {
      this.mailAccounts = ngresp.data;
      this.totalRecords = ngresp.totalRecords;
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // convenience getter for easy access to form fields
  get f() { return this.mailAccountForm.controls; }

  loadMailAccountsLazy(event: LazyLoadEvent) {
    this.loading = true;
    const sortBy = event.sortField === undefined ? 'id' : event.sortField;
    const sortOrder = event.sortOrder === -1 ? 'desc' : 'asc';
    this.loadMailAccounts(event.first, event.rows, sortBy + ',' + sortOrder);
  }

  onMailAccountSearch(event: any) {
    if (event.keyCode === 13) {
      const pageable = {page: 0, size: 20, sort: 'account,asc'};
      this.loading = true;
      this.mailAccountService.searchMailAccounts(this.mailAccountSearch, pageable).then(ngresp => {
        this.mailAccounts = ngresp.data;
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
    this.newMailAccount = true;
    this.submitted = false;
    this.mailAccount = {
      id: undefined,
      account: undefined,
      password: undefined,
      server: undefined,
      protocol: 'imap',
      port: undefined,
      active: 'Active',
      sender: undefined,
      checkTime: '00:00',
      lastCheck: undefined,
    };
    this.mailAccountForm.patchValue({...this.mailAccount});
    this.displayDialog = true;
  }

  showDialogToRun() {
    this.mailAccountService.fetchDataFromServer(this.mailAccount).subscribe(ua => {
       alert('Sucessfully retrieved messages from server');
    });

  }

  showDialogToEdit() {
    this.newMailAccount = false;
    this.submitted = false;
    this.mailAccountForm.patchValue({...this.mailAccount});
    this.displayDialog = true;
  }

  save() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.mailAccountForm.invalid) {
        return;
    }

    const mailAccounts = [...this.mailAccounts];
    this.mailAccount = {...this.mailAccountForm.value};

    if (this.newMailAccount) {
      this.mailAccountService.addMailAccount(this.mailAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe(ua => {
        mailAccounts.push(ua);
      });
    } else {
      this.mailAccountService.updateMailAccount(this.mailAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe(ua => {
        mailAccounts[this.mailAccounts.indexOf(this.selectedMailAccount)] = ua;
      });
    }

    this.mailAccounts = mailAccounts;
    this.mailAccount = null;
    this.displayDialog = false;
  }

  delete() {
    const index = this.mailAccounts.indexOf(this.selectedMailAccount);
    if (index !== 0) {
      this.mailAccountService.deleteMailAccount(this.mailAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe(ua => {
        this.mailAccounts = this.mailAccounts.filter((val, i) => i !== index);
      });
    }
    this.mailAccount = null;
    this.displayDialog = false;
  }

  onRowSelect(event) {
    this.mailAccount = this.cloneMailAccount(event.data);
  }

  onRowUnselect(event) {
    this.mailAccount = undefined;
  }

  close () {
    this.displayDialog = false;
  }

  cloneMailAccount(c: MailAccount): MailAccount {
    const mailAccount = {
      id: undefined,
      account: undefined,
      password: undefined,
      server: undefined,
      protocol: undefined,
      port: undefined,
      active: undefined,
      sender: undefined,
      checkTime: undefined,
      lastCeck: undefined,
    };

    for (const prop in c) {
      if (c[prop] !== undefined) {
        mailAccount[prop] = c[prop];
      }
    }

    return mailAccount;
  }
}

import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Table } from 'primeng/table';
import { AbstractComponent } from '../../abstract.component';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api/public_api';
import {SelectItem} from 'primeng/api';
import { MailAccount } from '../../domain/mail-account';
import { MailAccountService } from '../../service/mail-account.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Option } from '../../domain/option';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'mail-account',
  templateUrl: './mail-account.component.html',
  styleUrls: ['./mail-account.component.css'],
})
export class MailAccountComponent extends AbstractComponent implements OnInit, AfterViewInit {
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
      { field: 'id', header: 'ID', width: '50px' },
      { field: 'account', header: 'Account', width: '120px' },
      { field: 'password', header: 'Password', width: '120px' },
      { field: 'server', header: 'Server', width: '150px' },
      { field: 'protocol', header: 'Protocol', width: '150px' },
      { field: 'port', header: 'Port', width: '120px' },
      { field: 'active', header: 'Status', width: '120px' },
      { field: 'sender', header: 'Sender', width: '120px' },
      { field: 'lastCheck', header: 'Last Check', width: '120px' },
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
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  private loadMailAccounts(page: number, size: number, sort?: string) {
    const pageable = { page, size, sort};
    this.mailAccountService.getMailAccounts(pageable).then(ngresp => {
      this.mailAccounts = ngresp.data;
      this.totalRecords = ngresp.totalPages;
      this.loading = false;
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.mailAccountForm.controls; }

  loadMailAccountsLazy(event: LazyLoadEvent) {
    this.loading = true;
    const sortBy = event.sortField === undefined ? 'id' : event.sortField;
    const sortOrder = event.sortOrder === -1 ? 'desc' : 'asc';
    this.loadMailAccounts(event.first, event.rows, sortBy + ',' + sortOrder);
  }

  onMailAccountSearch() {
    const pageable = {page: 0, size: 20, sort: 'account,asc'};
    this.loading = true;
    this.mailAccountService.searchMailAccounts(this.mailAccountSearch, pageable).then(ngresp => {
      this.mailAccounts = ngresp.data;
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
      lastCheck: undefined,
    };
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
      this.mailAccountService.addMailAccount(this.mailAccount).subscribe(ua => {
        mailAccounts.push(ua);
      });
    } else {
      this.mailAccountService.updateMailAccount(this.mailAccount).subscribe(ua => {
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
      this.mailAccountService.deleteMailAccount(this.mailAccount).subscribe(ua => {
        this.mailAccounts = this.mailAccounts.filter((val, i) => i !== index);
      });
    }
    this.mailAccount = null;
    this.displayDialog = false;
  }

  onRowSelect(event) {
    this.newMailAccount = false;
    this.submitted = false;
    this.mailAccount = this.cloneMailAccount(event.data);
    this.mailAccountForm.patchValue({...this.mailAccount});

    /*
    const selectedProtocol = this.protocols.filter(el => el.label === this.mailAccount.protocol);
    this.mailAccountForm.patchValue({
      protocol: selectedProtocol[0]});
    */

    this.displayDialog = true;
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

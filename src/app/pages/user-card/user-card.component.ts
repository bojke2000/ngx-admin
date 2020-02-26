import { Component, OnInit, ViewChild } from '@angular/core';
import { UserCardService } from '../../service/user-card.service';
import { UserCard } from '../../domain/user-card';
import { LazyLoadEvent } from 'primeng/api/public_api';
import {Table} from 'primeng/table';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css'],

})
export class UserCardComponent implements OnInit {

  datasource: UserCard[];
  userCards: UserCard[];
  totalRecords: number;
  cols: any[];
  isResisable: boolean = true;
  loading: boolean;
  @ViewChild('table', {static: false}) table: Table;
  selectedUserCard: UserCard;

  constructor(private userCardService: UserCardService, translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('rs');
  }

  ngOnInit(): void {
    this.userCardService.getUserCards().then(userCards => {
      this.datasource = userCards;
      this.totalRecords = this.datasource.length;
    }) ;

    this.cols = [
      { field: 'id', header: 'ID', width: '70px' },
      { field: 'userCardId', header: 'UserCard ID' , width: '150px' },
      { field: 'siteId', header: 'siteId' , width: '120px' },
      { field: 'siteNo', header: 'Site No' , width: '150px' },
      { field: 'gsmId', header: 'GSM ID' , width: '120px' },
      { field: 'mpn', header: 'MPN' , width: '120px' },
      { field: 'countryId', header: 'Country ID' , width: '120px' },
      { field: 'cityId', header: 'City ID' , width: '120px' },
      { field: 'street', header: 'Street' , width: '200px' },
      { field: 'streetNo', header: 'Street No' , width: '80px' },
      { field: 'deviation', header: 'Deviation' , width: '120px' },
      { field: 'customerName', header: 'Customer Name' , width: '250px' },
      { field: 'customerInfo', header: 'Customer Info' , width: '200px' },
      { field: 'siteRemark', header: 'Site Remark' , width: '250px' },
      { field: 'meterLocationRemark', header: 'Remark' , width: '200px' },
      { field: 'nameA', header: 'Name A' , width: '200px' },
      { field: 'nameB', header: 'Name B' , width: '200px' },
      { field: 'nameC', header: 'Name C' , width: '200px' },
      { field: 'nameD', header: 'Name D' , width: '200px' },
      { field: 'unitA', header: 'Unit A' , width: '120px' },
      { field: 'unitB', header: 'Unit B' , width: '120px' },
      { field: 'unitC', header: 'Unit C' , width: '120px' },
      { field: 'unitD', header: 'Unit D' , width: '120px' },
      { field: 'multiplierA', header: 'Multiplier A' , width: '120px' },
      { field: 'multiplierB', header: 'Multiplier B' , width: '120px' },
      { field: 'multiplierC', header: 'Multiplier C' , width: '120px' },
      { field: 'multiplierD', header: 'Multiplier D' , width: '120px' },
    ];

    this.loading = true;
  }

  loadUserCardsLazy(event: LazyLoadEvent) {
    this.loading = true;

    // in a real application, make a remote request to load data using state metadata from event
    // event.first = First row offset
    // event.rows = Number of rows per page
    // event.sortField = Field name to sort with
    // event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    // filters: FilterMetadata object having field as key and filter value, filter matchMode as value

    // imitate db connection over a network
    setTimeout(() => {
        if (this.datasource) {
            this.userCards = this.datasource.slice(event.first, (event.first + event.rows));
            this.loading = false;
        }
    }, 1000);
  }

  resetSort() {
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();
   }

   onImportClick() {
      alert('onImportClick');
   }
}

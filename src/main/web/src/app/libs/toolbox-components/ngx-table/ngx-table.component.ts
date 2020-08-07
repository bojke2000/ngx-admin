import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { AbstractComponent } from '../../../AbstractComponent';
import { Table } from 'primeng/table';
import { TranslateService } from '@ngx-translate/core';
import { distinctUntilChanged } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'ngx-table',
  templateUrl: './ngx-table.component.html',
  styleUrls: ['./ngx-table.component.scss'],
})
export class NgxTableComponent extends AbstractComponent {
  @Input()
  columns: any[];
  @Input()
  value: [];
  @Input()
  selection: any;
  @Output()
  selectionChange = new EventEmitter();
  @Input()
  totalRecords: number;
  @Input()
  loading = true;
  @Input()
  dataKey: string;
  @Output()
  lazyLoad = new EventEmitter();
  @Output()
  rowSelect = new EventEmitter();
  @Output()
  rowUnselect = new EventEmitter();
  @Input()
  dataKey1: string;
  @Output()
  clickFunction = new EventEmitter();
  @Input()
  ngCondition: string = undefined;
  @Input()
  ngClass: string = undefined;
  @Input()
  fontWeightFunction: Function;
  @Input()
  styleColorFunction: Function;
  @ViewChild('dt') table: Table;
  @Input()
  rows = 20;

  first  = 0;

  constructor(translate: TranslateService) {
    super(translate);
  }

  get loading$() {
    return of(this.loading).pipe(
      distinctUntilChanged(),
    );
  }

  fontWeight(rowData: any, columnName: string): Function {
    const {fontWeightFunction, localFontWeight} = this;
    return fontWeightFunction ? fontWeightFunction.call(null, rowData, columnName) : localFontWeight.call(null, false);
  }

  styleColor(rowData: any, columnName: string): Function {
    const {styleColorFunction, localStyleColor} = this;
    return styleColorFunction ? styleColorFunction.call(null, rowData, columnName) : localStyleColor.call(null, null);
  }

  get value$() {
    return of(this.value).pipe(
      distinctUntilChanged(),
    );
  }

  onLazyLoad(event: any): void {
    this.lazyLoad.emit(event);
  }

  onRowSelect(event: any): void {
    this.rowSelect.emit(event);
  }

  onRowUnselect(event: any): void {
    this.rowUnselect.emit(event);
  }

  onColumnClick(column, row) {
    if (this.dataKey1 && this.clickFunction) {
        this.clickFunction.emit({column, row});
    }
  }

  styleCondition(rowData: any[], index: any) {
    return this.ngCondition && rowData[index] === this.ngCondition;
  }

  localStyleColor(condition: boolean) {
    return condition ? 'red' : null;
  }

  localFontWeight(condition: boolean) {
    return condition ? 'bold' : 'normal';
  }

  reset(): void {
    this.first = 0;
  }
}

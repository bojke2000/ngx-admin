import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AbstractComponent } from '../../../AbstractComponent';
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

  constructor(translate: TranslateService) {
    super(translate);
  }

  get loading$() {
    return of(this.loading).pipe(
      distinctUntilChanged(),
    );
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

  onColumnClick(rowData) {
    if (this.dataKey1 && this.clickFunction) {
      this.clickFunction.emit(rowData);
    }
  }

  styleCondition(rowData: any[], index: any) {
    return this.ngCondition && rowData[index] === this.ngCondition;
  }

  styleColor(condition: boolean) {
    return condition ? 'red' : null;
  }

  fontWeight(condition: boolean) {
    return condition ? 'bold' : 'normal';
  }
}

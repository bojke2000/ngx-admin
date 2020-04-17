import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AbstractComponent } from '../../../AbstractComponent';
import { of } from 'rxjs';
import { tap, distinctUntilChanged } from 'rxjs/operators';

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
  @Input()
  totalRecords: number;
  @Input()
  loading = true;
  @Input()
  dataKey: string;
  @Output()
  lazyLoad: EventEmitter<any> = new EventEmitter();
  @Output()
  rowSelect: EventEmitter<any> = new EventEmitter();
  @Output()
  rowUnselect: EventEmitter<any> = new EventEmitter();

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

}

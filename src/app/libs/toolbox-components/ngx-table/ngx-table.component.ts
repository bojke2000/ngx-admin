import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { AbstractComponent } from '../../../AbstractComponent';

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

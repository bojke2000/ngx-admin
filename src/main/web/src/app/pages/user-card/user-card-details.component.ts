import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { AbstractComponent } from '../../AbstractComponent';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-user-card-details',
  templateUrl: './user-card-details.component.html',
  styleUrls: ['./user-card-details.component.css'],

})
export class UserCardDetailsComponent extends AbstractComponent implements OnInit {

  customerId = '12345';
  customerName = 'Petar Petrovic';
  address = 'Zike Zikica';
  addressNo = '2';
  deviceId = '1243423';
  gsmId = '21414';
  readTimestamp = '23.07.2020 12:23';
  usageCurrent: number = 123.12;
  usageCurrentReverse: number = 321.21;
  usageCurrentMonth: number = 213.32;
  diffLastRead: number = 12.41;



  @Input()
  displayDialog = false;
  @Output()
  closeFunction = new EventEmitter();

  constructor (translate: TranslateService) {
   super(translate);
  }

  onHide(): void {
    const {displayDialog} = this;

    if (this.closeFunction) {
      this.closeFunction.emit(displayDialog);
    }
  }

  ngOnInit(): void {}

}

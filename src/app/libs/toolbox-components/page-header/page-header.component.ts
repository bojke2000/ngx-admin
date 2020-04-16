import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AbstractComponent } from '../../../AbstractComponent';

@Component({
  selector: 'ngx-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent extends AbstractComponent {
  @Input()
  title: string;

  constructor(translate: TranslateService) {
    super(translate);
  }

}

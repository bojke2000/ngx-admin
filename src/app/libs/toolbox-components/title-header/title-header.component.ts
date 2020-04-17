import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AbstractComponent } from '../../../AbstractComponent';

@Component({
  selector: 'ngx-title-header',
  templateUrl: './title-header.component.html',
  styleUrls: ['./title-header.component.scss'],
})
export class TitleHeaderComponent extends AbstractComponent {
  @Input()
  title: string;

  constructor(translate: TranslateService) {
    super(translate);
  }

}

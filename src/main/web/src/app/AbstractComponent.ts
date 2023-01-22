import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

export abstract class AbstractComponent {
  destroy$: Subject<void>;

  translate: TranslateService;
  constructor(translateService: TranslateService) {
    this.translate = translateService;
    this.destroy$ = new Subject();
  }
}

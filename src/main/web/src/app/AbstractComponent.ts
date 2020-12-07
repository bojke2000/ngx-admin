import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export abstract class AbstractComponent {
  destroy$: Subject<void>;

  translate: TranslateService;
  constructor(translateService: TranslateService) {
    this.translate = translateService;
    this.translate.setDefaultLang('rs');
    this.translate.use('rs');
    this.destroy$ = new Subject();
  }
}

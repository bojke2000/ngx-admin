import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';

export abstract class AbstractComponent {
  destroy$: Subject<void>;

  translate: TranslateService;
  constructor(translateService: TranslateService) {
    this.translate = translateService;
    this.translate.setDefaultLang(environment.language);
    this.translate.use(environment.language);
    this.destroy$ = new Subject();
  }
}

import { TranslateService } from '@ngx-translate/core';

export abstract class AbstractComponent {
  translate: TranslateService;

  constructor( translateService: TranslateService) {
    this.translate = translateService;
    this.translate.setDefaultLang('rs');
    this.translate.use('rs');
  }
}

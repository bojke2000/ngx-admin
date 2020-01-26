
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export abstract class AbstractComponent implements OnInit {
  translate: TranslateService;

  constructor( translateService: TranslateService) {
    this.translate = translateService;
    this.translate.setDefaultLang('en');
    this.translate.use('rs');
  }

  ngOnInit() {}
}

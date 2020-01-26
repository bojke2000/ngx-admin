import { Component, OnInit } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {

  menu = [];

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('rs');
  }

  ngOnInit(): void {
    MENU_ITEMS.forEach(item => {
      if (item.children !== undefined) {
        item.children.forEach(subitem => {
          this.localizeItem(subitem);
        });
      }
      this.localizeItem(item);
    });

    this.menu = MENU_ITEMS;
  }

  private localizeItem(item) {
    this.translate.get(item.title).subscribe(response => {
      item.title = response; // update value field here.
    });
  }
}

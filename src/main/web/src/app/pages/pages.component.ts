import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { Subscription } from 'rxjs';
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
export class PagesComponent implements OnInit, OnDestroy  {
  private sub: Subscription = new Subscription();
  menu = [];

  constructor(private translate: TranslateService, private cdr: ChangeDetectorRef) {
    translate.setDefaultLang('rs');
    translate.use('rs');
  }

  ngOnInit(): void {
    MENU_ITEMS.forEach(item => {
      if (item.children !== undefined) {
        item.children.forEach(subitem => this.localizeItem(subitem));
      }
      this.localizeItem(item);
    });

    this.menu = MENU_ITEMS;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.cdr.detach();
  }


  private localizeItem(item) {
    const su = this.translate.get(item.title).subscribe(response => {
      item.title = response; // update value field here.
      this.cdr.detectChanges();
    });
    this.sub.add(su);
  }
}

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";

import { MENU_ITEMS } from "./pages-menu";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { UserAccountService } from "../service/user-account.service";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";
import { takeUntil } from "rxjs/operators";
import { Subject, of } from 'rxjs';

@Component({
  selector: "ngx-pages",
  styleUrls: ["pages.component.scss"],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit, OnDestroy {
  private sub: Subscription = new Subscription();
  menu = [];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private translate: TranslateService,
    private userAccountService: UserAccountService,
    private cdr: ChangeDetectorRef, 
    private authService: NbAuthService
  ) {
    translate.setDefaultLang("rs");
    translate.use("rs");

    this.authService.onTokenChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          const payload = token.getPayload();
          // here we receive a payload from the token
          // and assigns it to our `user` variable
          const name = payload.sub;

          const pageable = {page: 0, size: 20, sort: 'username,asc'};
          this.userAccountService.searchUserAccounts(name, pageable)
          .then(result => {
            const user = result && result.totalRecords > 0 && result.data && result.data.length > 0 ? result.data[0] : undefined;
            this.userAccountService.setLoggerUser(user);

            const mpp = MENU_ITEMS.filter(
              (item) =>
                item.title !== "Administration" ||
                (item.title === "Administration" && !this.userAccountService.isUser())
            );
        
            // mpp - menu per privileges
            mpp.forEach((item) => {
              if (item.children !== undefined) {
                item.children.forEach((subitem) => this.localizeItem(subitem));
              }
              this.localizeItem(item);
            });
        
            this.menu = mpp;
          });
        }
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.cdr.detach();
  }

  private localizeItem(item) {
    const su = this.translate.get(item.title).subscribe((response) => {
      item.title = response; // update value field here.
      this.cdr.detectChanges();
    });
    this.sub.add(su);
  }
}

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";

import { MENU_ITEMS } from "./pages-menu";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { UserAccountService } from "../service/user-account.service";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";
import { takeUntil } from "rxjs/operators";
import { Subject, of } from "rxjs";
import { environment } from "../../environments/environment";

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
    // translate.setDefaultLang(environment.language);
    // translate.use(environment.language);

    this.authService
      .onTokenChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          const payload = token.getPayload();
          // here we receive a payload from the token
          // and assigns it to our `user` variable
          const name = payload.sub;

          const pageable = { page: 0, size: 20, sort: "username,asc" };
          this.userAccountService
            .searchUserAccounts(name, pageable)
            .then((result) => {
              const user =
                result &&
                result.totalRecords > 0 &&
                result.data &&
                result.data.length > 0
                  ? result.data[0]
                  : undefined;
              this.userAccountService.setLoggerUser(user);
              this.translate.setDefaultLang(user.lang);
              this.translate.use(user.lang);

              let mpp: any;
              if  (this.userAccountService.isSuperadmin()) {
                mpp = MENU_ITEMS;  
              } else if (this.userAccountService.isUser()) {
                mpp = MENU_ITEMS.filter(
                  item =>
                    item.title !== "Administration"
                );
              } else if (this.userAccountService.isAdmin()) {
                mpp = MENU_ITEMS;  
                mpp.forEach(item => {
                  if (item.children !== undefined) {
                    item.children = item.children.filter(child => 
                       child.title === "Account Management" 
                    || child.title === "Column Template"
                    || child.title === "Devices"
                    || child.title === "Organisations"
                    || child.title === "Routes"
                    || child.title === "Lora Config"
                    || child.title === "Import Log");
                  }
                });
              }

              // mpp - menu per privileges
              mpp.forEach((item) => {
                if (item.children !== undefined) {
                  item.children.forEach((subitem) =>
                    this.localizeItem(subitem)
                  );
                }
                this.localizeItem(item);
              });

              this.menu = mpp;
            });
        }
      });
  }

  ngOnInit(): void {}

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

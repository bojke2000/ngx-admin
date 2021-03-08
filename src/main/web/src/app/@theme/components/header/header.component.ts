import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NbAuthJWTToken, NbAuthService, NbTokenService } from '@nebular/auth';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { Subject, of } from 'rxjs';
import { User, UserData } from '../../../@core/data/users';
import { filter, map, takeUntil } from 'rxjs/operators';

import { AlarmService } from '../../../service/alarm.service';
import { Router } from '@angular/router';
import { UserAccountService } from './../../../service/user-account.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  ngAfterViewInit(): void {
    this.sidebarService.toggle(true, 'menu-sidebar');
  }

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: User = {name: '', picture: ''};
  alarmCount: number = 0;
  alarmStatus: string = 'basic';

  themes = [
    {
      value: 'default',
      name: 'Corporate',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Light',
    },
  ];

  currentTheme = 'default';
  tag = 'profile-context-menu';

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private router: Router,
    private nbTokenService: NbTokenService,
    private breakpointService: NbMediaBreakpointsService,
    private alarmService: AlarmService,
    private userAccountService: UserAccountService,
    private authService: NbAuthService) {

    this.authService.onTokenChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          const payload = token.getPayload();
          // here we receive a payload from the token
          // and assigns it to our `user` variable
          this.user.name = payload.sub;

          const pageable = {page: 0, size: 20, sort: 'username,asc'};
          userAccountService.searchUserAccounts(this.user.name, pageable)
          .then(result => {
            const user = result && result.totalRecords > 0 && result.data && result.data.length > 0 ? result.data[0] : undefined;
            this.userMenu[0].title = `${user.role} Profile`;
          });
        }

      });

    this.menuService.onItemClick()
      .pipe(takeUntil(this.destroy$), filter(({ tag }) => tag === this.tag))
      .subscribe(bag => {
        if (bag.item.title === 'Log out') {
          this.authService.logout('email');
          this.nbTokenService.clear();
          this.router.navigate(['/']);
        }
      });
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user.picture = users.nick.picture);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    this.alarmService.getCount().then((count: number) => {
      this.alarmCount = count;
      this.alarmStatus = (this.alarmCount > 0 ) ? 'danger' : 'basic';
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  onAlertClick(event) {
    this.router.navigate(['/pages/alarm']);
  }

  get alarm$() {
    return of(this.alarmCount);
  }

  get status$() {
    return of(this.alarmStatus);
  }
}

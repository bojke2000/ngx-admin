import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { NbAuthJWTToken, NbAuthService, NbTokenService } from '@nebular/auth';

import { UserData, User } from '../../../@core/data/users';
import { map, takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

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
    private authService: NbAuthService) {

    this.authService.onTokenChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          const payload = token.getPayload();
          // here we receive a payload from the token
          // and assigns it to our `user` variable
          this.user.name = payload.sub;
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
}

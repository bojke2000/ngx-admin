import { NbMenuItem } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Auth',
    icon: 'lock-outline',
    children: [
      {
        title: 'Login',
        link: '/auth/login',
      },
      {
        title: 'Register',
        link: '/auth/register',
      },
      {
        title: 'Request Password',
        link: '/auth/request-password',
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password',
      },
    ],
  },
  {
    title: 'devices',
    icon: 'book-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Account management',
    icon: 'credit-card-outline',
    link: '/pages/account-management',
    home: false,
  },
  {
    title: 'FEATURES',
    group: true,
  },
];

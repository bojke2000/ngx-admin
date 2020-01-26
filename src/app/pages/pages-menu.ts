import { NbMenuItem } from '@nebular/theme';

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
    title: 'menu.devices',
    icon: 'book-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'menu.Account management',
    icon: 'credit-card-outline',
    link: '/pages/account-management',
    home: false,
  },
  {
    title: 'FEATURES',
    group: true,
  },
];

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
    title: 'devices',
    icon: 'book-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Administration',
    icon: 'unlock-outline',
    children: [
      {
        title: 'Account Management',
        icon: 'people-outline',
        link: '/pages/user-account',
        home: false,
      },
      {
        title: 'Email Management',
        icon: 'email-outline',
        link: '/pages/mail-account',
        home: false,
      },
    ],
  },
  {
    title: 'FEATURES',
    group: true,
  },
];

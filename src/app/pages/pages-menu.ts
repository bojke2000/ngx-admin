import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'userCards',
    icon: 'book-outline',
    link: '/pages/user-card',
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
        title: 'GSM2 Management',
        icon: 'email-outline',
        link: '/pages/mail-account',
        home: false,
      },
    ],
  },
  {
    title: 'Import/Export',
    icon: 'book-open-outline',
    children: [
      {
        title: 'Templates',
        icon: 'people-outline',
        link: '/pages/template',
        home: false,
      },
      {
        title: 'Import User Card',
        icon: 'people-outline',
        link: '/pages/import-user-card',
        home: false,
      },
    ],
  },
];

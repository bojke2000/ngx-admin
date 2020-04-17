import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'User Card',
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
      {
        title: 'Column Template',
        icon: 'keypad-outline',
        link: '/pages/template',
        home: false,
      },
      {
        title: 'Devices',
        icon: 'keypad-outline',
        link: '/pages/device',
        home: false,
      },
      {
        title: 'Cities',
        icon: 'keypad-outline',
        link: '/pages/city',
        home: false,
      },
    ],
  },
  {
    title: 'Import/Export',
    icon: 'book-open-outline',
    children: [
      {
        title: 'Import User Card',
        icon: 'corner-right-up-outline',
        link: '/pages/import-user-card',
        home: false,
      },
    ],
  },
];

import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'User Card',
    icon: 'book-outline',
    link: '/pages/user-card',
    home: true,
  },
  {
    title: 'Alarms',
    icon: 'alert-triangle-outline',
    link: '/pages/alarm',
    home: true,
  },
  {
    title: 'WMBUS Import',
    icon: 'arrowhead-up-outline',
    link: '/pages/import-ado',
    home: true,
  },
  {
    title: 'WMBUS Export',
    icon: 'arrowhead-down-outline',
    link: '/pages/export-ado',
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
      {
        title: 'Routes',
        icon: 'keypad-outline',
        link: '/pages/route',
        home: false,
      },
      {
        title: 'Activity Log',
        icon: 'keypad-outline',
        link: '/pages/logfile',
        home: false,
      },
    ],
  },
];

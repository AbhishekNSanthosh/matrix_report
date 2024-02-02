import {
  Account,
  AccountMultiple,
  MapCheckOutline,
  PencilBox,
  ViewDashboard
} from 'mdi-material-ui';

export const projectConfigs = {
  name: 'Zatca',
  primaryColor: '#202020'
};

export const DRAWER_NAVIGATION_LIST = [
  {
    path: '/',
    id: '1',
    title: 'Dashboard',
    translationKey: '',
    icon: ViewDashboard,
    acl: 'dashboard'
  },

  {
    path: '/user',
    id: '2',
    title: 'Users',
    translationKey: '',
    icon: AccountMultiple,
    acl: 'user'
  },

  {
    path: '/orders',
    id: '3',
    title: 'Onboarding',
    translationKey: '',
    icon: Account,
    acl: 'coach'
  },
  {
    path: '/questionnaires',
    id: '4',
    title: 'Zatca Logs',
    translationKey: '',
    icon: PencilBox,
    acl: 'questionnaires'
  },
  {
    path: '/invoices',
    id: '5',
    title: 'Invoices',
    translationKey: '',
    icon: PencilBox,
    acl: 'questionnaires'
  },

  {
    path: '/',
    id: '6',
    title: 'Settings',
    translationKey: '',
    icon: MapCheckOutline,
    acl: 'Categories'
  }
];

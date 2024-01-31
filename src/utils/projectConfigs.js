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
    path: '/home',
    id: '1',
    title: 'Dashboard',
    translationKey: '',
    icon: ViewDashboard,
    acl: 'dashboard'
  },
  {
    sectionTitle: 'User Management',
    acl: 'common'
  },
  {
    path: '/user',
    id: '2',
    title: 'User',
    translationKey: '',
    icon: AccountMultiple,
    acl: 'user'
  },
  {
    path: '/user',
    id: '3',
    title: 'Onboarding',
    translationKey: '',
    icon: Account,
    acl: 'coach'
  },
  {
    path: '/questionnaires',
    id: '4',
    title: 'Zata Logs',
    translationKey: '',
    icon: PencilBox,
    acl: 'questionnaires'
  },
  {
    path: '/questionnaires',
    id: '4',
    title: 'Invoices',
    translationKey: '',
    icon: PencilBox,
    acl: 'questionnaires'
  },

  {
    path: '/workout/categories',
    id: '1',
    title: 'Settings',
    translationKey: '',
    icon: MapCheckOutline,
    acl: 'Categories'
  }
];

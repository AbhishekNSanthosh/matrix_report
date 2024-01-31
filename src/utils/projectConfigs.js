import {
  Account,
  AccountEdit,
  AccountMultiple,
  City,
  CurrencyBtc,
  Dumbbell,
  Map,
  MapCheckOutline,
  Offer,
  PencilBox,
  PierCrane,
  SkiWater,
  TranslateVariant,
  ViewDashboard,
  WeightLifter,
  Cart
} from 'mdi-material-ui';

export const projectConfigs = {
  name: 'Nadena',
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
    path: '/coach',
    id: '3',
    title: 'Coach',
    translationKey: '',
    icon: Account,
    acl: 'coach'
  },
  {
    path: '/questionnaires',
    id: '4',
    title: 'Questionnaires',
    translationKey: '',
    icon: PencilBox,
    acl: 'questionnaires'
  },
  {
    path: '/usertype',
    id: '5',
    title: 'Usertype',
    translationKey: '',
    icon: AccountEdit,
    acl: 'usertype'
  },
  {
    sectionTitle: 'Workouts',
    acl: 'common'
  },
  {
    path: '/workout/categories',
    id: '1',
    title: 'Categories',
    translationKey: '',
    icon: MapCheckOutline,
    acl: 'Categories'
  },
  // {
  //   path: '/workout/groups',
  //   id: '2',
  //   title: 'Groups',
  //   translationKey: '',
  //   icon: MapCheckOutline,
  //   acl: 'Groups'
  // },
  {
    path: '/equipements',
    id: '5',
    title: 'Equipements',
    translationKey: '',
    icon: Dumbbell,
    acl: 'equipements'
  },
  {
    path: '/muscle-group',
    id: '5',
    title: 'Muscle Group',
    translationKey: '',
    icon: WeightLifter,
    acl: 'muscle group'
  },
  {
    path: '/exercise-library',
    id: '8',
    title: 'Exercise Library',
    translationKey: '',
    icon: SkiWater,
    acl: 'exercise-library'
  },
  {
    path: '/workout/programmes',
    id: '3',
    title: 'Programmes',
    translationKey: '',
    icon: PierCrane,
    acl: 'programmes'
  },
  // {
  //   path: '/workout',
  //   id: '5',
  //   title: 'Workout',
  //   translationKey: '',
  //   icon: PierCrane,
  //   acl: 'workout',
  //   children: []
  // },
  {
    path: '/workout-plan',
    id: '8',
    title: 'Plan/Package',
    translationKey: '',
    icon: SkiWater,
    acl: 'workout-plan'
  },
  {
    path: '/promotions',
    id: '5',
    title: 'Promotions',
    translationKey: '',
    icon: Offer,
    acl: 'promotions'
  },
  {
    sectionTitle: 'Order Management',
    acl: 'common'
  },
  {
    path: '/orders',
    id: '6',
    title: 'Orders',
    translationKey: '',
    icon: Cart,
    acl: 'orders'
  },
  {
    sectionTitle: 'Common Settings',
    acl: 'common'
  },
  {
    path: '/language',
    id: '7',
    title: 'Languages',
    translationKey: '',
    icon: TranslateVariant,
    acl: 'languages'
  },
  {
    path: '/country',
    id: '8',
    title: 'Countries',
    translationKey: '',
    icon: Map,
    acl: 'countries'
  },
  {
    path: '/city',
    id: '9',
    title: 'Cities',
    translationKey: '',
    icon: City,
    acl: 'city'
  },
  {
    path: '/currency',
    id: '10',
    title: 'Currency',
    translationKey: '',
    icon: CurrencyBtc,
    acl: 'currency'
  }
];

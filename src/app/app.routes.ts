import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
    children: [
      {
        path: 'change-detection',
        title: 'Change Detection',
        loadComponent: () =>
          import(
            './dashboard/pages/change-detection/change-detection.component'
          ),
      },
      {
        path: 'control-flow',
        title: 'Control Flow',
        loadComponent: () =>
          import('./dashboard/pages/control-flow/control-flow.component'),
      },
      {
        path: 'defer-options',
        title: 'Defer Options',
        loadComponent: () =>
          import('./dashboard/pages/defer-options/defer-options.component'),
      },
      {
        path: 'defer-views',
        title: 'Defer Views',
        loadComponent: () =>
          import('./dashboard/pages/defer-views/defer-views.component'),
      },
      {
        path: 'user/:id',
        title: 'User View',
        loadComponent: () => import('./dashboard/pages/user/user.component'),
      },
      {
        path: 'users',
        title: 'User List',
        loadComponent: () => import('./dashboard/pages/users/users.component'),
      },
      { path: '', redirectTo: 'control-flow', pathMatch: 'full' },
    ],
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then((m) => m.default),
  },
  {
    path: 'prueba',
    loadComponent: () =>
      import('./prueba/prueba.component').then((m) => m.default),
  },
  {
    path: 'diagrama',
    loadComponent: () =>
      import('./diagrammer/diagrammer.component').then((m) => m.default),
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

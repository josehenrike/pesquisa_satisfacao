import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      { path: 'create-form', loadComponent: () => import('./create-form/create-form.component').then(m => m.CreateFormComponent) },
      { path: 'forms', loadComponent: () => import('./forms/forms.component').then(m => m.FormsComponent) }
    ]
  },
];

import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { SignupComponent } from './auth/signup.component';

import { authGuard } from './auth/auth.guard';
import { roleGuard } from './auth/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'admin',
    loadComponent: () => import('./dashboard/admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard, roleGuard('admin')]
  },
  {
    path: 'editor',
    loadComponent: () => import('./dashboard/editor.component').then(m => m.EditorComponent),
    canActivate: [authGuard, roleGuard('editor')]
  },
  {
    path: 'viewer',
    loadComponent: () => import('./dashboard/viewer.component').then(m => m.ViewerComponent),
    canActivate: [authGuard, roleGuard('viewer')]
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./auth/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

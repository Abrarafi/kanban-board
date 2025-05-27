import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from '../dashboard/pages/dashboard/dashboard.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login - Kanban Board'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register - Kanban Board'
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
import { Routes } from '@angular/router';
import { BoardViewComponent } from './board/pages/board-view/board-view.component';
import { DashboardComponent } from './dashboard/pages/dashboard/dashboard.component';
import { AUTH_ROUTES } from './auth/auth.routes';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: AUTH_ROUTES
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'board/:id', 
    component: BoardViewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  }
];

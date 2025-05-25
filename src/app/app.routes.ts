import { Routes } from '@angular/router';
import { CardComponent } from './board/components/card/card.component';
import { BoardViewComponent } from './board/pages/board-view/board-view.component';
import { DashboardComponent } from './dashboard/pages/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'board/:id', component: BoardViewComponent }
];

import { Routes } from '@angular/router';
import { CardComponent } from './board/components/card/card.component';
import { BoardViewComponent } from './board/pages/board-view/board-view.component';

export const routes: Routes = [
    {path: '',component:BoardViewComponent}
];

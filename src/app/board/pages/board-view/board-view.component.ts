import { Component, OnInit } from '@angular/core';
import { BoardHeaderComponent } from '../../components/board-header/board-header.component';
import { ColumnComponent } from '../../components/column/column.component';
import { Board } from '../../models/board.model';
import { Subscription } from 'rxjs';
import { Card } from '../../models/card.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.css'],
  standalone: true,
  imports: [BoardHeaderComponent, ColumnComponent]
})
export class BoardViewComponent implements OnInit {
  board: Board = {
    id: '1',
    name: 'Project Tasks',
    columns: [
      {
        id: 'col1',
        name: 'To Do',
        order: 0,
        boardId: '1',
        cards: [
          {
            id: '1',
            title: 'Implement Authentication',
            description: 'Set up JWT authentication',
            priority: 'HIGH',
            columnId: 'col1',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      },
      {
        id: 'col2',
        name: 'In Progress',
        order: 1,
        boardId: '1',
        cards: []
      },
      {
        id: 'col3',
        name: 'Done',
        order: 2,
        boardId: '1',
        cards: []
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  isLoading = true;
  error: string | null = null;
  private subscriptions = new Subscription();

  ngOnInit(): void {
    // In a real app, you would fetch board data here
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getConnectedColumnIds(currentColumnId: string): string[] {
    return this.board.columns
      .map(col => col.id)
      .filter(id => id !== currentColumnId);
  }

  onCardDropped(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  onAddCard(columnId: string, title: string) {
    const column = this.board.columns.find(col => col.id === columnId);
    if (column) {
      const newCard: Card = {
        id: Date.now().toString(),
        title,
        columnId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      column.cards.push(newCard);
    }
  }

  addNewColumn(): void {
    if (!this.board) return;
    const name = prompt('Enter column name:');
    if (name) {
      // In a real app, you would call the board service to create a new column
    }
  }
}

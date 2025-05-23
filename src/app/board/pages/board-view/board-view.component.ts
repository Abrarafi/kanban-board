import { Component, OnInit } from '@angular/core';
import { BoardHeaderComponent } from '../../components/board-header/board-header.component';
import { ColumnComponent } from '../../components/column/column.component';
import { Board } from '../../models/board.model';
import { Column } from '../../models/column.model';
import { Card } from '../../models/card.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.css'],
  standalone: true,
  imports: [BoardHeaderComponent, ColumnComponent]
})
export class BoardViewComponent implements OnInit {
  board: Board = {
    id: 'board1',
    name: 'Project Board',
    columns: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  isLoading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadColumns();
  }

  private loadColumns(): void {
    this.apiService.getColumns().subscribe({
      next: (columns) => {
        this.board.columns = columns;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load columns';
        this.isLoading = false;
      }
    });
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

      // Update the card's columnId
      const card = event.container.data[event.currentIndex];
      const newColumnId = event.container.id;
      this.apiService.moveCard(event.previousContainer.id, newColumnId, card).subscribe();
    }
  }

  onAddCard(columnId: string, title: string) {
    console.log('BoardView: onAddCard called with:', { columnId, title });
    
    const newCard: Card = {
      id: Date.now().toString(),
      title,
      description: '',
      columnId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.apiService.addCard(columnId, newCard).subscribe({
      next: (card) => {
        console.log('BoardView: API response received:', card);
        const column = this.board.columns.find(col => col.id === columnId);
        if (column) {
          // Check if card already exists in column
          const exists = column.cards.some(c => c.id === card.id);
          if (!exists) {
            column.cards = [...column.cards, card];
          }
        }
      },
      error: (err) => {
        this.error = 'Failed to add card';
      }
    });
  }

  addNewColumn(): void {
    console.log('BoardView: addNewColumn called');
    const name = prompt('Enter column name:');
    if (name?.trim()) {
      // Check if column already exists in the board
      const exists = this.board.columns.some(col => col.name === name);
      if (exists) {
        this.error = 'Column with this name already exists';
        return;
      }

      this.apiService.addColumn(this.board.id, name).subscribe({
        next: (column) => {
          console.log('BoardView: Column created:', column);
          // Create a new array instead of mutating the existing one
          this.board.columns = Array.from(new Set([...this.board.columns, column]));
        },
        error: (err) => {
          this.error = 'Failed to create column';
        }
      });
    }
  }
}

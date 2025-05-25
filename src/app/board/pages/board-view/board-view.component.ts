import { Component, OnInit } from '@angular/core';
import { BoardHeaderComponent } from '../../components/board-header/board-header.component';
import { ColumnComponent } from '../../components/column/column.component';
import { Board } from '../../models/board.model';
import { Column } from '../../models/column.model';
import { Card } from '../../models/card.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ColumnDialogComponent } from '../../components/column-dialog/column-dialog.component';

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

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadColumns();
  }

  private loadColumns(): void {
    this.apiService.getColumns().subscribe({
      next: (columns) => {
        this.board.columns = columns;
        this.isLoading = false;
      },
      error: (error: Error) => {
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
      const sourceColumn = this.board.columns.find(col => col.id === event.previousContainer.id);
      const targetColumn = this.board.columns.find(col => col.id === event.container.id);
      const card = event.previousContainer.data[event.previousIndex];

      if (sourceColumn && targetColumn) {
        // Remove from source column first
        sourceColumn.cards = sourceColumn.cards.filter(c => c.id !== card.id);

        this.apiService.moveCard(event.previousContainer.id, event.container.id, card).subscribe({
          next: () => {
            const movedCard = { ...card, columnId: event.container.id };
            const cardExists = targetColumn.cards.some(c => c.id === card.id);
            if (!cardExists) {
              targetColumn.cards.splice(event.currentIndex, 0, movedCard);
            }
          },
          error: (err) => {
            console.error('Failed to move card:', err);
            // Revert the change by adding the card back to source column
            sourceColumn.cards.splice(event.previousIndex, 0, card);
          }
        });
      }
    }
  }

  onAddCard(columnId: string, card: Card) {
    console.log('BoardView: Adding card to column:', columnId, card);
    this.apiService.addCard(columnId, card).subscribe({
      next: (newCard) => {
        console.log('BoardView: Card added successfully:', newCard);
        const column = this.board.columns.find(col => col.id === columnId);
        if (column) {
          const exists = column.cards.some(c => c.id === newCard.id);
          if (!exists) {
            column.cards = [...column.cards, newCard];
          }
        }
      },
      error: (error: Error) => {
        console.error('BoardView: Failed to add card:', error);
        this.error = 'Failed to add card';
      }
    });
  }

  onUpdateColumn(column: Column): void {
    this.apiService.updateColumn(column).subscribe({
      next: (updatedColumn: Column) => {
        const index = this.board.columns.findIndex(col => col.id === column.id);
        if (index !== -1) {
          this.board.columns[index] = updatedColumn;
        }
      },
      error: (error: Error) => {
        console.error('Failed to update column:', error);
        this.error = 'Failed to update column';
      }
    });
  }

  onDeleteColumn(columnId: string): void {
    this.apiService.deleteColumn(columnId).subscribe({
      next: () => {
        this.board.columns = this.board.columns.filter(col => col.id !== columnId);
      },
      error: (error: Error) => {
        console.error('Failed to delete column:', error);
        this.error = 'Failed to delete column';
      }
    });
  }

  addNewColumn(): void {
    const dialogRef = this.dialog.open(ColumnDialogComponent, {
      width: '500px',
      data: {
        mode: 'create',
        boardId: this.board.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('BoardView: Creating new column:', result);
        this.apiService.addColumn(this.board.id, result).subscribe({
          next: (column) => {
            console.log('BoardView: Column created successfully:', column);
            this.board.columns = Array.from(new Set([...this.board.columns, column]));
          },
          error: (error: Error) => {
            console.error('BoardView: Failed to create column:', error);
            this.error = 'Failed to create column';
          }
        });
      }
    });
  }
}

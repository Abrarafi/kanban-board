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

      const card = event.container.data[event.currentIndex];
      const newColumnId = event.container.id;
      this.apiService.moveCard(event.previousContainer.id, newColumnId, card).subscribe();
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
      error: (err) => {
        console.error('BoardView: Failed to add card:', err);
        this.error = 'Failed to add card';
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
          error: (err) => {
            console.error('BoardView: Failed to create column:', err);
            this.error = 'Failed to create column';
          }
        });
      }
    });
  }
}

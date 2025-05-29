import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Board } from '../../models/board.model';
import { Column } from '../../models/column.model';
import { Card } from '../../models/card.model';
import { BoardService } from '../../../core/services/board.service';
import { ColumnService } from '../../../core/services/column.service';
import { CardService } from '../../../core/services/card.service';
import { Subject, takeUntil } from 'rxjs';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ColumnComponent } from '../../components/column/column.component';
import { MatDialog } from '@angular/material/dialog';
import { ColumnDialogComponent } from '../../components/column-dialog/column-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoardHeaderComponent } from '../../components/board-header/board-header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ColumnComponent,
    MatIconModule,
    MatButtonModule,
    BoardHeaderComponent,
    MatProgressSpinnerModule
  ]
})
export class BoardViewComponent implements OnInit, OnDestroy {
  board: Board = {
    _id: '',
    id: '',
    name: '',
    description: '',
    columns: [],
    lastModified: new Date(),
    members: 0,
    thumbnailColor: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  loadingStates = {
    board: false,
    columns: false,
    processing: false
  };
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private columnService: ColumnService,
    private cardService: CardService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBoardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBoardData(): void {
    const boardId = this.route.snapshot.paramMap.get('id');
    if (!boardId) return;

    this.loadingStates.board = true;
    this.error = null;

    this.boardService.getBoard(boardId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (board) => {
          this.board = board;
          this.loadColumns();
          this.loadingStates.board = false;
        },
        error: (err) => {
          console.error('Failed to load board:', err);
          this.error = 'Failed to load board. Please try again.';
          this.loadingStates.board = false;
      }
    });
  }

  private loadColumns(): void {
    if (!this.board?.id) return;

    this.loadingStates.columns = true;
    this.columnService.getColumns(this.board.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (columns) => {
          this.board.columns = columns;
          this.loadingStates.columns = false;
        },
        error: (err) => {
          console.error('Failed to load columns:', err);
          this.showError('Failed to load columns');
          this.loadingStates.columns = false;
      }
    });
  }

  // Column Operations
  onAddColumn(): void {
    const dialogRef = this.dialog.open(ColumnDialogComponent, {
      width: '500px',
      data: { mode: 'create', boardId: this.board.id || this.board._id }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.loadingStates.processing = true;
          this.columnService.createColumn(this.board.id || this.board._id, result)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (newColumn) => {
                this.board.columns = [...(this.board.columns || []), newColumn];
                this.loadingStates.processing = false;
              },
              error: (err) => {
                this.showError('Failed to create column');
                this.loadingStates.processing = false;
              }
            });
        }
      });
  }

  onUpdateColumn(updatedColumn: Column): void {
    this.loadingStates.processing = true;
    this.columnService.updateColumn(updatedColumn.id, updatedColumn)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (column) => {
          this.board.columns = (this.board.columns || []).map(c => 
            c.id === column.id ? column : c
          );
          this.loadingStates.processing = false;
        },
        error: (err) => {
          this.showError('Failed to update column');
          this.loadingStates.processing = false;
        }
      });
  }

  onDeleteColumn(columnId: string): void {
    this.loadingStates.processing = true;
    this.columnService.deleteColumn(columnId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.board.columns = (this.board.columns || []).filter(c => c.id !== columnId);
          this.loadingStates.processing = false;
        },
        error: (err) => {
          this.showError('Failed to delete column');
          this.loadingStates.processing = false;
        }
      });
  }

  // Card Operations
  onAddCard(columnId: string, cardData: Partial<Card>): void {
    this.loadingStates.processing = true;
    this.cardService.createCard(columnId, cardData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newCard) => {
          this.board.columns = (this.board.columns || []).map(column => {
            if (column.id === columnId) {
              return {
                ...column,
                cards: [...(column.cards || []), newCard]
              };
            }
            return column;
          });
          this.loadingStates.processing = false;
        },
        error: (err) => {
          this.showError('Failed to create card');
          this.loadingStates.processing = false;
        }
      });
  }

  onCardUpdated(updatedCard: Card): void {
    this.loadingStates.processing = true;
    this.cardService.updateCard(updatedCard.id, updatedCard)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (card) => {
          this.updateCardInState(card);
          this.loadingStates.processing = false;
        },
        error: (err) => {
          this.showError('Failed to update card');
          this.loadingStates.processing = false;
        }
      });
  }

  onCardDeleted(cardId: string): void {
    this.loadingStates.processing = true;
    this.cardService.deleteCard(cardId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.removeCardFromState(cardId);
          this.loadingStates.processing = false;
        },
        error: (err) => {
          this.showError('Failed to delete card');
          this.loadingStates.processing = false;
        }
      });
  }

  onCardDropped(event: CdkDragDrop<Card[]>): void {
    const card: Card = event.item.data;
    const targetColumnId = event.container.id;

    if (!card._id || !targetColumnId) {
      this.showError('Invalid card or column ID');
      return;
    }

    // Optimistic UI update
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.loadingStates.processing = true;
    this.cardService.moveCard(card._id, '', targetColumnId, event.currentIndex)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
          error: (err) => {
          this.showError('Failed to move card');
          // Revert UI changes
          if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.currentIndex, event.previousIndex);
          } else {
            transferArrayItem(
              event.container.data,
              event.previousContainer.data,
              event.currentIndex,
              event.previousIndex
            );
          }
          this.loadingStates.processing = false;
        },
        complete: () => {
          this.loadingStates.processing = false;
        }
      });
  }

  // Helper methods
  private updateCardInState(updatedCard: Card): void {
    this.board.columns = (this.board.columns || []).map(column => {
      if (!column.cards) return column;
      
      const cardIndex = column.cards.findIndex(c => c.id === updatedCard.id);
      if (cardIndex !== -1) {
        const newCards = [...column.cards];
        newCards[cardIndex] = updatedCard;
        return { ...column, cards: newCards };
      }
      return column;
    });
  }

  private removeCardFromState(cardId: string): void {
    this.board.columns = (this.board.columns || []).map(column => ({
      ...column,
      cards: column.cards?.filter(c => c.id !== cardId) || []
    }));
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  getConnectedColumnIds(currentColumnId: string): string[] {
    return (this.board.columns || [])
      .filter(col => col._id !== currentColumnId)
      .map(col => col._id || '')
      .filter(id => id !== ''); // Filter out empty IDs
  }

  trackByColumnId(index: number, column: Column): string {
    return column._id || `column_${index}`;
  }

  retryLoading(): void {
    this.error = null;
    this.loadBoardData();
  }
}
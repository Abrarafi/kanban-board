import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { Column } from '../../models/column.model';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CardComponent } from '../card/card.component';
import { NgFor } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CardDialogComponent } from '../card-dialog/card-dialog.component';
import { Card } from '../../models/card.model';
import { CardService } from '../../../core/services/card.service';
import { MoveCardDialogComponent } from '../move-card-dialog/move-card-dialog.component';
import { EditColumnDialogComponent } from '../edit-column-dialog/edit-column-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css'],
  standalone: true,
  imports: [NgFor, CardComponent, MatIconModule, ClickOutsideDirective, DragDropModule]
})
export class ColumnComponent implements OnDestroy {
  @Input() column!: Column;
  @Input() connectedTo: string[] = [];
  @Input() allColumns: Column[] = [];
  @Input() isProcessing = false;
  @Output() cardDropped = new EventEmitter<CdkDragDrop<Card[]>>();
  @Output() addCard = new EventEmitter<Card>();
  @Output() deleteColumn = new EventEmitter<string>();
  @Output() updateColumn = new EventEmitter<Column>();
  @Output() cardUpdated = new EventEmitter<Card>();
  @Output() cardMoved = new EventEmitter<{card: Card, newColumnId: string}>();
  @Output() cardDeleted = new EventEmitter<string>();

  isColumnMenuOpen = false;
  private destroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private cardService: CardService,
    private snackBar: MatSnackBar
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleColumnMenu(): void {
    this.isColumnMenuOpen = !this.isColumnMenuOpen;
  }

  closeColumnMenu(): void {
    this.isColumnMenuOpen = false;
  }

  onEditColumn(): void {
    this.closeColumnMenu();
    const dialogRef = this.dialog.open(EditColumnDialogComponent, {
      width: '400px',
      data: {
        mode: 'edit',
        column: this.column
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          const updatedColumn: Column = {
            ...this.column,
            name: result.name,
            description: result.description,
            color: result.color,
            wip: result.wip,
            updatedAt: new Date()
          };
          this.updateColumn.emit(updatedColumn);
        }
      });
  }

  onDeleteColumn(): void {
    this.closeColumnMenu();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Column',
        message: 'All cards will be lost. Do you want to delete this column?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result && this.column._id) {
          this.deleteColumn.emit(this.column._id);
        }
      });
  }

  onDrop(event: CdkDragDrop<Card[]>): void {
    this.cardDropped.emit(event);
  }

  onAddCard(): void {
    if (!this.column?._id) {
      this.snackBar.open('Invalid column ID', 'Close', { duration: 3000 });
      return;
    }

    const dialogRef = this.dialog.open(CardDialogComponent, {
      width: '500px',
      data: {
        mode: 'create',
        columnId: this.column._id
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.addCard.emit(result as Card);
        }
      });
  }

  onEditCard(card: Card): void {
    if (!this.column._id || !card._id) {
      this.showError('Invalid column or card ID');
      return;
    }

    const dialogRef = this.dialog.open(CardDialogComponent, {
      width: '500px',
      data: {
        mode: 'edit',
        columnId: this.column._id,
        card: card
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result && card._id) {
          this.isProcessing = true;
          this.cardService.updateCard(card._id, result)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (updatedCard) => {
                this.cardUpdated.emit(updatedCard);
                this.isProcessing = false;
              },
              error: (err) => {
                this.showError('Failed to update card');
                this.isProcessing = false;
              }
            });
        }
      });
  }

  onMoveCard(card: Card): void {
    if (!this.column._id || !card._id) {
      this.showError('Invalid column or card ID');
      return;
    }

    const dialogRef = this.dialog.open(MoveCardDialogComponent, {
      width: '400px',
      data: {
        card: card,
        columns: this.allColumns.filter(col => col._id !== this.column._id),
        currentColumnId: this.column._id
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result && card._id && this.column._id) {
          this.isProcessing = true;
          const destinationColumn = result as Column;
          if (!destinationColumn._id) {
            this.showError('Invalid destination column');
            return;
          }
          const newIndex = destinationColumn.cards.length;
          
          this.cardService.moveCard(
            card._id,
            this.column._id,
            destinationColumn._id,
            newIndex
          ).pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.cardMoved.emit({
                card: card,
                newColumnId: destinationColumn._id || ''
              });
              this.isProcessing = false;
            },
            error: (err) => {
              this.showError('Failed to move card');
              this.isProcessing = false;
            }
          });
        }
      });
  }

  onDeleteCard(card: Card): void {
    if (!card._id) {
      this.showError('Invalid card ID');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Card',
        message: 'Are you sure you want to delete this card?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(confirmed => {
        if (confirmed && card._id) {
          this.isProcessing = true;
          this.cardService.deleteCard(card._id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.cardDeleted.emit(card._id);
                this.isProcessing = false;
              },
              error: (err) => {
                this.showError('Failed to delete card');
                this.isProcessing = false;
              }
            });
        }
      });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  trackByCardId(index: number, card: Card): string {
    return card._id || `card_${index}`;
  }
}
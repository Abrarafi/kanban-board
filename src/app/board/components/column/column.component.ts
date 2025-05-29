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
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    NgFor,
    CardComponent,
    ClickOutsideDirective,
    DragDropModule
  ],
  template: `
    <div class="column">
      <div class="column-header">
        <div class="column-title" *ngIf="!isEditing">
          <h3>{{ column.name }}</h3>
          <div class="column-actions">
            <button mat-icon-button (click)="startEditing()">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button (click)="onDelete()">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>
        <div class="column-title-edit" *ngIf="isEditing">
          <mat-form-field appearance="outline">
            <input matInput [(ngModel)]="editedTitle" (keyup.enter)="saveTitle()">
          </mat-form-field>
          <div class="edit-actions">
            <button mat-icon-button (click)="saveTitle()">
              <mat-icon>check</mat-icon>
            </button>
            <button mat-icon-button (click)="cancelEditing()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </div>
      </div>
      <div class="column-content">
        <div class="card" *ngFor="let card of column.cards" (click)="onCardClick(card)">
          <h4>{{ card.title }}</h4>
          <p>{{ card.description }}</p>
        </div>
        <button mat-button class="add-card" (click)="onAddCard()">
          <mat-icon>add</mat-icon>
          Add Card
        </button>
      </div>
    </div>
  `,
  styles: [`
    .column {
      background: #f4f5f7;
      border-radius: 8px;
      padding: 16px;
      min-width: 280px;
      margin: 0 8px;
    }
    .column-header {
      margin-bottom: 16px;
    }
    .column-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .column-title h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
    .column-actions {
      display: flex;
      gap: 4px;
    }
    .column-title-edit {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .edit-actions {
      display: flex;
      gap: 4px;
    }
    .column-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .card {
      background: white;
      border-radius: 4px;
      padding: 12px;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    }
    .card h4 {
      margin: 0 0 8px 0;
      font-size: 14px;
    }
    .card p {
      margin: 0;
      font-size: 12px;
      color: #666;
    }
    .add-card {
      width: 100%;
      justify-content: flex-start;
      color: #666;
    }
    .add-card mat-icon {
      margin-right: 8px;
    }
  `]
})
export class ColumnComponent implements OnDestroy {
  @Input() column: any = { name: '', cards: [] };
  @Input() connectedTo: string[] = [];
  @Input() allColumns: Column[] = [];
  @Input() isProcessing = false;
  @Output() cardDropped = new EventEmitter<CdkDragDrop<Card[]>>();
  @Output() addCard = new EventEmitter<string>();
  @Output() deleteColumn = new EventEmitter<string>();
  @Output() updateColumn = new EventEmitter<Column>();
  @Output() cardUpdated = new EventEmitter<Card>();
  @Output() cardMoved = new EventEmitter<{card: Card, newColumnId: string}>();
  @Output() cardDeleted = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() update = new EventEmitter<{id: string, title: string}>();
  @Output() cardClick = new EventEmitter<Card>();

  isColumnMenuOpen = false;
  isEditing = false;
  editedTitle = '';
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

  toggleColumnMenu(event: MouseEvent): void {
    event.stopPropagation();
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
    if (!this.column._id) {
      this.showError('Invalid column ID');
      return;
    }

    if (event.previousContainer === event.container) {
      // Same column drop - just reorder
      const card = event.item.data;
      if (!card._id) {
        this.showError('Invalid card ID');
        return;
      }
      const newIndex = event.currentIndex;
      
      this.isProcessing = true;
      this.cardService.moveCard(
        card._id,
        this.column._id,
        this.column._id,
        newIndex
      ).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.cardDropped.emit(event);
          this.isProcessing = false;
          window.location.reload();
        },
        error: (err) => {
          this.showError('Failed to move card');
          this.isProcessing = false;
        }
      });
    } else {
      // Different column drop
      const card = event.item.data;
      if (!card._id) {
        this.showError('Invalid card ID');
        return;
      }
      const newIndex = event.currentIndex;
      const targetColumnId = event.container.id;
      if (!targetColumnId) {
        this.showError('Invalid target column');
        return;
      }
      
      this.isProcessing = true;
      this.cardService.moveCard(
        card._id,
        this.column._id,
        targetColumnId,
        newIndex
      ).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.cardDropped.emit(event);
          this.isProcessing = false;
          window.location.reload();
        },
        error: (err) => {
          this.showError('Failed to move card');
          this.isProcessing = false;
        }
      });
    }
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
          this.addCard.emit(this.column._id);
          window.location.reload();
        }
      });
  }

  onEditCard(card: Card): void {
    if (!card._id) {
      this.showError('Invalid card ID');
      return;
    }

    const dialogRef = this.dialog.open(CardDialogComponent, {
      width: '500px',
      data: {
        mode: 'edit',
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
                window.location.reload();
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
              window.location.reload();
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

  startEditing(): void {
    this.editedTitle = this.column.name;
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
  }

  saveTitle(): void {
    if (this.editedTitle.trim()) {
      this.update.emit({ id: this.column._id, title: this.editedTitle.trim() });
      this.isEditing = false;
    }
  }

  onDelete(): void {
    this.delete.emit(this.column._id);
  }

  onCardClick(card: Card): void {
    this.cardClick.emit(card);
  }
}
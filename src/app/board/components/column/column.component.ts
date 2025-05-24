import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Column } from '../../models/column.model';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CardComponent } from '../card/card.component';
import { NgFor } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CardDialogComponent } from '../card-dialog/card-dialog.component';
import { Card } from '../../models/card.model';
import { ApiService } from '../../services/api.service';
import { MoveCardDialogComponent } from '../move-card-dialog/move-card-dialog.component';
import { EditColumnDialogComponent } from '../edit-column-dialog/edit-column-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css'],
  standalone: true,
  imports: [DragDropModule, CardComponent, NgFor, MatIconModule, ClickOutsideDirective]
})
export class ColumnComponent {
  @Input() column!: Column;
  @Input() connectedTo: string[] = [];
  @Input() allColumns: Column[] = [];
  @Output() cardDropped = new EventEmitter<CdkDragDrop<Card[]>>();
  @Output() addCard = new EventEmitter<Card>();
  @Output() deleteColumn = new EventEmitter<string>();
  @Output() updateColumn = new EventEmitter<Column>();

  isColumnMenuOpen = false;

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService
  ) {}

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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedColumn: Column = {
          ...this.column,
          name: result.name,
          color: result.color,
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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteColumn.emit(this.column.id);
      }
    });
  }

  onDrop(event: CdkDragDrop<Card[]>): void {
    this.cardDropped.emit(event);
  }

  onAddCard(): void {
    const dialogRef = this.dialog.open(CardDialogComponent, {
      width: '500px',
      data: {
        mode: 'create',
        columnId: this.column.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Column received card:', result);
        this.addCard.emit(result as Card);
      }
    });
  }

  onEditCard(card: Card): void {
    this.apiService.updateCard(this.column.id, card).subscribe({
      next: (updatedCard) => {
        const index = this.column.cards.findIndex(c => c.id === card.id);
        if (index !== -1) {
          this.column.cards[index] = updatedCard;
        }
      },
      error: (err) => {
        console.error('Failed to update card:', err);
      }
    });
  }

  onMoveCard(card: Card): void {
    const dialogRef = this.dialog.open(MoveCardDialogComponent, {
      width: '400px',
      data: {
        card: card,
        columns: this.allColumns,
        currentColumnId: this.column.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const destinationColumn = result as Column;
        this.apiService.moveCard(this.column.id, destinationColumn.id, card).subscribe({
          next: () => {
            this.column.cards = this.column.cards.filter(c => c.id !== card.id);
            destinationColumn.cards.push({...card, columnId: destinationColumn.id});
          },
          error: (err) => {
            console.error('Failed to move card:', err);
          }
        });
      }
    });
  }

  onDeleteCard(card: Card): void {
    this.apiService.deleteCard(this.column.id, card.id).subscribe({
      next: () => {
        this.column.cards = this.column.cards.filter(c => c.id !== card.id);
      },
      error: (err) => {
        console.error('Failed to delete card:', err);
      }
    });
  }
}

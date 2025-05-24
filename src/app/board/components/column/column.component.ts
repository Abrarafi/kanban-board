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

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css'],
  standalone: true,
  imports: [DragDropModule, CardComponent, NgFor]
})
export class ColumnComponent {
  @Input() column!: Column;
  @Input() connectedTo: string[] = [];
  @Input() allColumns: Column[] = [];
  @Output() cardDropped = new EventEmitter<CdkDragDrop<Card[]>>();
  @Output() addCard = new EventEmitter<Card>();

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService
  ) {}

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

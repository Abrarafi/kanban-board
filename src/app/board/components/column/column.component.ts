import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Column } from '../../models/column.model';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CardComponent } from '../card/card.component';
import { NgFor } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CardDialogComponent } from '../card-dialog/card-dialog.component';
import { Card } from '../../models/card.model';

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
  @Output() cardDropped = new EventEmitter<CdkDragDrop<Card[]>>();
  @Output() addCard = new EventEmitter<Card>();

  constructor(private dialog: MatDialog) {}

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
}

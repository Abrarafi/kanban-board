import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Column } from '../../models/column.model';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CardComponent } from '../card/card.component';
import { NgFor } from '@angular/common';

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
  @Output() cardDropped = new EventEmitter<CdkDragDrop<any[]>>();
  @Output() addCard = new EventEmitter<string>();

  onDrop(event: CdkDragDrop<any[]>): void {
    this.cardDropped.emit(event);
  }

  onAddCard(): void {
    const title = prompt('Enter card title:');
    if (title) {
      this.addCard.emit(title);
    }
  }
}

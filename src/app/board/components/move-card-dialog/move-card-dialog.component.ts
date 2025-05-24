import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Column } from '../../models/column.model';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-move-card-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">Move Card</h2>
      <p class="text-gray-600 mb-4">Select destination column for "{{ data.card.title }}"</p>
      
      <div class="space-y-2">
        @for(column of data.columns; track column.id) {
          @if(column.id !== data.currentColumnId) {
            <button
              (click)="moveToColumn(column)"
              class="w-full p-3 text-left rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors flex items-center justify-between group"
            >
              <span class="font-medium text-gray-700">{{ column.name }}</span>
              <span class="text-gray-400 group-hover:text-gray-600">
                {{ column.cards.length }} cards
              </span>
            </button>
          }
        }
      </div>

      <div class="mt-6 flex justify-end">
        <button mat-button (click)="onCancel()">Cancel</button>
      </div>
    </div>
  `
})
export class MoveCardDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<MoveCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      card: Card;
      columns: Column[];
      currentColumnId: string;
    }
  ) {}

  moveToColumn(column: Column): void {
    this.dialogRef.close(column);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 
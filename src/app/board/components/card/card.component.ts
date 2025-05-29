import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Card } from '../../models/card.model';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CardDialogComponent } from '../card-dialog/card-dialog.component';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <div class="card" [class.editing]="isEditing">
      <div class="card-content" *ngIf="!isEditing">
        <div class="card-header">
          <h4>{{ card.title }}</h4>
          <div class="card-actions">
            <button mat-icon-button (click)="startEditing()">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button (click)="onDelete()">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>
        <p>{{ card.description }}</p>
      </div>
      <div class="card-edit" *ngIf="isEditing">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Title</mat-label>
          <input matInput [(ngModel)]="editedTitle" (keyup.enter)="saveCard()">
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Description</mat-label>
          <textarea matInput [(ngModel)]="editedDescription" rows="3"></textarea>
        </mat-form-field>
        <div class="edit-actions">
          <button mat-button (click)="saveCard()">Save</button>
          <button mat-button (click)="cancelEditing()">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: white;
      border-radius: 4px;
      padding: 12px;
      margin-bottom: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    .card-header h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
    }
    .card-actions {
      display: flex;
      gap: 4px;
    }
    .card p {
      margin: 0;
      font-size: 12px;
      color: #666;
    }
    .card-edit {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .edit-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .w-full {
      width: 100%;
    }
  `]
})
export class CardComponent {
  @Input() card: Card = { title: '', description: '' };
  @Output() update = new EventEmitter<Card>();
  @Output() delete = new EventEmitter<string>();

  isEditing = false;
  editedTitle = '';
  editedDescription = '';

  startEditing(): void {
    this.editedTitle = this.card.title;
    this.editedDescription = this.card.description;
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
  }

  saveCard(): void {
    if (this.editedTitle.trim()) {
      this.update.emit({
        ...this.card,
        title: this.editedTitle.trim(),
        description: this.editedDescription.trim()
      });
      this.isEditing = false;
    }
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this card?')) {
      this.delete.emit(this.card._id);
    }
  }
}

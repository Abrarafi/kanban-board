import { Component, Input } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Card } from '../../models/card.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  standalone: true,
  imports: [DatePipe, NgClass, MatIconModule]
})
export class CardComponent {
  @Input() card!: Card;

  get priorityClasses(): string {
    const classes: { [key: string]: string } = {
      'LOW': 'bg-green-100 text-green-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'HIGH': 'bg-red-100 text-red-800'
    };
    return classes[this.card.priority || ''] || '';
  }

  get statusClasses(): string {
    const classes: { [key: string]: string } = {
      'Not Started': 'bg-gray-100 text-gray-800',
      'In Research': 'bg-blue-100 text-blue-800',
      'On Track': 'bg-indigo-100 text-indigo-800',
      'Completed': 'bg-green-100 text-green-800'
    };
    return classes[this.card.status || ''] || '';
  }

  get isOverdue(): boolean {
    if (!this.card.dueDate) return false;
    return new Date(this.card.dueDate) < new Date();
  }

  get formattedDate(): string {
    if (!this.card.dueDate) return '';
    const date = new Date(this.card.dueDate);
    return date.toLocaleDateString();
  }

  get initials(): string {
    return this.card.assignee?.name.charAt(0).toUpperCase() || '';
  }

  get avatarUrl(): string | null {
    return this.card.assignee?.avatar || null;
  }
}

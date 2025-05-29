import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Card } from '../../models/card.model';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

@Component({
  selector: 'app-card-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  providers: [
    provideNativeDateAdapter(),
    MatDatepickerModule
  ],
  templateUrl: './card-dialog.component.html'
})
export class CardDialogComponent {
  cardForm: FormGroup;
  priorities = ['LOW', 'MEDIUM', 'HIGH'];
  statuses = ['Not Started', 'In Research', 'On Track', 'Completed'];
  users: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'assets/avatars/john.jpg' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'assets/avatars/jane.jpg' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', avatar: 'assets/avatars/bob.jpg' },
    { id: '4', name: 'Alice Brown', email: 'alice@example.com', avatar: 'assets/avatars/alice.jpg' }
  ];

  constructor(
    private dialogRef: MatDialogRef<CardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      mode: 'create' | 'edit';
      columnId: string;
      card?: Card;
    },
    private fb: FormBuilder
  ) {
    this.cardForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      priority: [''],
      status: ['Not Started'],
      dueDate: [null],
      assignees: [[]]
    });

    if (data.mode === 'edit' && data.card) {
      this.cardForm.patchValue({
        title: data.card.title,
        description: data.card.description,
        priority: data.card.priority,
        status: data.card.status,
        dueDate: data.card.dueDate ? new Date(data.card.dueDate) : null,
        assignees: data.card.assignees || []
      });
    }
  }

  compareUsers(user1: User, user2: User): boolean {
    return user1?.id === user2?.id;
  }

  onSubmit(): void {
    if (this.cardForm.invalid) {
      Object.keys(this.cardForm.controls).forEach(key => {
        const control = this.cardForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    const formValue = this.cardForm.value;
    const card: Partial<Card> = {
      title: formValue.title,
      description: formValue.description || '',
      priority: formValue.priority,
      status: formValue.status,
      dueDate: formValue.dueDate,
      assignees: formValue.assignees,
      updatedAt: new Date()
    };

    if (this.data.mode === 'create') {
      if (!this.data.columnId) {
        console.error('Column ID is required for creating a new card');
        return;
      }
      card.columnId = this.data.columnId;
      card.createdAt = new Date();
    } else if (this.data.card) {
      card._id = this.data.card._id;
      card.createdAt = this.data.card.createdAt;
    }

    this.dialogRef.close(card);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

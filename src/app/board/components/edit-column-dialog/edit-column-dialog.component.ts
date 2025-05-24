import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Column } from '../../models/column.model';

@Component({
  selector: 'app-edit-column-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">{{ data.mode === 'edit' ? 'Edit Column' : 'Create Column' }}</h2>
      
      <form [formGroup]="columnForm" class="flex flex-col gap-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter column name">
          <mat-error *ngIf="columnForm.get('name')?.hasError('required')">
            Name is required
          </mat-error>
        </mat-form-field>

        <div class="flex flex-col gap-2">
          <label class="text-gray-600 text-sm">Column Color</label>
          <div class="flex items-center gap-3">
            <input type="color" formControlName="color" 
                   class="w-12 h-12 rounded cursor-pointer border-0">
            <span class="text-sm text-gray-500">Choose a color for the column</span>
          </div>
        </div>
      </form>

      <div class="mt-6 flex justify-end gap-2">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button 
          mat-raised-button 
          color="primary"
          [disabled]="columnForm.invalid"
          (click)="onSubmit()"
        >
          Save
        </button>
      </div>
    </div>
  `
})
export class EditColumnDialogComponent {
  columnForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EditColumnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      mode: 'create' | 'edit';
      column: Column;
    },
    private fb: FormBuilder
  ) {
    this.columnForm = this.fb.group({
      name: ['', [Validators.required]],
      color: ['#E2E8F0']
    });

    if (data.mode === 'edit' && data.column) {
      this.columnForm.patchValue({
        name: data.column.name,
        color: data.column.color
      });
    }
  }

  onSubmit(): void {
    if (this.columnForm.valid) {
      this.dialogRef.close(this.columnForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 
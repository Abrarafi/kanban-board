import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-2">{{ data.title }}</h2>
      <p class="text-gray-600 mb-6">{{ data.message }}</p>
      
      <div class="flex justify-end gap-2">
        <button mat-button (click)="onCancel()">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button 
          mat-raised-button 
          [color]="data.confirmColor || 'primary'"
          (click)="onConfirm()"
        >
          {{ data.confirmText || 'Confirm' }}
        </button>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      message: string;
      confirmText?: string;
      cancelText?: string;
      confirmColor?: 'primary' | 'accent' | 'warn';
    }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
} 
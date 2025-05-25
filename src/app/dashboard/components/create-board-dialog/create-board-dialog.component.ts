import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-board-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './create-board-dialog.component.html',
  styleUrls: ['./create-board-dialog.component.css']
})
export class CreateBoardDialogComponent {
  boardForm: FormGroup;
  colorOptions = [
    { value: '#60A5FA', name: 'Blue' },
    { value: '#34D399', name: 'Green' },
    { value: '#F87171', name: 'Red' },
    { value: '#FBBF24', name: 'Yellow' },
    { value: '#A78BFA', name: 'Purple' },
    { value: '#EC4899', name: 'Pink' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateBoardDialogComponent>
  ) {
    this.boardForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      thumbnailColor: ['#60A5FA']
    });

    // Configure dialog to close on backdrop click
    this.dialogRef.backdropClick().subscribe(() => this.onCancel());
  }

  @HostListener('window:keyup.esc')
  onEscKeyUp() {
    this.onCancel();
  }

  onSubmit(): void {
    if (this.boardForm.valid) {
      this.dialogRef.close(this.boardForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  selectColor(color: string): void {
    this.boardForm.patchValue({ thumbnailColor: color });
  }
} 
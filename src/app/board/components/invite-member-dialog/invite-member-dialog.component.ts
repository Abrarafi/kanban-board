import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-invite-member-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <h2 mat-dialog-title>Invite Member</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Email</mat-label>
        <input matInput [(ngModel)]="email" type="email" placeholder="Enter email address">
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onInvite()" [disabled]="!email">Invite</button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      display: block;
      padding: 20px;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class InviteMemberDialogComponent {
  email: string = '';

  constructor(
    public dialogRef: MatDialogRef<InviteMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { boardId: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onInvite(): void {
    if (this.email) {
      this.dialogRef.close(this.email);
    }
  }
} 
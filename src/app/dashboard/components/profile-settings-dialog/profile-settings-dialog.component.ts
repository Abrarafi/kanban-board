import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-profile-settings-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule
  ],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">Profile Settings</h2>
      
      <mat-tab-group>
        <!-- Profile Information Tab -->
        <mat-tab label="Profile Information">
          <form [formGroup]="profileForm" (ngSubmit)="onProfileSubmit()" class="mt-4 space-y-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" placeholder="Enter your name">
              <mat-error *ngIf="profileForm.get('name')?.hasError('required')">
                Name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" placeholder="Enter your email" readonly>
            </mat-form-field>

            <div class="flex justify-end gap-2">
              <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid || isProfileLoading">
                {{ isProfileLoading ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </mat-tab>

        <!-- Change Password Tab -->
        <mat-tab label="Change Password">
          <form [formGroup]="passwordForm" (ngSubmit)="onPasswordSubmit()" class="mt-4 space-y-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Current Password</mat-label>
              <input matInput type="password" formControlName="currentPassword" placeholder="Enter current password">
              <mat-error *ngIf="passwordForm.get('currentPassword')?.hasError('required')">
                Current password is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>New Password</mat-label>
              <input matInput type="password" formControlName="newPassword" placeholder="Enter new password">
              <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
                New password is required
              </mat-error>
              <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
                Password must be at least 6 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Confirm New Password</mat-label>
              <input matInput type="password" formControlName="confirmPassword" placeholder="Confirm new password">
              <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
                Please confirm your password
              </mat-error>
              <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('passwordMismatch')">
                Passwords do not match
              </mat-error>
            </mat-form-field>

            <div class="flex justify-end gap-2">
              <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="passwordForm.invalid || isPasswordLoading">
                {{ isPasswordLoading ? 'Changing...' : 'Change Password' }}
              </button>
            </div>
          </form>
        </mat-tab>
      </mat-tab-group>
    </div>
  `
})
export class ProfileSettingsDialogComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  isProfileLoading = false;
  isPasswordLoading = false;
  errorMessage: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<ProfileSettingsDialogComponent>,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.profileForm.patchValue({
        name: currentUser.name,
        email: currentUser.email
      });
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onProfileSubmit() {
    if (this.profileForm.invalid) return;

    this.isProfileLoading = true;
    this.errorMessage = null;

    const { name } = this.profileForm.value;
    this.authService.updateProfile({ name }).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update profile';
        this.isProfileLoading = false;
      }
    });
  }

  onPasswordSubmit() {
    if (this.passwordForm.invalid) return;

    this.isPasswordLoading = true;
    this.errorMessage = null;

    const { currentPassword, newPassword } = this.passwordForm.value;
    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to change password';
        this.isPasswordLoading = false;
      }
    });
  }
} 
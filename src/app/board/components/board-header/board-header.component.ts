import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InviteMemberDialogComponent } from '../invite-member-dialog/invite-member-dialog.component';

@Component({
  selector: 'app-board-header',
  templateUrl: './board-header.component.html',
  styleUrls: ['./board-header.component.css'],
  imports: [MatIconModule, CommonModule],
  standalone: true
})
export class BoardHeaderComponent {
  @Input() boardTitle: string | undefined = 'Kanban Board';
  @Input() showActions = true;
  @Input() isProcessing = false;
  @Input() boardId: string = '';
  @Output() addColumn = new EventEmitter<void>();
  @Output() inviteMembers = new EventEmitter<void>();
  @Output() shareBoard = new EventEmitter<void>();
  @Output() deleteColumn = new EventEmitter<string>();
  @Output() updateColumn = new EventEmitter<{id: string, title: string}>();
  
  isMenuOpen = false;
  isShareDropdownOpen = false;
  isMembersListOpen = false;

  // Mock data for members - replace with actual data from your service
  members = [
    { name: 'John Doe', role: 'Admin', avatar: 'JD' },
    { name: 'Jane Smith', role: 'Member', avatar: 'JS' },
    { name: 'Mike Johnson', role: 'Member', avatar: 'MJ' }
  ];

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  onBack(): void {
    this.router.navigate(['/dashboard']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isShareDropdownOpen = false;
      this.isMenuOpen = false;
      this.isMembersListOpen = false;
    }
  }

  toggleMembersList(): void {
    this.isMembersListOpen = !this.isMembersListOpen;
    // Close other dropdowns
    this.isShareDropdownOpen = false;
    this.isMenuOpen = false;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    // Close other dropdowns
    if (this.isMenuOpen) {
      this.isShareDropdownOpen = false;
      this.isMembersListOpen = false;
    }
  }

  toggleShareDropdown(): void {
    this.isShareDropdownOpen = !this.isShareDropdownOpen;
    // Close other dropdowns
    if (this.isShareDropdownOpen) {
      this.isMenuOpen = false;
      this.isMembersListOpen = false;
    }
  }

  onAddColumn(): void {
    this.addColumn.emit();
  }

  onDeleteColumn(columnId: string): void {
    if (confirm('Are you sure you want to delete this column? All cards in this column will be deleted.')) {
      this.deleteColumn.emit(columnId);
    }
  }

  onUpdateColumn(columnId: string, newTitle: string): void {
    this.updateColumn.emit({ id: columnId, title: newTitle });
  }

  onInviteMembers(): void {
    if (!this.boardId) {
      this.showError('Invalid board ID');
      return;
    }

    const dialogRef = this.dialog.open(InviteMemberDialogComponent, {
      width: '400px',
      data: { boardId: this.boardId }
    });

    dialogRef.afterClosed().subscribe(email => {
      if (email) {
        this.inviteMembers.emit(email);
        this.showSuccess('Invitation sent successfully');
      }
    });
  }

  onShareBoard(): void {
    this.shareBoard.emit();
  }

  copyBoardLink(): void {
    // Implementation for copying board link
    const boardUrl = window.location.href;
    navigator.clipboard.writeText(boardUrl);
    alert('Board link copied to clipboard!');
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}
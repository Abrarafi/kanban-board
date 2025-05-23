import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-board-header',
  templateUrl: './board-header.component.html',
  styleUrls: ['./board-header.component.css'],
  imports: [MatIconModule],
  standalone: true
})
export class BoardHeaderComponent {
  @Input() boardTitle = 'Kanban Board';
  @Input() showActions = true;
  @Output() addColumn = new EventEmitter<void>();
  @Output() inviteMembers = new EventEmitter<void>();
  @Output() shareBoard = new EventEmitter<void>();
  
  isMenuOpen = false;
  isShareDropdownOpen = false;
  isMembersListOpen = false;

  // Mock data for members - replace with actual data from your service
  members = [
    { name: 'John Doe', role: 'Admin', avatar: 'JD' },
    { name: 'Jane Smith', role: 'Member', avatar: 'JS' },
    { name: 'Mike Johnson', role: 'Member', avatar: 'MJ' }
  ];

  constructor(private elementRef: ElementRef) {}

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

  onInviteMembers(): void {
    this.inviteMembers.emit();
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
}
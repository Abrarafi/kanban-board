import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { DashboardService, Board, UserProfile } from '../../services/dashboard.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateBoardDialogComponent } from '../../components/create-board-dialog/create-board-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, MatDialogModule]
})
export class DashboardComponent implements OnInit {
  boards: Board[] = [];
  userProfile!: UserProfile;
  isProfileMenuOpen = false;

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private dialog: MatDialog,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadBoards();
    this.loadUserProfile();
  }

  private loadBoards(): void {
    this.dashboardService.getBoards().subscribe(boards => {
      this.boards = boards;
    });
  }

  private loadUserProfile(): void {
    this.dashboardService.getUserProfile().subscribe(profile => {
      this.userProfile = profile;
    });
  }

  openBoard(boardId: string): void {
    this.router.navigate(['/board', boardId]);
  }

  createNewBoard(): void {
    const dialogRef = this.dialog.open(CreateBoardDialogComponent, {
      width: '500px',
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'backdrop-blur-sm',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dashboardService.createBoard(result).subscribe(board => {
          this.router.navigate(['/board', board.id]);
        });
      }
    });
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Check if click is outside the profile menu
    const profileMenu = this.elementRef.nativeElement.querySelector('.profile-menu');
    const profileButton = this.elementRef.nativeElement.querySelector('.profile-button');
    
    if (profileMenu && !profileMenu.contains(event.target) && !profileButton?.contains(event.target)) {
      this.isProfileMenuOpen = false;
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  logout(): void {
    // Implement logout logic here
    this.router.navigate(['/login']);
  }
} 
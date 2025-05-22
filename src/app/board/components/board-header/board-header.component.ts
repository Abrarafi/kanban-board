import { Component, EventEmitter,Input, Output } from '@angular/core';

@Component({
  selector: 'app-board-header',
  imports: [],
  templateUrl: './board-header.component.html',
  styleUrl: './board-header.component.css'
})
export class BoardHeaderComponent {
  @Input() boardTitle = 'Kanban Board';
  @Input() showActions = true;
  @Output() addColumn = new EventEmitter<void>();
  
  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onAddColumn(): void {
    this.addColumn.emit();
  }
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Board } from '../models/board.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private board: Board = {
    id: 'board1',
    name: 'Project Board',
    columns: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  constructor(private storageService: StorageService) {
    this.board.columns = this.storageService.getColumns();
  }

  getBoard(): Observable<Board> {
    this.board.columns = this.storageService.getColumns();
    return of(this.board);
  }

  updateBoard(board: Board): Observable<Board> {
    this.board = {
      ...board,
      updatedAt: new Date()
    };
    return of(this.board);
  }

  getConnectedColumnIds(currentColumnId: string): string[] {
    return this.board.columns
      .map(col => col.id)
      .filter(id => id !== currentColumnId);
  }
} 
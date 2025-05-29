import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators'; // Add this import
import { Board } from '../../board/models/board.model';
import { Card } from '../../board/models/card.model';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService extends ApiService {
  protected override apiUrl = `${environment.apiUrl}/boards`;

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getBoard(boardId: string): Observable<Board> {
    return this.get<Board>(`/${boardId}`);
  }

  getBoards(): Observable<Board[]> {
    return this.get<Board[]>('');
  }

  createBoard(board: Partial<Board>): Observable<Board> {
    return this.post<Board>('', board);
  }

  updateBoard(boardId: string, board: Partial<Board>): Observable<Board> {
    return this.put<Board>(`/${boardId}`, board);
  }

  deleteBoard(boardId: string): Observable<void> {
    return this.delete<void>(`/${boardId}`);
  }

  getBoardCards(boardId: string): Observable<Card[]> {
    return this.get<Card[]>(`/cards/boards/${boardId}/cards`);
  }

  // In board.service.ts
  getConnectedColumnIds(boardId: string, currentColumnId?: string): Observable<string[]> {
    return this.get<string[]>(`${this.apiUrl}/${boardId}/columns`).pipe(
      map(columns => currentColumnId 
        ? columns.filter(id => id !== currentColumnId) 
        : columns),
      catchError(error => {
        console.error('Error fetching connected columns:', error);
        return of([]); // Return empty array on error
      })
    );
  }
}
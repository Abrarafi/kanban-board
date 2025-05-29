import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Column } from '../../board/models/column.model';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ColumnService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
  }

  getColumns(boardId: string): Observable<Column[]> {
    return this.get<Column[]>(`/boards/${boardId}/columns`);
  }

  getColumn(columnId: string): Observable<Column> {
    return this.get<Column>(`/${columnId}`);
  }

  createColumn(boardId: string, column: Partial<Column>): Observable<Column> {
    return this.post<Column>(`/boards/${boardId}/columns`, column);
  }

  updateColumn(columnId: string, column: Partial<Column>): Observable<Column> {
    return this.put<Column>(`/columns/${columnId}`, column);
  }

  deleteColumn(columnId: string): Observable<void> {
    return this.delete<void>(`/columns/${columnId}`);
  }

  reorderColumns(boardId: string, columnIds: string[]): Observable<Column[]> {
    return this.put<Column[]>(`/boards/${boardId}/columns/reorder`, { columnIds });
  }
} 
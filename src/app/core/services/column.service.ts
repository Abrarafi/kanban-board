import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Column } from '../../board/models/column.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ColumnService {
  constructor(private storageService: StorageService) {}

  getColumns(): Observable<Column[]> {
    return of(this.storageService.getColumns());
  }

  addColumn(boardId: string, column: Partial<Column>): Observable<Column> {
    const columns = this.storageService.getColumns();
    
    const newColumn: Column = {
      id: this.storageService.generateUniqueId(),
      name: column.name!,
      description: column.description || '',
      wip: column.wip || 0,
      color: column.color || '#E2E8F0',
      order: columns.length,
      boardId,
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    columns.push(newColumn);
    this.storageService.updateColumns(columns);
    return of(newColumn);
  }

  updateColumn(column: Column): Observable<Column> {
    const columns = this.storageService.getColumns();
    const index = columns.findIndex(col => col.id === column.id);
    if (index !== -1) {
      columns[index] = {
        ...column,
        updatedAt: new Date()
      };
      this.storageService.updateColumns(columns);
      return of(columns[index]);
    }
    throw new Error('Column not found');
  }

  deleteColumn(columnId: string): Observable<void> {
    const columns = this.storageService.getColumns();
    const index = columns.findIndex(col => col.id === columnId);
    if (index !== -1) {
      columns.splice(index, 1);
      this.storageService.updateColumns(columns);
      return of(void 0);
    }
    throw new Error('Column not found');
  }
} 
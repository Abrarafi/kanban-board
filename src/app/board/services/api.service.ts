import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Column } from '../models/column.model';
import { Card } from '../models/card.model';
import { CardService } from './card.service';
import { ColumnService } from './column.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private cardService: CardService,
    private columnService: ColumnService
  ) {}

  // Column operations
  getColumns(): Observable<Column[]> {
    return this.columnService.getColumns();
  }

  addColumn(boardId: string, column: Partial<Column>): Observable<Column> {
    return this.columnService.addColumn(boardId, column);
  }

  updateColumn(column: Column): Observable<Column> {
    return this.columnService.updateColumn(column);
  }

  deleteColumn(columnId: string): Observable<void> {
    return this.columnService.deleteColumn(columnId);
  }

  // Card operations
  addCard(columnId: string, card: Card): Observable<Card> {
    return this.cardService.addCard(columnId, card);
  }

  updateCard(columnId: string, card: Card): Observable<Card> {
    return this.cardService.updateCard(columnId, card);
  }

  deleteCard(columnId: string, cardId: string): Observable<void> {
    return this.cardService.deleteCard(columnId, cardId);
  }

  moveCard(sourceColumnId: string, destinationColumnId: string, card: Card): Observable<void> {
    return this.cardService.moveCard(sourceColumnId, destinationColumnId, card);
  }
}
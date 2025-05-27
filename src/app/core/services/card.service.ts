import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Card } from '../../board/models/card.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  constructor(private storageService: StorageService) {}

  addCard(columnId: string, card: Card): Observable<Card> {
    const columns = this.storageService.getColumns();
    const column = columns.find(col => col.id === columnId);
    if (!column) {
      throw new Error('Column not found');
    }

    const newCard: Card = {
      ...card,
      id: this.storageService.generateUniqueId(),
      columnId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    column.cards.push(newCard);
    this.storageService.updateColumns(columns);
    return of(newCard);
  }

  updateCard(columnId: string, card: Card): Observable<Card> {
    const columns = this.storageService.getColumns();
    const column = columns.find(col => col.id === columnId);
    if (!column) {
      throw new Error('Column not found');
    }

    const cardIndex = column.cards.findIndex(c => c.id === card.id);
    if (cardIndex === -1) {
      throw new Error('Card not found');
    }

    const updatedCard = {
      ...card,
      updatedAt: new Date()
    };

    column.cards[cardIndex] = updatedCard;
    this.storageService.updateColumns(columns);
    return of(updatedCard);
  }

  deleteCard(columnId: string, cardId: string): Observable<void> {
    const columns = this.storageService.getColumns();
    const column = columns.find(col => col.id === columnId);
    if (!column) {
      throw new Error('Column not found');
    }

    const cardIndex = column.cards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) {
      throw new Error('Card not found');
    }

    column.cards.splice(cardIndex, 1);
    this.storageService.updateColumns(columns);
    return of(void 0);
  }

  moveCard(sourceColumnId: string, destinationColumnId: string, card: Card): Observable<void> {
    const columns = this.storageService.getColumns();
    const sourceColumn = columns.find(col => col.id === sourceColumnId);
    const destinationColumn = columns.find(col => col.id === destinationColumnId);

    if (!sourceColumn || !destinationColumn) {
      throw new Error('Column not found');
    }

    // Remove card from source column
    sourceColumn.cards = sourceColumn.cards.filter(c => c.id !== card.id);

    // Add card to destination column
    const movedCard = {
      ...card,
      columnId: destinationColumnId,
      updatedAt: new Date()
    };
    destinationColumn.cards.push(movedCard);

    this.storageService.updateColumns(columns);
    return of(void 0);
  }
} 
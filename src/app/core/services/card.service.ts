import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from '../../board/models/card.model';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CardService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
  }

  getCards(columnId: string): Observable<Card[]> {
    return this.get<Card[]>(`/cards/columns/${columnId}/cards`);
  }

  getCard(cardId: string): Observable<Card> {
    return this.get<Card>(`/cards/${cardId}`);
  }

  createCard(columnId: string, card: Partial<Card>): Observable<Card> {
    return this.post<Card>(`/cards/${columnId}`, card);
  }

  override updateCard(cardId: string, card: Partial<Card>): Observable<Card> {
    return this.put<Card>(`/cards/${cardId}`, card);
  }

  override deleteCard(cardId: string): Observable<void> {
    return this.delete<void>(`/cards/${cardId}`);
  }

  override moveCard(cardId: string, sourceColumnId: string, targetColumnId: string, newIndex: number): Observable<void> {
    return this.patch<void>(`/cards/${cardId}/move`, {
      newColumnId: targetColumnId,
      newPosition: newIndex
    });
  }

  getBoardCards(boardId: string): Observable<Card[]> {
    return this.get<Card[]>(`/cards/boards/${boardId}/cards`);
  }
} 
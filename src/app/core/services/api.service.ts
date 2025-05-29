import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Card } from '../../board/models/card.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected apiUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  protected get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`);
  }

  protected post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, data);
  }

  protected put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, data);
  }

  protected delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`);
  }

  protected patch<T>(endpoint: string, data: any): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}${endpoint}`, data);
  }

  updateCard(cardId: string, card: Partial<Card>): Observable<Card> {
    return this.put<Card>(`/cards/${cardId}`, card);
  }

  moveCard(cardId: string, sourceColumnId: string, targetColumnId: string, newIndex: number): Observable<void> {
    return this.patch<void>(`/cards/${cardId}/move`, {
      newColumnId: targetColumnId,
      newPosition: newIndex
    });
  }

  deleteCard(cardId: string): Observable<void> {
    return this.delete<void>(`/cards/${cardId}`);
  }
}
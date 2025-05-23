import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Column } from '../models/column.model';
import { Card } from '../models/card.model';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private columns: Column[] = [
    {
      id: '1',
      name: 'To Do',
      order: 0,
      boardId: 'board1',
      cards: [
        { 
          id: '1', 
          title: 'Task 1', 
          description: 'Do something important',
          columnId: '1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          id: '2', 
          title: 'Task 2', 
          description: 'Do something else',
          columnId: '1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    },
    {
      id: '2',
      name: 'In Progress',
      order: 1,
      boardId: 'board1',
      cards: [
        { 
          id: '3', 
          title: 'Task 3', 
          description: 'Working on this',
          columnId: '2',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    },
    {
      id: '3',
      name: 'Done',
      order: 2,
      boardId: 'board1',
      cards: [
        { 
          id: '4', 
          title: 'Task 4', 
          description: 'Completed task',
          columnId: '3',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    }
  ];

  getColumns(): Observable<Column[]> {
    return of(this.columns);
  }

  private generateUniqueId(): string {
    let id = Date.now().toString();
    while (this.columns.some(col => col.id === id)) {
      id = (parseInt(id) + 1).toString();
    }
    return id;
  }

  addColumn(boardId: string, name: string): Observable<Column> {
    console.log('ApiService: addColumn called');
    
    const newColumn: Column = {
      id: this.generateUniqueId(),
      name,
      order: this.columns.length,
      boardId,
      cards: []
    };

    console.log('ApiService: Adding new column');
    this.columns.push(newColumn);
    return of(newColumn);
  }

  addCard(columnId: string, card: Card): Observable<Card> {
    console.log('ApiService: addCard called with:', { columnId, card });
    const column = this.columns.find(col => col.id === columnId);
    if (column) {
      // Check if a card with this ID already exists
      const existingCardIndex = column.cards.findIndex(c => c.id === card.id);
      if (existingCardIndex === -1) {
        // Only add if card doesn't exist
        column.cards.push(card);
      }
    }
    return of(card);
  }

  updateCard(columnId: string, card: Card): Observable<Card> {
    const column = this.columns.find(col => col.id === columnId);
    if (column) {
      const index = column.cards.findIndex(c => c.id === card.id);
      if (index !== -1) {
        column.cards[index] = card;
      }
    }
    return of(card);
  }

  deleteCard(columnId: string, cardId: string): Observable<void> {
    const column = this.columns.find(col => col.id === columnId);
    if (column) {
      column.cards = column.cards.filter(card => card.id !== cardId);
    }
    return of(undefined);
  }

  moveCard(previousColumnId: string, currentColumnId: string, card: Card): Observable<void> {
    this.deleteCard(previousColumnId, card.id).subscribe();
    this.addCard(currentColumnId, card).subscribe();
    return of(undefined);
  }
}
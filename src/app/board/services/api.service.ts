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
      ],
      createdAt: new Date(),
      updatedAt: new Date()
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
      ],
      createdAt: new Date(),
      updatedAt: new Date()
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
      ],
      createdAt: new Date(),
      updatedAt: new Date()
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

  addColumn(boardId: string, column: Partial<Column>): Observable<Column> {
    console.log('ApiService: addColumn called');
    
    const newColumn: Column = {
      id: this.generateUniqueId(),
      name: column.name!,
      description: column.description || '',
      wip: column.wip || 0,
      color: column.color || '#E2E8F0',
      order: this.columns.length,
      boardId,
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('ApiService: Adding new column');
    this.columns.push(newColumn);
    return of(newColumn);
  }

  updateColumn(column: Column): Observable<Column> {
    const index = this.columns.findIndex(col => col.id === column.id);
    if (index !== -1) {
      this.columns[index] = {
        ...column,
        updatedAt: new Date()
      };
      return of(this.columns[index]);
    }
    throw new Error('Column not found');
  }

  deleteColumn(columnId: string): Observable<void> {
    const index = this.columns.findIndex(col => col.id === columnId);
    if (index !== -1) {
      this.columns.splice(index, 1);
      return of(void 0);
    }
    throw new Error('Column not found');
  }

  addCard(columnId: string, card: Card): Observable<Card> {
    const column = this.columns.find(col => col.id === columnId);
    if (!column) {
      throw new Error('Column not found');
    }

    const newCard: Card = {
      ...card,
      id: this.generateUniqueId(),
      columnId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    column.cards.push(newCard);
    return of(newCard);
  }

  updateCard(columnId: string, card: Card): Observable<Card> {
    const column = this.columns.find(col => col.id === columnId);
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
    return of(updatedCard);
  }

  deleteCard(columnId: string, cardId: string): Observable<void> {
    const column = this.columns.find(col => col.id === columnId);
    if (!column) {
      throw new Error('Column not found');
    }

    const cardIndex = column.cards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) {
      throw new Error('Card not found');
    }

    column.cards.splice(cardIndex, 1);
    return of(void 0);
  }

  moveCard(sourceColumnId: string, destinationColumnId: string, card: Card): Observable<void> {
    const sourceColumn = this.columns.find(col => col.id === sourceColumnId);
    const destinationColumn = this.columns.find(col => col.id === destinationColumnId);

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

    return of(void 0);
  }
}
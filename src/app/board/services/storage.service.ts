import { Injectable } from '@angular/core';
import { Column } from '../models/column.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
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
          priority: 'MEDIUM',
          status: 'Not Started',
          dueDate: null,
          assignees: [],
          columnId: '1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          id: '2', 
          title: 'Task 2', 
          description: 'Do something else',
          priority: 'LOW',
          status: 'Not Started',
          dueDate: null,
          assignees: [],
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
          priority: 'HIGH',
          status: 'On Track',
          dueDate: null,
          assignees: [],
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
          priority: 'MEDIUM',
          status: 'Completed',
          dueDate: null,
          assignees: [],
          columnId: '3',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  getColumns(): Column[] {
    return this.columns;
  }

  updateColumns(columns: Column[]): void {
    this.columns = columns;
  }

  generateUniqueId(): string {
    let id = Date.now().toString();
    while (this.columns.some(col => col.id === id)) {
      id = (parseInt(id) + 1).toString();
    }
    return id;
  }
} 
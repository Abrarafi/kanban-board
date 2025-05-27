import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { Board } from '../../board/models/board.model';

// export interface Board {
//   id: string;
//   name: string;
//   description: string;
//   lastModified: Date;
//   members: number;
//   thumbnailColor: string;
// }



@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private mockBoards: Board[] = [
    {
      id: 'board1',
      name: 'Project Alpha',
      description: 'Main development project board',
      lastModified: new Date(),
      members: 5,
      thumbnailColor: '#60A5FA',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'board2',
      name: 'Marketing Campaign',
      description: 'Q2 Marketing initiatives',
      lastModified: new Date(Date.now() - 86400000), // yesterday
      members: 3,
      thumbnailColor: '#34D399',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'board3',
      name: 'Bug Tracking',
      description: 'Issue tracking and bug fixes',
      lastModified: new Date(Date.now() - 172800000), // 2 days ago
      members: 8,
      thumbnailColor: '#F87171',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private mockProfile: User = {
    id: 'user1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'PROJECT_MANAGER',
    avatar: 'JD',
    boards: ['board1', 'board2'],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  getBoards(): Observable<Board[]> {
    return of(this.mockBoards);
  }

  getUserProfile(): Observable<User> {
    return of(this.mockProfile);
  }

  createBoard(board: Partial<Board>): Observable<Board> {
    const newBoard: Board = {
      id: `board${this.mockBoards.length + 1}`,
      name: board.name || 'Untitled Board',
      description: board.description || '',
      lastModified: new Date(),
      members: 1,
      thumbnailColor: board.thumbnailColor || '#60A5FA',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add to mockBoards array
    this.mockBoards = [...this.mockBoards, newBoard];
    return of(newBoard);
  }
} 
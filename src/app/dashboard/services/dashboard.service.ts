import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Board {
  id: string;
  name: string;
  description: string;
  lastModified: Date;
  members: number;
  thumbnailColor: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  recentBoards: string[];
}

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
      thumbnailColor: '#60A5FA' // blue-400
    },
    {
      id: 'board2',
      name: 'Marketing Campaign',
      description: 'Q2 Marketing initiatives',
      lastModified: new Date(Date.now() - 86400000), // yesterday
      members: 3,
      thumbnailColor: '#34D399' // green-400
    },
    {
      id: 'board3',
      name: 'Bug Tracking',
      description: 'Issue tracking and bug fixes',
      lastModified: new Date(Date.now() - 172800000), // 2 days ago
      members: 8,
      thumbnailColor: '#F87171' // red-400
    }
  ];

  private mockProfile: UserProfile = {
    id: 'user1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'JD',
    role: 'Product Manager',
    recentBoards: ['board1', 'board2']
  };

  getBoards(): Observable<Board[]> {
    return of(this.mockBoards);
  }

  getUserProfile(): Observable<UserProfile> {
    return of(this.mockProfile);
  }

  createBoard(board: Partial<Board>): Observable<Board> {
    const newBoard: Board = {
      id: `board${this.mockBoards.length + 1}`,
      name: board.name || 'Untitled Board',
      description: board.description || '',
      lastModified: new Date(),
      members: 1,
      thumbnailColor: board.thumbnailColor || '#60A5FA'
    };
    
    // Add to mockBoards array
    this.mockBoards = [...this.mockBoards, newBoard];
    return of(newBoard);
  }
} 
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'PROJECT_MANAGER' | 'TEAM_MEMBER';
    avatar?: string;          // Optional profile picture URL
    boards?: string[];        // Array of board IDs the user belongs to
    createdAt?: Date;         // From backend
    updatedAt?: Date;         // From backend
    token?: string;          // JWT token for authenticated users
  }
  
  // Example of a minimal user object for auth
  export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: 'PROJECT_MANAGER' | 'TEAM_MEMBER';
    token: string;           // JWT token
  }
  
  // For user profile editing
  export interface UserUpdateDto {
    name?: string;
    avatar?: string;
    currentPassword?: string;
    newPassword?: string;
  }
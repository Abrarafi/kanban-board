import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user.model';
import { ApiService } from './api.service';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {
  protected override apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(protected override http: HttpClient, private router: Router) {
    super(http);
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  register(userData: Partial<User>): Observable<User> {
    return this.post<User>('/register', userData);
  }

  login(email: string, password: string): Observable<User> {
    return this.post<AuthResponse>('/login', { email, password }).pipe(
      tap(response => {
        const user: User = {
          ...response.user,
          role: 'TEAM_MEMBER', // Default role, will be updated by getProfile
          token: response.token
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }),
      map(response => ({
        ...response.user,
        role: 'TEAM_MEMBER', // Default role, will be updated by getProfile
        token: response.token
      }))
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return !!user && !!user.token;
  }

  getProfile(): Observable<User> {
    return this.get<User>('/profile').pipe(
      tap(user => {
        const currentUser = this.getCurrentUser();
        const updatedUser = {
          ...user,
          token: currentUser?.token
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.put<User>('/profile', userData).pipe(
      tap(user => {
        const currentUser = this.getCurrentUser();
        const updatedUser = {
          ...user,
          token: currentUser?.token
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.put<void>('/change-password', { currentPassword, newPassword });
  }

  getToken(): string | null {
    const user = this.getCurrentUser();
    return user?.token || null;
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }
}
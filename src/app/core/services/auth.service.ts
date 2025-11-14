import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = new BehaviorSubject<string | null>(null);
  private isBrowser: boolean;

  private profileImageSubject = new BehaviorSubject<string>('default.jpg');
  profileImage$: Observable<string> = this.profileImageSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const initialToken = localStorage.getItem('token');
      if (initialToken) {
        this.token.next(initialToken);
      }

      const storedImage = localStorage.getItem('profileImage');
      if (storedImage) {
        this.profileImageSubject.next(storedImage);
      }
    }
  }

  // ----------------- LOGIN -----------------

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${environment.apiUrl}/v1/authenticate`,
      { username, password },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  setToken(token: string): void {
    this.token.next(token);
    if (this.isBrowser) {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    const currentToken = this.token.value;
    if (currentToken) return currentToken;

    if (this.isBrowser) {
      const persistedToken = localStorage.getItem('token');
      if (persistedToken) {
        this.token.next(persistedToken);
        return persistedToken;
      }
    }
    return null;
  }

  logout(): void {
    this.token.next(null);
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('profileImage');
    }
    this.router.navigate(['/login']);
  }

  // ----------------- TOKEN HELPERS -----------------

  private decodeToken(token: string): any | null {
    if (!this.isBrowser) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      return JSON.parse(atob(payloadBase64));
    } catch (e) {
      console.error('Error decodificando token:', e);
      return null;
    }
  }

  getUserData(): any {
    const token = this.getToken();
    if (!token) return null;

    const payload = this.decodeToken(token);
    if (!payload) return null;

    return {
      username: payload.sub,
      roles: payload.roles || [],
      userId: payload.userId,
      img: this.getCurrentProfileImage()
    };
  }

  // ----------------- ROLES -----------------

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = this.decodeToken(token);
    if (!payload) return null;

    const roles = payload.roles;

    if (!roles || roles.length === 0) return null;

    return roles[0].replace('ROLE_', '').toUpperCase();
  }

  isManager(): boolean {
    return this.getUserRole() === 'MANAGER';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isLoggedIn(): Observable<boolean> {
    return this.token.asObservable().pipe(map((token) => !!token));
  }

  isLoggedInSync(): boolean {
    return !!this.getToken();
  }

  // ----------------- USER ID CORREGIDO -----------------

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = this.decodeToken(token);
    if (!payload) return null;

    return payload.userId || null;  // 🔥 AQUÍ ESTABA EL FALLO
  }

  // ----------------- PROFILE IMAGE -----------------

  updateProfileImage(newImage: string): void {
    this.profileImageSubject.next(newImage);

    if (this.isBrowser) {
      localStorage.setItem('profileImage', newImage);
    }
  }

  getCurrentProfileImage(): string {
    if (this.isBrowser) {
      const stored = localStorage.getItem('profileImage');
      if (stored) {
        this.profileImageSubject.next(stored);
      }
    }
    return this.profileImageSubject.value;
  }
}

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

  // 🔹 Imagen de perfil reactiva
  private profileImageSubject = new BehaviorSubject<string>('default.jpg');
  profileImage$: Observable<string> = this.profileImageSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // 🔹 Inicializa token si existe en localStorage
    if (this.isBrowser) {
      const initialToken = localStorage.getItem('token');
      if (initialToken) {
        this.token.next(initialToken);
      }

      // 🔹 Inicializa imagen de perfil si está guardada
      const storedImage = localStorage.getItem('profileImage');
      if (storedImage) {
        this.profileImageSubject.next(storedImage);
      }
    }
  }

  // ----------------- AUTENTICACIÓN -----------------

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
      }
      return persistedToken;
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

  // ----------------- PERFIL DE USUARIO -----------------

  /** 🔹 Decodifica el token para obtener datos básicos del usuario */
  getUserData(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        username: payload.sub || payload.username || 'Usuario',
        email: payload.email || '',
        role: payload.role || payload.roles || 'USER',
        img: payload.img || this.getCurrentProfileImage(),
      };
    } catch (e) {
      console.error('❌ Error al decodificar token:', e);
      return null;
    }
  }

  /** 🔹 Actualiza la imagen de perfil en tiempo real */
  updateProfileImage(newImage: string): void {
    this.profileImageSubject.next(newImage);
    if (this.isBrowser) {
      localStorage.setItem('profileImage', newImage);
    }
  }

  /** 🔹 Obtiene la imagen actual del usuario */
  getCurrentProfileImage(): string {
    if (this.isBrowser) {
      const stored = localStorage.getItem('profileImage');
      if (stored) this.profileImageSubject.next(stored);
    }
    return this.profileImageSubject.value;
  }

  // ----------------- ROLES -----------------

  private decodeToken(token: string): any | null {
    if (!this.isBrowser) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Error decodificando token:', e);
      return null;
    }
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.decodeToken(token);
    const role =
      decoded?.role ||
      decoded?.roles?.[0] ||
      decoded?.authorities?.[0]?.authority ||
      null;

    return role ? role.replace('ROLE_', '').toUpperCase() : null;
  }

  isLoggedIn(): Observable<boolean> {
    return this.token.asObservable().pipe(map((token: string | null) => !!token));
  }

  isManager(): boolean {
    const role = this.getUserRole();
    return role === 'MANAGER';
  }

  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'ADMIN';
  }
}

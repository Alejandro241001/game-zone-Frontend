import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface AdminUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  createdDate: string;
  roles: { name: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  /** Obtener todos los usuarios */
  getAllUsers(): Observable<AdminUser[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
    return this.http.get<AdminUser[]>(this.apiUrl, { headers });
  }

  /** Eliminar un usuario */
  deleteUser(id: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  /** Alternar estado habilitado */
  toggleUserStatus(id: number, enabled: boolean): Observable<AdminUser> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
    return this.http.put<AdminUser>(`${this.apiUrl}/${id}/status?enabled=${enabled}`, {}, { headers });
  }
}

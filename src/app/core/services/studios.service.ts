import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface Studio {
  id: number;
  name: string;
  country: string;
  img?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudioService {
  private apiUrl = `${environment.apiUrl}/studios`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  /** 🔹 Obtener todos los estudios (maneja Page<StudioDTO> del backend) */
getAllStudios(): Observable<Studio[]> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  // 👇 Fuerza el tamaño grande para que traiga todos
  return this.http
    .get<{ content: Studio[] }>(`${this.apiUrl}?page=0&size=1000`, { headers })
    .pipe(map(response => response.content || []));
}

  /** 🔹 Obtener un estudio por ID */
 /** 🔹 Obtener un estudio por ID */
getStudioById(id: number): Observable<Studio> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  return this.http.get<Studio>(`${this.apiUrl}/${id}`, { headers });
}
  /** 🔹 Crear estudio */
  createStudio(studio: Partial<Studio>): Observable<Studio> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.post<Studio>(this.apiUrl, studio, { headers });
  }

  /** 🔹 Actualizar estudio */
  updateStudio(id: number, studio: Partial<Studio>): Observable<Studio> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.put<Studio>(`${this.apiUrl}/${id}`, studio, { headers });
  }

  /** 🔹 Eliminar estudio */
  deleteStudio(id: number): Observable<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}

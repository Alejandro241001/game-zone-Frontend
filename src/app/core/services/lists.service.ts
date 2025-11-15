import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  private apiUrl = 'http://localhost:8080/api/customlists';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  // OBTENER LISTAS DEL USUARIO (ya no se usa userId)
  getUserLists(): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // CREAR LISTA
  createList(name: string): Observable<any> {
  return this.http.post(this.apiUrl, { name }, {
    headers: this.getAuthHeaders()
  });
}

  // ELIMINAR
  deleteList(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // EDITAR LISTA
  updateList(id: number, name: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { name }, {
      headers: this.getAuthHeaders()
    });
  }

  // AÑADIR JUEGO
  addGameToList(listId: number, videoGameId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${listId}/videogames/${videoGameId}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  // OBTENER LISTA POR ID
  getListById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // REMOVER JUEGO
  removeGameFromList(listId: number, gameId: number) {
    return this.http.delete(`${this.apiUrl}/${listId}/videogames/${gameId}`, {
      headers: this.getAuthHeaders()
    });
  }
}

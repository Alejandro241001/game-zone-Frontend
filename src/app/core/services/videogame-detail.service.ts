import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// Define la interfaz del videojuego (puedes importarla si ya existe)
export interface VideoGame {
  id: number;
  name: string;
  studio: { name: string };
  releaseYear: number;
  metacritic: number;
  genres: { name: string }[];
  description?: string;
  platforms: any[];
  reviews: any[];
  img: string;
}

@Injectable({
  providedIn: 'root'
})
export class VideogameDetailService {

  private apiUrl = 'http://localhost:8080/api/videogames'; // Ajusta la URL si es diferente en tu backend

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Obtiene los detalles de un videojuego por su ID
   * Ejemplo de llamada: GET http://localhost:8080/api/videogames/5
   */
  fetchVideogameById(id: number): Observable<VideoGame> {
    return this.http.get<VideoGame>(`${this.apiUrl}/${id}`);
  }

  updateVideogame(id: number, updatedData: Partial<VideoGame>) {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return this.http.put<VideoGame>(`http://localhost:8080/api/videogames/${id}`, updatedData);
}
}
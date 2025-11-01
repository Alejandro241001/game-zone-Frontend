import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface Studio {
  id: number;
  name: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Platform {
  id: number;
  name: string;
}

export interface VideoGame {
  id: number;
  name: string;
  description: string;
  releaseYear: number;
  metacritic: number;
  img: string;
  studio?: Studio;
  genres?: Genre[];
  platforms?: Platform[];
}

@Injectable({
  providedIn: 'root'
})
export class VideogameDetailService {

  private apiUrl = `${environment.apiUrl}/videogames`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  /** 🎮 Obtener videojuego por ID */
  fetchVideogameById(id: number): Observable<VideoGame> {
    return this.http.get<VideoGame>(`${this.apiUrl}/${id}`);
  }

  /** 💾 Actualizar videojuego */
  updateVideogame(id: number, videogame: VideoGame): Observable<VideoGame> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    const gameDTO = {
      name: videogame.name,
      description: videogame.description,
      studioId: videogame.studio?.id,
      metacritic: videogame.metacritic,
      releaseYear: videogame.releaseYear,
      img: videogame.img,
      platformIds: videogame.platforms?.map(p => p.id) || []
    };

    return this.http.put<VideoGame>(`${this.apiUrl}/${id}`, gameDTO, { headers });
  }

  /** 🗑️ Eliminar videojuego */
  deleteVideogame(id: number): Observable<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  /** ➕ Crear nuevo videojuego */
  createVideogame(gameDTO: any): Observable<VideoGame> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    console.log('📤 POST a backend:', gameDTO);
    return this.http.post<VideoGame>(`${this.apiUrl}`, gameDTO, { headers });
  }

  /** 🏭 Traer estudios (maneja Page<StudioDTO>) */
  fetchStudios(): Observable<Studio[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .get<{ content: Studio[] }>(`${environment.apiUrl}/studios`, { headers })
      .pipe(map(response => response.content || []));
  }

  /** 💻 Traer plataformas (maneja Page<PlatformDTO>) */
  fetchPlatforms(): Observable<Platform[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .get<{ content: Platform[] }>(`${environment.apiUrl}/platforms`, { headers })
      .pipe(map(response => response.content || []));
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment'; // Mantener la ruta profunda

// Nota: Puedes definir una interfaz (p. ej., Videogame) para tipar el Observable
// fetchVideogames(): Observable<Videogame[]>

@Injectable({
  providedIn: 'root'
})
export class VideogameService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  /**
   * Método para obtener la lista de videojuegos desde la API.
   * @returns Observable que emite la lista de videojuegos.
   */
  fetchVideogames(): Observable<any> { // Usamos <any> si no tienes la interfaz Videogame definida
     // Obtén el token del AuthService

   
    // Realiza la solicitud GET al endpoint de 'videogames' con el token en el encabezado.
    return this.http.get(`${environment.apiUrl}/videogames`, {
      headers: new HttpHeaders({
        
      }),
    });
  }
}
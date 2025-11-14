import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrl = 'http://localhost:8080/api/reviews';

  constructor(private http: HttpClient) {}

  /** 🔐 Genera headers con token si existe */
  private getAuthHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      })
    };
  }

  /** 🔹 Obtener todas las reviews (si lo usas) */
  getAllReviews(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  /** 🔹 Obtener reviews por videojuego */
  getReviewsByVideogame(videoGameId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/videogame/${videoGameId}`);
  }

  /** 🔹 Obtener una review por ID */
  getReviewById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  /** 🔹 Crear review (incluye token) */
  createReview(reviewData: any): Observable<any> {
    return this.http.post(
      this.apiUrl,
      reviewData,
      this.getAuthHeaders()
    );
  }

  /** 🔹 Actualizar review (incluye token) */
  updateReview(id: number, reviewData: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      reviewData,
      this.getAuthHeaders()
    );
  }

  /** 🔹 Borrar review (incluye token) */
  deleteReview(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      this.getAuthHeaders()
    );
  }
}

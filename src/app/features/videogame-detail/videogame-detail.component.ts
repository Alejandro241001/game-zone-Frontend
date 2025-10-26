import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { VideogameDetailService } from '../../core/services/videogame-detail.service';
import { AuthService } from '../../core/services/auth.service';

interface VideoGame {
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

@Component({
  selector: 'app-videogame-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  templateUrl: './videogame-detail.component.html',
})
export class VideogameDetailComponent implements OnInit {

  videogame: VideoGame | null = null;
  error: string | null = null;
  loading: boolean = true;

  // ✅ Propiedad que faltaba
  isManager: boolean = false;
  editing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private videogameDetailService: VideogameDetailService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Determina si el usuario logueado es manager
    this.isManager = this.authService.isManager();
    this.loadVideogameDetail();
  }

  /**
   * Carga los detalles de un videojuego según su ID (desde la URL)
   */
  loadVideogameDetail(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error = 'ID de videojuego no válido.';
      this.loading = false;
      return;
    }

    this.videogameDetailService.fetchVideogameById(id).subscribe({
      next: (data) => {
        this.videogame = data;
        this.error = null;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar detalle del videojuego:', err);
        this.error = `No se pudo cargar el videojuego: ${err.statusText || 'Error de conexión'}`;
        this.loading = false;
      }
    });
  }

  /**
   * Habilita el modo edición
   */
  enableEdit(): void {
    this.editing = true;
  }

  /**
   * Guarda los cambios en el videojuego (solo manager)
   */
  saveChanges(): void {
    if (!this.videogame) return;
    const id = this.videogame.id;

    this.videogameDetailService.updateVideogame(id, this.videogame).subscribe({
      next: (updated) => {
        this.videogame = updated;
        this.editing = false;
        alert('✅ Videojuego actualizado correctamente.');
      },
      error: (err) => {
        console.error('Error al actualizar videojuego:', err);
        alert('❌ Error al guardar los cambios.');
      }
    });
  }
}
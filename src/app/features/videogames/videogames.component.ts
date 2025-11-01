import { Component, OnInit } from '@angular/core';
import { VideogameDetailService, VideoGame } from '../../core/services/videogame-detail.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-videogames',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HttpClientModule],
  templateUrl: './videogames.component.html',
})
export class VideogamesComponent implements OnInit {

  videogames: VideoGame[] = [];
  error: string | null = null;
  isManager: boolean = false;

  // 🔹 Datos para el nuevo videojuego
  newVideogame: Partial<VideoGame> = {
    name: '',
    description: '',
    metacritic: 0,
    releaseYear: new Date().getFullYear(),
    img: '',
    studio: undefined,
    platforms: [],
  };

  constructor(
    private videogameService: VideogameDetailService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isManager = this.authService.isManager();
    this.loadVideogames();
  }

  /** 🔹 Cargar todos los videojuegos */
  loadVideogames(): void {
    this.error = null;
    this.videogameService.fetchVideogameById(0); // solo para inicializar correctamente el servicio
    fetch(`${this.videogameService['apiUrl']}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.content)) {
          this.videogames = data.content;
        } else if (Array.isArray(data)) {
          this.videogames = data;
        } else {
          this.error = '⚠️ Formato de respuesta de API inesperado.';
        }
      })
      .catch(err => {
        console.error('Error al cargar videojuegos:', err);
        this.error = '❌ Error al cargar videojuegos desde la API.';
      });
  }

  /** ➕ Crear nuevo videojuego (solo managers) */
  createVideogame(): void {
    if (!this.isManager) {
      this.error = '❌ Solo los usuarios con rol MANAGER pueden crear videojuegos.';
      return;
    }

    if (!this.newVideogame.name || !this.newVideogame.description) {
      this.error = '⚠️ Debes completar todos los campos obligatorios.';
      return;
    }

    this.videogameService.createVideogame(this.newVideogame as VideoGame).subscribe({
      next: (created: VideoGame) => {
        console.log('✅ Videojuego creado:', created);
        this.videogames.push(created);
        this.error = '✅ Videojuego añadido correctamente.';
        // Reinicia el formulario
        this.newVideogame = {
          name: '',
          description: '',
          metacritic: 0,
          releaseYear: new Date().getFullYear(),
          img: '',
          studio: undefined,
          platforms: [],
        };
        setTimeout(() => this.error = null, 3000);
      },
      error: (err) => {
        console.error('Error al crear videojuego:', err);
        if (err.status === 403) {
          this.error = '❌ Permisos insuficientes para crear videojuegos.';
        } else {
          this.error = `❌ Error al crear videojuego: ${err.statusText}`;
        }
      }
    });
  }

  /** 🗑️ Eliminar videojuego */
  deleteVideogame(id: number): void {
    if (!this.isManager) {
      this.error = '❌ No tienes permiso para eliminar videojuegos.';
      return;
    }

    if (confirm('¿Estás seguro de eliminar este videojuego?')) {
      this.videogameService.deleteVideogame(id).subscribe({
        next: () => {
          this.videogames = this.videogames.filter(v => v.id !== id);
          this.error = '🗑️ Videojuego eliminado correctamente.';
          setTimeout(() => this.error = null, 3000);
        },
        error: (err) => {
          console.error('Error al eliminar videojuego:', err);
          this.error = `❌ No se pudo eliminar el videojuego: ${err.statusText}`;
        }
      });
    }
  }
}

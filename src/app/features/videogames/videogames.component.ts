import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VideogameDetailService, VideoGame } from '../../core/services/videogame-detail.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-videogames',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HttpClientModule],
  templateUrl: './videogames.component.html',
  styleUrls: ['./videogames.component.scss']
})
export class VideogamesComponent implements OnInit {

  videogames: VideoGame[] = [];
  error: string | null = null;
  isManager = false;

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
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isManager = this.authService.isManager();
    this.loadVideogames();
  }

  /** 🔹 Cargar todos los videojuegos */
  loadVideogames(): void {
    this.error = null;

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

  /** 🖼️ Imagen por defecto si falla la original */
  onImageError(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = 'assets/default-game.png';
  }

  /** 🎮 Navegar al detalle al hacer clic en la imagen */
  goToDetail(id: number): void {
    this.router.navigate(['/videogames', id]);
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
        this.resetForm();
      },
      error: (err) => {
        console.error('Error al crear videojuego:', err);
        this.error = err.status === 403
          ? '❌ Permisos insuficientes para crear videojuegos.'
          : `❌ Error al crear videojuego: ${err.statusText}`;
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

  /** ♻️ Resetear formulario */
  private resetForm(): void {
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
  }
}

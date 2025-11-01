import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // 🟢 Añadido Router
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { VideogameDetailService, VideoGame } from '../../core/services/videogame-detail.service'; 
import { AuthService } from '../../core/services/auth.service';

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

  isManager: boolean = false;
  editing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private videogameDetailService: VideogameDetailService,
    private authService: AuthService,
    private router: Router // 🟢 Añadido para redirigir tras eliminar
  ) {}

  ngOnInit(): void {
    this.isManager = this.authService.isManager();
    this.loadVideogameDetail();
  }

  /** Carga los detalles del videojuego */
  loadVideogameDetail(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error = 'ID de videojuego no válido.';
      this.loading = false;
      return;
    }

    this.videogameDetailService.fetchVideogameById(id).subscribe({
      next: (data: VideoGame) => {
        this.videogame = data;
        this.error = null;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar detalle del videojuego:', err);
        this.error = `No se pudo cargar el videojuego: ${err.statusText || 'Error de conexión'}`;
        this.loading = false;
      }
    });
  }

  /** Activa el modo edición */
  enableEdit(): void {
    this.editing = true;
  }

  /** Guarda los cambios (solo managers) */
  saveChanges(): void {
    if (!this.videogame) return;

    const token = this.authService.getToken();
    if (!token) {
      this.error = 'Usuario no autenticado. No se puede actualizar el videojuego.';
      return;
    }

    if (!this.authService.isManager()) {
      this.error = '❌ Su rol actual no tiene permiso para editar videojuegos.';
      return;
    }

    const id = this.videogame.id;

    this.videogameDetailService.updateVideogame(id, this.videogame).subscribe({
      next: (updated: VideoGame) => {
        this.videogame = updated;
        this.editing = false;
        this.error = '✅ Videojuego actualizado correctamente.';
        setTimeout(() => this.error = null, 3000);
      },
      error: (err: any) => {
        console.error('Error al actualizar videojuego:', err);
        if (err.status === 403) {
          this.error = '❌ Error de Permisos (403): Asegúrese de que tiene rol de Manager.';
        } else {
          this.error = `❌ Error al guardar los cambios: ${err.statusText}`;
        }
      }
    });
  }

  /** 🟢 NUEVO: Eliminar videojuego (solo managers) */
  deleteVideogame(): void {
    if (!this.videogame) return;

    if (!this.authService.isManager()) {
      this.error = '❌ No tienes permisos para eliminar videojuegos.';
      return;
    }

    const confirmed = confirm(`¿Seguro que deseas eliminar "${this.videogame.name}"? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    this.videogameDetailService.deleteVideogame(this.videogame.id).subscribe({
      next: () => {
        alert('✅ Videojuego eliminado correctamente.');
        this.router.navigate(['/videogames']); // Redirige a la lista
      },
      error: (err: any) => {
        console.error('Error al eliminar videojuego:', err);
        if (err.status === 403) {
          this.error = '❌ No tienes permisos para eliminar este videojuego.';
        } else {
          this.error = '❌ Error al intentar eliminar el videojuego.';
        }
      }
    });
  }
}

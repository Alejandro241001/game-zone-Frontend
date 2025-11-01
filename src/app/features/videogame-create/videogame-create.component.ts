import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VideogameDetailService, VideoGame, Studio, Platform } from '../../core/services/videogame-detail.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-videogame-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './videogame-create.component.html'
})
export class VideogameCreateComponent implements OnInit {

  newVideogame: any = {
    name: '',
    description: '',
    releaseYear: new Date().getFullYear(),
    metacritic: 0,
    img: '',
    studioId: null,
    platforms: []
  };

  studios: Studio[] = [];
  platforms: Platform[] = [];
  message: string | null = null;

  constructor(
    private videogameService: VideogameDetailService,
    public router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // 🔹 Cargar estudios
    this.videogameService.fetchStudios().subscribe({
      next: (data) => {
        this.studios = data;
        console.log('📚 Estudios cargados:', this.studios);
      },
      error: (err) => console.error('Error al cargar estudios:', err)
    });

    // 🔹 Cargar plataformas
    this.videogameService.fetchPlatforms().subscribe({
      next: (data) => this.platforms = data,
      error: (err) => console.error('Error al cargar plataformas:', err)
    });
  }

  createVideogame(): void {
    if (!this.authService.isManager()) {
      this.message = '❌ Solo los MANAGER pueden crear videojuegos.';
      return;
    }

    if (!this.newVideogame.name || !this.newVideogame.description || !this.newVideogame.studioId) {
      this.message = '⚠️ Debes completar todos los campos obligatorios (nombre, descripción y estudio).';
      return;
    }

    // ✅ Convertimos correctamente los tipos (Java espera números reales)
    const gameDTO = {
      name: this.newVideogame.name,
      description: this.newVideogame.description,
      studioId: Number(this.newVideogame.studioId),
      metacritic: Number(this.newVideogame.metacritic),
      releaseYear: Number(this.newVideogame.releaseYear),
      img: this.newVideogame.img,
      platformIds: this.newVideogame.platforms?.map((p: any) => Number(p.id)) || []
    };

    console.log('📦 Enviando DTO al backend:', JSON.stringify(gameDTO, null, 2));

    this.videogameService.createVideogame(gameDTO).subscribe({
      next: (created: VideoGame) => {
        console.log('✅ Videojuego creado correctamente:', created);
        this.message = '✅ Videojuego creado correctamente.';
        setTimeout(() => this.router.navigate(['/videogames']), 1500);
      },
      error: (err) => {
        console.error('❌ Error al crear videojuego:', err);
        this.message = `❌ Error al crear videojuego: ${err.statusText || 'Error de conexión'}`;
      }
    });
  }
}

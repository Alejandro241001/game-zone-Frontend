import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VideogameDetailService, VideoGame, Studio, Platform, Genre } from '../../core/services/videogame-detail.service';
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
    studioId: null
  };

  studios: Studio[] = [];
  platforms: Platform[] = [];
  genres: Genre[] = [];

  selectedPlatformIds: number[] = [];
  selectedGenreIds: number[] = [];

  message: string | null = null;

  constructor(
    private videogameService: VideogameDetailService,
    public router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // 🔹 Cargar estudios
    this.videogameService.fetchStudios().subscribe({
      next: (data) => this.studios = data,
      error: (err) => console.error('Error al cargar estudios:', err)
    });

    // 🔹 Cargar plataformas
    this.videogameService.fetchPlatforms().subscribe({
      next: (data) => {
        this.platforms = data;
        console.log('🧩 Plataformas cargadas correctamente:', this.platforms);
      },
      error: (err) => console.error('❌ Error al cargar plataformas:', err)
    });

    // 🔹 Cargar géneros
    this.videogameService.fetchGenres().subscribe({
      next: (data) => {
        this.genres = data;
        console.log('🎭 Géneros cargados correctamente:', this.genres);
      },
      error: (err) => console.error('❌ Error al cargar géneros:', err)
    });
  }

  // ✅ Manejar selección de plataformas (checkbox)
  onPlatformToggle(platformId: number, event: any): void {
    if (event.target.checked) {
      this.selectedPlatformIds.push(platformId);
    } else {
      this.selectedPlatformIds = this.selectedPlatformIds.filter(id => id !== platformId);
    }
  }

  // ✅ Manejar selección de géneros (checkbox)
  onGenreToggle(genreId: number, event: any): void {
    if (event.target.checked) {
      this.selectedGenreIds.push(genreId);
    } else {
      this.selectedGenreIds = this.selectedGenreIds.filter(id => id !== genreId);
    }
  }

  // ✅ Crear videojuego
  createVideogame(): void {
  if (!this.authService.isManager()) {
    this.message = '❌ Solo los MANAGER pueden crear videojuegos.';
    return;
  }

  if (!this.newVideogame.name || !this.newVideogame.description || !this.newVideogame.studioId) {
    this.message = '⚠️ Debes completar los campos obligatorios (nombre, descripción y estudio).';
    return;
  }

  // ✅ Normalizar la imagen (solo nombre, sin URL completa)
  const imgName = this.newVideogame.img?.trim() || '';
  const cleanImgName = imgName.split('/').pop(); // -> elimina posibles rutas o URLs

  const gameDTO = {
    name: this.newVideogame.name.trim(),
    description: this.newVideogame.description.trim(),
    studioId: Number(this.newVideogame.studioId),
    metacritic: Number(this.newVideogame.metacritic),
    releaseYear: Number(this.newVideogame.releaseYear),
    img: cleanImgName, // 👈 usamos solo el nombre limpio
    platformIds: this.selectedPlatformIds,
    genreIds: this.selectedGenreIds
  };

  console.log('📦 Enviando DTO:', JSON.stringify(gameDTO, null, 2));

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

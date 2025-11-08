import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';  // 👈 AÑADIDO RouterLink
import { StudioService, Studio } from '../../core/services/studios.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-studios',
  standalone: true,
  imports: [CommonModule, RouterLink], // 👈 AGREGA RouterLink AQUÍ
  providers: [StudioService],
  templateUrl: './studios.component.html',
  styleUrls: ['./studios.component.scss']
})
export class StudiosComponent implements OnInit {

  studios: Studio[] = [];
  isManager = false;
  message: string | null = null;

  constructor(
    private studioService: StudioService,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.isManager = this.authService.isManager();
    this.loadStudios();
  }

  loadStudios(): void {
    this.studioService.getAllStudios().subscribe({
      next: (data) => {
        this.studios = data;
        console.log('✅ Estudios cargados:', data);
      },
      error: (err) => {
        console.error('❌ Error al cargar estudios:', err);
        this.message = 'Error al cargar estudios.';
      }
    });
  }

  getCountryFlag(country: string | null | undefined): string {
    if (!country) return 'default.png';
    const flags: { [key: string]: string } = {
      'Japan': 'japan.png',
      'United States': 'usa.png',
      'France': 'france.png',
      'Poland': 'poland.png',
      'Australia': 'australia.png',
      'United Kingdom': 'uk.png',
      'Netherlands': 'netherlands.png',
      'Belgium': 'belgium.png',
      'Sweden': 'sweden.png',
      'Denmark': 'denmark.png',
      'Finland': 'finland.png'
    };
    return flags[country] || 'default.png';
  }

  onImageError(event: Event): void {
  const element = event.target as HTMLImageElement;
  element.src = 'http://localhost:8080/img/default-studio.png';
}


  deleteStudio(id: number): void {
    if (confirm('¿Seguro que quieres eliminar este estudio?')) {
      this.studioService.deleteStudio(id).subscribe({
        next: () => {
          this.message = '✅ Estudio eliminado correctamente.';
          this.loadStudios();
        },
        error: (err) => {
          console.error('❌ Error al eliminar estudio:', err);
          this.message = 'Error al eliminar estudio.';
        }
      });
    }
  }
}

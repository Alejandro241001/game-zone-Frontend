import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudioService, Studio } from '../../core/services/studios.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-studio-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './studio-create.component.html'
})
export class StudioCreateComponent {
  newStudio: Partial<Studio> = {
    name: '',
    country: '',
    img: ''
  };

  message: string | null = null;

  constructor(
    private studioService: StudioService,
    private authService: AuthService,
    public router: Router
  ) {}

  /** 🔹 Crear nuevo estudio */
  createStudio(): void {
    if (!this.authService.isManager()) {
      this.message = '❌ Solo los MANAGER pueden crear estudios.';
      return;
    }

    if (!this.newStudio.name || !this.newStudio.country) {
      this.message = '⚠️ Debes completar los campos obligatorios (nombre y país).';
      return;
    }

    // Si no especifica imagen, se guarda una por defecto
    const studioDTO = {
      name: this.newStudio.name,
      country: this.newStudio.country,
      img: this.newStudio.img?.trim() || 'default-studio.png'
    };

    console.log('📦 Enviando DTO:', JSON.stringify(studioDTO, null, 2));

    this.studioService.createStudio(studioDTO).subscribe({
      next: (created: Studio) => {
        console.log('✅ Estudio creado correctamente:', created);
        this.message = '✅ Estudio creado correctamente.';
        setTimeout(() => this.router.navigate(['/studios']), 1500);
      },
      error: (err) => {
        console.error('❌ Error al crear estudio:', err);
        this.message = `❌ Error al crear estudio: ${err.statusText || 'Error de conexión'}`;
      }
    });
  }
}

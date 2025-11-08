import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudioService, Studio } from '../../core/services/studios.service';

@Component({
  selector: 'app-studio-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './studio-edit.component.html',
  styleUrls: ['./studio-edit.component.scss']
})
export class StudioEditComponent implements OnInit {
  studio: Studio = { id: 0, name: '', country: '', img: '' };
  previewImg: string | ArrayBuffer | null = null;
  message: string | null = null;

  constructor(
    private studioService: StudioService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.studioService.getStudioById(id).subscribe({
        next: (data) => {
          this.studio = data;
          this.previewImg = `http://localhost:8080/img/${data.img}`;
        },
        error: () => {
          this.message = '❌ Error al cargar el estudio.';
        }
      });
    }
  }

  /** 📤 Manejar previsualización de imagen */
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.previewImg = reader.result);
      reader.readAsDataURL(file);
      this.studio.img = file.name; // solo guardamos el nombre del archivo
    }
  }

  /** 💾 Guardar los cambios */
  saveChanges(): void {
    this.studioService.updateStudio(this.studio.id, this.studio).subscribe({
      next: () => {
        this.message = '✅ Estudio actualizado correctamente.';
        setTimeout(() => this.router.navigate(['/studios']), 1500);
      },
      error: () => {
        this.message = '❌ Error al actualizar el estudio.';
      }
    });
  }

  /** 🚫 Cancelar edición */
  cancel(): void {
    this.router.navigate(['/studios']);
  }
}

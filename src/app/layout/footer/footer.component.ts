import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  // ✅ Método seguro para manejar error de imagen
  onLogoError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/logo.png'; // Usa el logo local como fallback
  }
onImageError(event: Event): void {
  (event.target as HTMLImageElement).src = 'assets/default-icon.png';
}
}
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  user: any = {
    username: '',
    firstName: '',
    lastName: '',
    image: 'default.jpg',
    originalUsername: ''
  };

  newPassword = '';
  confirmPassword = '';
  message: string | null = null;

  private apiUrl = 'http://localhost:8080/api/users/me';
  private uploadUrl = 'http://localhost:8080/api/users/upload-image';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  /** 🔹 Obtener headers con token JWT */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /** 🔹 Cargar datos del usuario logueado */
  loadUserData(): void {
    const headers = this.getAuthHeaders();
    this.http.get<any>(this.apiUrl, { headers }).subscribe({
      next: (data) => {
        this.user = data;
        this.user.originalUsername = data.username; // 👈 Guardamos el nombre original
        if (!this.user.image) {
          this.user.image = 'default.jpg';
        }
      },
      error: (err) => {
        console.error('❌ Error al cargar datos del usuario:', err);
        this.message = '❌ No se pudieron cargar tus datos.';
      }
    });
  }

  /** 🔹 Imagen por defecto si falla la carga */
  onImageError(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = 'assets/default-user.png';
  }

  /** 🔹 Subir imagen de perfil */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });

   this.http.post(this.uploadUrl, formData, { headers }).subscribe({
  next: (response: any) => {
    console.log('✅ Imagen subida correctamente:', response);
    this.user.image = response.image || this.user.image;

    // 🔹 Actualizar en AuthService para reflejarlo en el header
    this.authService.updateProfileImage(this.user.image);

    alert('✅ Foto de perfil actualizada');
  },
  error: (err) => {
    console.error('❌ Error al subir imagen:', err);
    alert('❌ Error al subir la imagen');
  }
});

  }

  /** 🔹 Actualizar perfil (nombre, apellidos, username) */
  updateUser(): void {
    const headers = this.getAuthHeaders();

    this.http.put(`${this.apiUrl}`, this.user, { headers }).subscribe({
      next: (response: any) => {
        this.message = response.message || '✅ Perfil actualizado correctamente.';

        // Si cambió el nombre de usuario → cerrar sesión obligatoriamente
        if (this.user.username !== this.user.originalUsername) {
          alert('Has cambiado tu nombre de usuario. Por favor, inicia sesión de nuevo.');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          alert(this.message);
        }
      },
      error: (err) => {
        console.error('❌ Error al actualizar perfil:', err);
        this.message = '❌ Error al actualizar perfil.';
        alert(this.message);
      }
    });
  }

  /** 🔹 Cambiar contraseña */
  changePassword(): void {
  if (this.newPassword !== this.confirmPassword) {
    alert('⚠️ Las contraseñas no coinciden');
    return;
  }

  const currentPassword = prompt('🔒 Introduce tu contraseña actual:');
  if (!currentPassword) {
    alert('❌ Debes introducir tu contraseña actual.');
    return;
  }

  const headers = this.getAuthHeaders();
  this.http.put(
    `${this.apiUrl}/change-password`,
    { currentPassword, newPassword: this.newPassword },
    { headers }
  ).subscribe({
    next: () => alert('✅ Contraseña actualizada correctamente'),
    error: (err) => alert('❌ Error al actualizar la contraseña: ' + err.message)
  });
}
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  user = {
    username: '',
    password: '',
    firstName: '',
    lastName: ''
  };

  message: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  register(): void {
    if (!this.user.username || !this.user.password || !this.user.firstName || !this.user.lastName) {
      this.message = '⚠️ Todos los campos son obligatorios.';
      return;
    }

    this.http.post(`${environment.apiUrl}/v1/register`, this.user)
      .subscribe({
        next: (response: any) => {
          console.log('✅ Usuario registrado correctamente:', response);
          this.message = '✅ Registro exitoso. Redirigiendo al login...';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          console.error('❌ Error en el registro:', err);
          this.message = err.error?.message || '❌ Error al registrar el usuario.';
        }
      });
  }
}

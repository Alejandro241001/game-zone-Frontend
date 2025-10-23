import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true, // Asumiendo que es un componente standalone por el uso de imports: [...]
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false; // Estado local de autenticación.
  private subscription: Subscription | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Suscriptor al estado de autenticación.
    this.subscription = this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  logout(): void {
    this.authService.logout(); // Llamar al método de logout del servicio.
  }

  ngOnDestroy(): void {
    // Cancelar la suscripción al destruir el componente.
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
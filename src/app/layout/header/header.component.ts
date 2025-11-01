import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;  // Estado del login
  isAdmin = false;     // Estado del rol
  private subscription: Subscription | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // 🔹 Suscripción para saber si el usuario está logueado
    this.subscription = this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;

      // Si está logueado, comprobamos el rol en tiempo real
      if (loggedIn) {
        const role = this.authService.getUserRole();
        this.isAdmin = role === 'ADMIN';
      } else {
        this.isAdmin = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

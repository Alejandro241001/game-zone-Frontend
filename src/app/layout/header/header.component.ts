import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isAdmin = false;
  userImgUrl = 'http://localhost:8080/img/default.jpg'; // Imagen por defecto
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // 🔹 Combina estado de sesión + imagen de perfil
    const sub = combineLatest([
      this.authService.isLoggedIn(),
      this.authService.profileImage$
    ]).subscribe(([loggedIn, profileImage]) => {
      this.isLoggedIn = loggedIn;

      if (loggedIn) {
        const role = this.authService.getUserRole();
        this.isAdmin = role === 'ADMIN';

        // ✅ Cargar imagen del usuario actual (del BehaviorSubject)
        this.userImgUrl = `http://localhost:8080/img/${profileImage}`;
      } else {
        this.isAdmin = false;
        this.userImgUrl = 'http://localhost:8080/img/default.jpg';
      }
    });

    this.subscriptions.push(sub);
  }

  // 🔹 Si la imagen falla al cargar, poner la predeterminada
  onAvatarError(event: Event): void {
    (event.target as HTMLImageElement).src = 'http://localhost:8080/img/default.png';
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.userImgUrl = 'http://localhost:8080/img/default.png';
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}

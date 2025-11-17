import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
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
  userImgUrl = 'http://localhost:8080/img/default.jpg';

  // ⭐ Logos claro / oscuro
  logoUrl = 'http://localhost:8080/img/logo.png';
  darkLogoUrl = 'http://localhost:8080/img/logooscuro.png';

  private subscriptions: Subscription[] = [];

  // ⭐ Estado del modo oscuro
  isDarkMode = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    // ⭐ Cargar modo oscuro solo en navegador
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('dark-mode');
      this.isDarkMode = savedTheme === 'true';
      this.applyDarkMode();

      // Cambiar logo según tema
      this.logoUrl = this.isDarkMode
        ? this.darkLogoUrl
        : 'http://localhost:8080/img/logo.png';
    }

    // 🔹 Estado de sesión + avatar
    const sub = combineLatest([
      this.authService.isLoggedIn(),
      this.authService.profileImage$
    ]).subscribe(([loggedIn, profileImage]) => {
      this.isLoggedIn = loggedIn;

      if (loggedIn) {
        const role = this.authService.getUserRole();
        this.isAdmin = role === 'ADMIN';
        this.userImgUrl = `http://localhost:8080/img/${profileImage}`;
      } else {
        this.isAdmin = false;
        this.userImgUrl = 'http://localhost:8080/img/default.jpg';
      }
    });

    this.subscriptions.push(sub);
  }

  onLogoError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/logo.png';
  }

  menuOpen = false;

toggleMenu() {
  this.menuOpen = !this.menuOpen;
}

toggleTheme() {
  document.body.classList.toggle('dark-mode');
}

  // ⭐ Aplicar clase CSS al body
  private applyDarkMode(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.classList.remove('dark-mode');
    }
  }

  // ⭐ Cambiar modo claro/oscuro
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;

    // Guardar solo si estamos en navegador
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('dark-mode', String(this.isDarkMode));
    }

    this.applyDarkMode();

    this.logoUrl = this.isDarkMode
      ? this.darkLogoUrl
      : 'http://localhost:8080/img/logo.png';
  }

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

import { Routes } from '@angular/router';
import { VideogamesComponent } from './features/videogames/videogames.component';
import { VideogameDetailComponent } from './features/videogame-detail/videogame-detail.component';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { ForbiddenComponent } from './features/forbidden/forbidden.component';
import { Error404Component } from './features/error404/error404.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '', // Página principal
    component: HomeComponent,
  },
  {
    path: 'login', // Página de inicio de sesión
    component: LoginComponent,
  },
  {
    path: 'videogames', // Página que lista todos los videojuegos
    component: VideogamesComponent,
  },
  {
    path: 'videogames/:id', // ✅ Nueva ruta para el detalle de un videojuego
    component: VideogameDetailComponent,
  },
  {
    path: 'forbidden', // Página 403
    component: ForbiddenComponent,
  },
  {
    path: '**', // Página 404
    component: Error404Component,
  },
];
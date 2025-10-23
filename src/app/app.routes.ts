import { Routes } from '@angular/router';
import { VideogamesComponent } from './features/videogames/videogames.component';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { ForbiddenComponent } from './features/forbidden/forbidden.component';
import { Error404Component } from './features/error404/error404.component';
import { authGuard } from './core/guards/auth.guard';


export const routes: Routes = [
  {
    path: '', // Ruta inicial
    component: HomeComponent,
  },
  {
    path: 'login', // Página de inicio de sesión
    component: LoginComponent,
  },
  {
    path: 'videogames', // Página de videojuegos
    component: VideogamesComponent,
    
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent
    // Página 403
  },
  {
    path: '**', // Ruta comodín para 404
    component: Error404Component,
  },
];
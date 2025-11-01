import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { VideogamesComponent } from './features/videogames/videogames.component';
import { VideogameDetailComponent } from './features/videogame-detail/videogame-detail.component';
import { VideogameCreateComponent } from './features/videogame-create/videogame-create.component';
import { ForbiddenComponent } from './features/forbidden/forbidden.component';
import { Error404Component } from './features/error404/error404.component';
import { UsersComponent } from './features/users/users.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },

  // ✅ Protegemos la ruta de videojuegos
  {
    path: 'videogames',
    component: VideogamesComponent,
    canActivate: [authGuard], // 👈 se activa el guard
  },
  {
    path: 'videogames/new',
    component: VideogameCreateComponent,
    canActivate: [authGuard],
    data: { roles: ['MANAGER'] } // 👈 solo managers pueden crear
  },
  {
    path: 'videogames/:id',
    component: VideogameDetailComponent,
    canActivate: [authGuard],
  },

  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] } // 👈 Solo visible para admin
  },

  { path: 'forbidden', component: ForbiddenComponent },
  { path: '**', component: Error404Component },
];
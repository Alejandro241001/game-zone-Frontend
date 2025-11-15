import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { VideogamesComponent } from './features/videogames/videogames.component';
import { VideogameDetailComponent } from './features/videogame-detail/videogame-detail.component';
import { VideogameCreateComponent } from './features/videogame-create/videogame-create.component';
import { StudiosComponent } from './features/studios/studios.component';
import { ForbiddenComponent } from './features/forbidden/forbidden.component';
import { Error404Component } from './features/error404/error404.component';
import { UsersComponent } from './features/users/users.component';
import { RegisterComponent } from './features/register/register.component';
import { ListsComponent } from './features/lists/lists.component';
import { EditListComponent } from './features/edit-list/edit-list.component';

import { authGuard } from './core/guards/auth.guard';
import { StudioCreateComponent } from './features/studio-create/studio-create.component';
import { StudioEditComponent } from './features/studio-edit/studio-edit.component';
import { AccountComponent } from './features/account/account.component';

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
    path: 'studios',
    component: StudiosComponent,
    canActivate: [authGuard],
    data: { roles: ['USER', 'MANAGER'] }
  },

  {
  path: 'studios/new',
  component: StudioCreateComponent,
  canActivate: [authGuard],
  data: { roles: ['MANAGER'] } // solo managers pueden crear
},
{
  path: 'studios/edit/:id',
  component: StudioEditComponent,
  canActivate: [authGuard],
  data: { roles: ['MANAGER'] }
},


 {
    path: 'account',
    component: AccountComponent,
    canActivate: [authGuard],
    data: { roles: ['USER', 'MANAGER', 'ADMIN'] }
  },

  {
  path: 'lists',
  component: ListsComponent,
  canActivate: [authGuard]   
},
{
  path: 'lists/edit/:id',
  component: EditListComponent,
  canActivate: [authGuard]
},

  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] } // 👈 Solo visible para admin
  },
  { path: 'register', component: RegisterComponent },

  { path: 'forbidden', component: ForbiddenComponent },
  { path: '**', component: Error404Component },

];
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  const role = authService.getUserRole();
  const allowedRoles = route.data?.['roles'] as string[] | undefined;
  const url = state.url;

  // ✅ Rutas públicas (sin roles requeridos)
  if (!allowedRoles) {
    // 🚫 Excepción: si el admin intenta entrar a /videogames
    if (role === 'ADMIN' && url.startsWith('/videogames')) {
      router.navigate(['/forbidden']);
      return false;
    }
    return true;
  }

  // 🚫 Si la ruta requiere roles y no hay token
  if (!token) {
    router.navigate(['/forbidden']);
    return false;
  }

  // 🚫 Si el rol no está autorizado
  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    router.navigate(['/forbidden']);
    return false;
  }

  return true;
};

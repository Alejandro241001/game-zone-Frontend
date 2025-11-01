import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const noAdminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const role = authService.getUserRole();

  // 🔐 Si el usuario es ADMIN, lo bloqueamos
  if (role && role.toUpperCase() === 'ADMIN') {
    router.navigate(['/forbidden']);
    return false;
  }

  // ✅ Si no es admin (user, manager o no logueado) → puede pasar
  return true;
};
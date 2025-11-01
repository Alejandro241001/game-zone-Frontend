import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const managerGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  const role = authService.getUserRole();

  console.log('🧩 Verificando acceso de rol:', role); // 👀 log de depuración

  // ✅ Normalizamos el rol a mayúsculas por seguridad
  const normalizedRole = role ? role.toUpperCase() : null;

  // Permitir solo si es MANAGER (independientemente del formato del claim)
  if (token && (normalizedRole === 'MANAGER' || normalizedRole === 'ROLE_MANAGER')) {
    return true;
  }

  // ❌ En cualquier otro caso, acceso denegado
  router.navigate(['/forbidden']);
  return false;
};

import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { SessionStorageService } from '../services/session-storage.service';
import { NotificationService } from '../services/notification.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const session = inject(SessionStorageService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const tokenObj = session.getItem('token');

  // 1. Si no hay token, no está logueado. Redirigir a login.
  if (!tokenObj) {
    return router.createUrlTree(['/user/login']);
  }

  // 2. Obtener el rol requerido de la data de la ruta.
  const requiredRole = route.data['requiredRole'];

  // 3. Si la ruta no requiere un rol específico, solo con estar logueado es suficiente.
  if (!requiredRole) {
    return true;
  }

  // 4. Si la ruta requiere un rol, verificar que el rol del usuario coincida.
  const userRole = tokenObj.type;
  if (userRole === requiredRole) {
    return true;
  }

  // 5. Si el rol no coincide, denegar acceso y redirigir.
  notificationService.showError('Acceso Denegado', 'No tienes los permisos necesarios para ver esta página.');
  return router.createUrlTree(['/']);
};

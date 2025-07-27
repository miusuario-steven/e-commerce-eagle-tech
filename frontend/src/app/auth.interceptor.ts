import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionStorageService } from './services/session-storage.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const sessionStorage = inject(SessionStorageService);

  // Define las rutas públicas que no deben incluir el token
  const publicRoutes = ['/api/v1/security/register', '/api/v1/security/login'];

  // Verifica si la URL contiene alguna ruta pública
  const isPublic = publicRoutes.some(route => req.url.includes(route));

  if (isPublic) {
    // Si es una ruta pública, deja la solicitud sin modificar
    return next(req);
  }

  // Para rutas protegidas, obtener el objeto token almacenado
  const tokenObj = sessionStorage.getItem('token');

  if (tokenObj && tokenObj.token) {
    // Clona la solicitud para agregar el header de autenticación
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${tokenObj.token}`)
    });
    return next(authReq);
  }

  // Si no hay token, continúa sin modificar
  return next(req);
};

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionStorageService } from './services/session-storage.service'; // Ajusta la importación según corresponda

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private sessionStorage: SessionStorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Define las rutas públicas que no deben incluir el token
    const publicRoutes = ['/api/v1/security/register', '/api/v1/security/login'];

    // Verifica si la URL contiene alguna ruta pública
    const isPublic = publicRoutes.some(route => req.url.includes(route));

    if (isPublic) {
      // Si es una ruta pública, deja la solicitud sin modificar
      return next.handle(req);
    }

    // Para rutas protegidas, obtener el token almacenado
    const token = this.sessionStorage.getItem('token'); // Asegúrate de que esto devuelva el token (sin "Bearer" si lo agregas aquí)

    if (token) {
      // Clona la solicitud para agregar el header de autenticación
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(authReq);
    }

    // Si no hay token, continúa sin modificar
    return next.handle(req);
  }
}

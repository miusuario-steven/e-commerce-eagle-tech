import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from '../../services/session-storage.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  template: `<p>Cerrando sesión...</p>` // No necesita una plantilla compleja
})
export class LogoutComponent implements OnInit {

  constructor(
    private sessionStorage: SessionStorageService,
    private router: Router,
    private cartService: CartService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // 1. Limpiar el carrito de compras (tanto en memoria como en sessionStorage)
    this.cartService.clearCart();

    // 2. Limpiar toda la sessionStorage para eliminar token, order, etc.
    this.sessionStorage.clear();

    // 3. Notificar al usuario
    this.notificationService.showSuccess('Sesión Cerrada', 'Has cerrado sesión correctamente.');

    // 4. Redirigir a la página de login
    this.router.navigate(['/user/login']);
  }
}

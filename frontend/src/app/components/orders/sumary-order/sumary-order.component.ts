import { Component, OnInit } from '@angular/core';
import { HeaderUserComponent } from '../../header-user/header-user.component';
import { RouterModule } from '@angular/router';
import { ItemCart } from '../../../common/item-cart';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { OrderProduct } from '../../../common/order-product';
import { Order } from '../../../common/order';
import { OrderState } from '../../../common/order-state';
import { OrderService } from '../../../services/order.service';
import { PaymentService } from '../../../services/payment.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { NotificationService } from '../../../services/notification.service';
import { switchMap, take, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { User } from '../../../common/user';

@Component({
  selector: 'app-sumary-order',
  standalone: true,
  imports: [HeaderUserComponent, RouterModule, CommonModule],
  templateUrl: './sumary-order.component.html',
  styleUrls: ['./sumary-order.component.css']
})
export class SumaryOrderComponent implements OnInit {

  items$: Observable<ItemCart[]>;
  total$: Observable<number>;
  user: User | undefined;

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private sessionStorage: SessionStorageService,
    private notificationService: NotificationService
  ) {
    this.items$ = this.cartService.items$;
    this.total$ = this.cartService.total$;
  }

  ngOnInit(): void {
    const token = this.sessionStorage.getItem('token');
    if (token && token.id) {
      this.getUserById(token.id);
    } else {
      console.error('Error: No se encontró el token o el ID de usuario en la sesión.');
      this.notificationService.showError('Error de Autenticación', 'No se pudo verificar tu sesión. Por favor, inicia sesión de nuevo.');
    }
  }

  generateOrder() {
    this.items$.pipe(
      take(1),
      switchMap(items => {
        if (items.length === 0) {
          this.notificationService.showWarning('Carrito Vacío', 'No puedes generar una orden sin productos.');
          return throwError(() => new Error('El carrito está vacío.'));
        }
        if (!this.user) {
          this.notificationService.showError('Error de Usuario', 'No se pudieron cargar tus datos para crear la orden.');
          return throwError(() => new Error('Usuario no definido.'));
        }
        const orderProducts = items.map(item => new OrderProduct(null, item.productId, item.quantity, item.price, item.productName));
        const order = new Order(null, new Date(), orderProducts, this.user, OrderState.PENDING, 0);
        
        return this.orderService.createOrder(order).pipe(
          catchError(err => {
            console.error('Error al crear la orden:', err);
            this.notificationService.showError('Error de Creación', 'No se pudo crear la orden. Revisa tu carrito o inténtalo más tarde.');
            return throwError(() => err);
          })
        );
      }),
      switchMap(createdOrder => {
        this.notificationService.showSuccess('Orden Creada', 'Tu orden ha sido creada. Redirigiendo a PayPal...');
        
        if (!createdOrder.id) {
          this.notificationService.showError('Error Crítico', 'La orden se creó sin un ID. No se puede proceder al pago.');
          return throwError(() => new Error('La orden no tiene ID.'));
        }
        this.sessionStorage.setItem('orderId', createdOrder.id.toString());

        return this.paymentService.initiatePaypalPayment(createdOrder.id).pipe(
          catchError(err => {
            console.error('Error al iniciar el pago:', err);
            this.notificationService.showError('Error de Pago', 'No se pudo iniciar el proceso de pago. Por favor, contacta a soporte.');
            // Update order state to FAILED if payment initiation fails
            if (createdOrder.id) {
              this.orderService.updateOrder(createdOrder.id, OrderState.PAYMENT_FAILED).subscribe({
                next: () => console.log('Order state updated to PAYMENT_FAILED after initiation failure.'),
                error: updateErr => console.error('Error updating order state to FAILED:', updateErr)
              });
            }
            return throwError(() => err);
          })
        );
      })
    ).subscribe({
      next: urlPaypalResponse => {
        window.location.href = urlPaypalResponse.url;
      },
      // El error ya se maneja en los catchError, pero mantenemos este bloque por si acaso.
      error: err => {
        console.error('Error final en el flujo de generación de orden:', err.message);
      }
    });
  }

  deleteItemCart(productId: number) {
    this.cartService.deleteItemCart(productId);
  }

  getUserById(id: number) {
    this.userService.getUserById(id).subscribe({
      next: data => {
        this.user = data;
      },
      error: err => {
        console.error('Error al obtener datos del usuario:', err);
        this.notificationService.showError('Error de Usuario', 'No se pudieron cargar tus datos.');
      }
    });
  }
}
  
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderUserComponent } from '../header-user/header-user.component';
import { PaymentService } from '../../services/payment.service';
import { SessionStorageService } from '../../services/session-storage.service';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [HeaderUserComponent, CommonModule],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {

  isLoading = true;
  paymentSuccessful = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private sessionStorage: SessionStorageService,
    private notificationService: NotificationService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    if (this.sessionStorage.getItem('payment_processed') === 'true') {
      this.router.navigate(['/']);
      return;
    }

    const paymentId = this.route.snapshot.queryParamMap.get('paymentId');
    const payerId = this.route.snapshot.queryParamMap.get('PayerID');
    const orderIdString = this.sessionStorage.getItem('orderId');
    const orderId = orderIdString ? parseInt(orderIdString, 10) : null;

    if (paymentId && payerId && orderId) {
      this.executePayment(paymentId, payerId, orderId);
    } else {
      this.isLoading = false;
      this.router.navigate(['/']);
    }
  }

  executePayment(paymentId: string, payerId: string, orderId: number): void {
    this.paymentService.executePaypalPayment(paymentId, payerId, orderId).subscribe({
      next: () => {
        this.paymentSuccessful = true;
        this.isLoading = false;
        this.notificationService.showSuccess('Pago Confirmado', '¡Gracias por tu compra! Tu orden ha sido procesada.');
        this.sessionStorage.setItem('payment_processed', 'true');
        this.cleanupSession();
      },
      error: (err) => {
        console.error('Error al ejecutar el pago:', err);
        this.paymentSuccessful = false;
        this.isLoading = false;
        this.notificationService.showError('Fallo en la Confirmación', 'No se pudo confirmar el pago con PayPal. Contacta a soporte si el cobro fue realizado.');
        this.cleanupSession();
        this.router.navigate(['/']);
      }
    });
  }

  private cleanupSession(): void {
    this.sessionStorage.removeItem('orderId');
    this.cartService.clearCart();
    this.sessionStorage.removeItem('payment_processed');
  }
}


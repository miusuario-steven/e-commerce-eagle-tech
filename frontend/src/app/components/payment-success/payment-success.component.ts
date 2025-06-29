import { Component, OnInit } from '@angular/core';
import { HeaderUserComponent } from '../header-user/header-user.component';
import { OrderService } from '../../services/order.service';
import { SessionStorageService } from '../../services/session-storage.service';
import { OrderState } from '../../common/order-state';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [HeaderUserComponent],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css'
})
export class PaymentSuccessComponent implements OnInit {

  constructor(
    private orderService: OrderService,
    private sessionStorage: SessionStorageService
  ) {}

  ngOnInit(): void {
    const order = this.sessionStorage.getItem('order');
    console.log('Orden en session:', order);

    const orderId = order.id;
    const newState = OrderState.CONFIRMED.toString();

    this.orderService.updateOrder(orderId, newState).subscribe(
      data => {
        console.log('Orden actualizada:', data);

        // ✅ Limpiar la sesión
        console.log('Token antes de limpiar:', this.sessionStorage.getItem('token'));
        this.sessionStorage.removeItem('token');
        this.sessionStorage.removeItem('order');
        console.log('Token después de limpiar:', this.sessionStorage.getItem('token'));
        console.log('Orden eliminada de la sesión');
      }
    );
  }
}

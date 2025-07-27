import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../common/order';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../common/user'; // Asegurarse de que el modelo User esté disponible
import { OrderProduct } from '../../../common/order-product';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: Order | undefined;
  // Lista de estados más completa y representativa
  orderStates = ['PENDING', 'PAID', 'CONFIRMED', 'CANCELED'];
  selectedState: string = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.getOrder();
  }

  getOrder(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getAdminOrderById(id)
      .subscribe((order: Order) => {
        this.order = order;
        this.selectedState = order.orderState.toString();
      });
  }

  updateStatus(): void {
    if (this.order && this.order.id !== null) {
      this.orderService.updateOrderStatus(this.order.id, this.selectedState)
        .subscribe({
          next: () => {
            // Idealmente, aquí se usaría un servicio de notificaciones (toast)
            console.log('Status updated successfully!');
            this.getOrder(); // Recargar los datos
          },
          error: (err) => {
            console.error('Failed to update status', err);
            // Mostrar notificación de error
          }
        });
    }
  }
}

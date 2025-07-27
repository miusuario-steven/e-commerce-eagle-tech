import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { NotificationService } from '../../../services/notification.service';
import { Order } from '../../../common/order';
import { CommonModule } from '@angular/common';
import { HeaderUserComponent } from '../../header-user/header-user.component';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, HeaderUserComponent, RouterModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  currentPage = 0;
  pageSize = 10; // Coincide con @PageableDefault en el backend
  totalPages = 0;
  totalElements = 0;

  constructor(
    private orderService: OrderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadOrderHistory();
  }

  loadOrderHistory(): void {
    this.isLoading = true;
    this.orderService.getOrderByUser(this.currentPage, this.pageSize).subscribe({
      next: (data: any) => { // data es ahora un objeto Page
        this.orders = data.content.map((orderData: any) => 
          new Order(
            orderData.id,
            new Date(orderData.dateCreated),
            orderData.orderProducts,
            orderData.userId,
            orderData.orderState,
            orderData.total // Usar el total del backend
          )
        );
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.notificationService.showError('Error', 'No se pudo cargar tu historial de órdenes.');
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOrderHistory();
  }
}
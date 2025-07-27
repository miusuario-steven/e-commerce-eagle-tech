import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderSummary } from '../../../common/order-summary';
import { Page } from '../../../common/page';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orderPage: Page<OrderSummary> | undefined;
  statusFilter = '';
  customerFilter = '';

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders(0, 10);
  }

  loadOrders(page: number, size: number): void {
    this.orderService.getOrders(page, size, this.statusFilter, this.customerFilter)
      .subscribe((response: Page<OrderSummary>) => {
        this.orderPage = response;
      });
  }

  onPageChange(newPage: number): void {
    if (this.orderPage && newPage >= 0 && newPage < this.orderPage.totalPages) {
      this.loadOrders(newPage, this.orderPage.size);
    }
  }

  onFilterChange(): void {
    this.loadOrders(0, 10);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../common/order';
import { Observable } from 'rxjs';
import { HeaderService } from './header.service';
import { environment } from '../../environments/environment';
import { Page } from '../common/page';
import { OrderSummary } from '../common/order-summary';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl: string = `${environment.apiUrl}/orders`;
  private adminApiUrl: string = `${environment.apiUrl}/admin/orders`;

  constructor(private httpClient: HttpClient, private headerService: HeaderService) { }

  createOrder(order: Order): Observable<Order> {
    return this.httpClient.post<Order>(this.apiUrl, order, { headers: this.headerService.headers });
  }

  updateOrder(orderId: number, newState: string): Observable<any> {
    const url = `${this.apiUrl}/${orderId}/state`;
    const body = { state: newState };
    return this.httpClient.patch(url, body, { headers: this.headerService.headers });
  }

  getOrderByUser(page: number, size: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());
    return this.httpClient.get<any>(`${this.apiUrl}/my-history`, { headers: this.headerService.headers, params: params });
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.httpClient.get<Order>(`${this.apiUrl}/${orderId}`, { headers: this.headerService.headers });
  }

  // Admin methods
  getOrders(page: number, size: number, status?: string, customerQuery?: string): Observable<Page<OrderSummary>> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());
    if (status) {
      params = params.append('status', status);
    }
    if (customerQuery) {
      params = params.append('customerQuery', customerQuery);
    }
    return this.httpClient.get<Page<OrderSummary>>(this.adminApiUrl, { headers: this.headerService.headers, params: params });
  }

  getAdminOrderById(orderId: number): Observable<Order> {
    return this.httpClient.get<Order>(`${this.adminApiUrl}/${orderId}`, { headers: this.headerService.headers });
  }

  updateOrderStatus(orderId: number, newState: string): Observable<any> {
    const url = `${this.adminApiUrl}/${orderId}/state`;
    const body = { newState: newState };
    return this.httpClient.put(url, body, { headers: this.headerService.headers });
  }
}

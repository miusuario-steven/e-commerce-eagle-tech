import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlPaypalResponse } from '../common/url-paypal-response';
import { HeaderService } from './header.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl: string = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient, private headerService: HeaderService) { }

  /**
   * Inicia el proceso de pago para una orden existente.
   * Envía el ID de la orden al backend, que es la única fuente de verdad para el monto y los detalles.
   * @param orderId El ID de la orden a pagar.
   * @returns Un Observable con la URL de pago de PayPal.
   */
  initiatePaypalPayment(orderId: number): Observable<UrlPaypalResponse> {
    const initiatePaymentUrl = `${this.apiUrl}/initiate`;
    const body = { orderId };
    return this.http.post<UrlPaypalResponse>(initiatePaymentUrl, body, { headers: this.headerService.headers });
  }

  /**
   * Envía los detalles de la transacción de PayPal al backend para su ejecución y confirmación.
   * @param paymentId El ID del pago generado por PayPal.
   * @param payerId El ID del pagador (cliente) generado por PayPal.
   * @param orderId El ID de la orden interna que se está pagando.
   * @returns Un Observable que se completa cuando el pago es exitoso.
   */
  executePaypalPayment(paymentId: string, payerId: string, orderId: number): Observable<any> {
    const executePaymentUrl = `${this.apiUrl}/execute`;
    const body = { paymentId, payerId, orderId };
    return this.http.post(executePaymentUrl, body, { headers: this.headerService.headers });
  }
}

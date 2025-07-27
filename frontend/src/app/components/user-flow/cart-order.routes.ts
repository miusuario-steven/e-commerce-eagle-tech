import { Routes } from '@angular/router';
import { DetailProductComponent } from '../cart/detail-product/detail-product.component';
import { SumaryOrderComponent } from '../orders/sumary-order/sumary-order.component';
import { PaymentSuccessComponent } from '../payment-success/payment-success.component';
import { OrderHistoryComponent } from '../orders/order-history/order-history.component';
import { authGuard } from '../../guards/auth.guard';

export const CART_ORDER_ROUTES: Routes = [
  { path: 'detailproduct/:id', component: DetailProductComponent },
  { path: 'sumary', component: SumaryOrderComponent, canActivate: [authGuard] },
  { path: 'payment/success', component: PaymentSuccessComponent },
  { path: 'history', component: OrderHistoryComponent, canActivate: [authGuard], data: { requiredRole: 'USER' } }
];
 
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DetailProductComponent } from './components/cart/detail-product/detail-product.component';
import { SumaryOrderComponent } from './components/orders/sumary-order/sumary-order.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { LogoutComponent } from './components/logout/logout.component';
import { authGuard } from './guards/auth.guard';
import { OrderHistoryComponent } from './components/orders/order-history/order-history.component';

export const routes: Routes = [
    {path:'', component:HomeComponent},

    // Rutas de la Tienda (Lazy Loaded)
    {
        path: 'tienda',
        loadChildren: () => import('./shop/shop.routes').then(m => m.SHOP_ROUTES)
    },

    // Rutas de Admin (Lazy Loaded)
    {
        path: 'admin',
        loadChildren: () => import('./components/admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },

    // Rutas de Autenticación (Lazy Loaded)
    {
        path: 'user',
        loadChildren: () => import('./components/authetication/auth.routes').then(m => m.AUTH_ROUTES)
    },

    // Rutas de Usuario y Carrito
    {path: 'cart/detailproduct/:id', component:DetailProductComponent},
    {path: 'cart/sumary', component:SumaryOrderComponent, canActivate: [authGuard]},
    {path: 'payment-success', component:PaymentSuccessComponent},
    {path: 'order-history', component: OrderHistoryComponent, canActivate: [authGuard], data: { requiredRole: 'USER' }},

    // Autenticación
    {path: 'logout', component: LogoutComponent}
];


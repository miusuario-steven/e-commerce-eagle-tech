import { Route } from '@angular/router';
import { ShopComponent } from './shop.component';

export const SHOP_ROUTES: Route[] = [
  {
    path: '', // Corresponde a /tienda
    component: ShopComponent,
  },
  {
    path: 'categoria/:categoryId', // Corresponde a /tienda/categoria/3
    component: ShopComponent,
  },
  {
    path: 'buscar', // Corresponde a /tienda/buscar?q=...
    component: ShopComponent,
  },
];

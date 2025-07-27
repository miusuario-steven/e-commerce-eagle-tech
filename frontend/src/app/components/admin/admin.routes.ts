import { Routes } from '@angular/router';
import { ProductListComponent } from '../product-list/product-list.component';
import { ProductAddComponent } from '../product-add/product-add.component';
import { CategoryListComponent } from '../category/category-list/category-list.component';
import { CategoryAddComponent } from '../category/category-add/category-add.component';
import { authGuard } from '../../guards/auth.guard';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';

export const ADMIN_ROUTES: Routes = [ 
    {path: 'product', component: ProductListComponent, canActivate: [authGuard], data: { requiredRole: 'ADMIN' }},
    {path:'product/addproduct', component:ProductAddComponent, canActivate: [authGuard], data: { requiredRole: 'ADMIN' }},
    {path: 'product/update/:id', component:ProductAddComponent, canActivate: [authGuard], data: { requiredRole: 'ADMIN' }},
    {path: 'category', component:CategoryListComponent, canActivate: [authGuard], data: { requiredRole: 'ADMIN' }},
    {path: 'category/add', component:CategoryAddComponent, canActivate: [authGuard], data: { requiredRole: 'ADMIN' }},
    {path: 'category/update/:id', component:CategoryAddComponent, canActivate: [authGuard], data: { requiredRole: 'ADMIN' }},
    {path: 'orders', component: OrderListComponent, canActivate: [authGuard], data: { requiredRole: 'ADMIN' }},
    {path: 'orders/:id', component: OrderDetailComponent, canActivate: [authGuard], data: { requiredRole: 'ADMIN' }},
    {path: '', redirectTo: 'product', pathMatch: 'full'}
];

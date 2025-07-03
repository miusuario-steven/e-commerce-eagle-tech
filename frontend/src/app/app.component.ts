import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HeaderUserComponent } from './components/header-user/header-user.component';
import { HeaderAdminComponent } from './components/header-admin/header-admin.component'; // ✅ IMPORTADO
import { RegistrationComponent } from './components/authetication/registration/registration.component';
import { ToastComponent } from './components/ui/toast/toast.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    HomeComponent,
    ProductListComponent,
    HeaderUserComponent,
    HeaderAdminComponent, // ✅ AGREGADO AQUÍ
    RegistrationComponent,
    ToastComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  constructor(private router: Router) {}

  get isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }
}

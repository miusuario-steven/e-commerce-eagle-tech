import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HeaderUserComponent } from './components/header-user/header-user.component';
import { HeaderAdminComponent } from './components/header-admin/header-admin.component';
import { RegistrationComponent } from './components/authetication/registration/registration.component';
import { SessionStorageService } from './services/session-storage.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
    HeaderAdminComponent,
    RegistrationComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  isAdmin$!: Observable<boolean>;
  isLoggedIn$!: Observable<boolean>;

  constructor(private sessionStorage: SessionStorageService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.sessionStorage.watchLoggedIn();
    this.isAdmin$ = this.isLoggedIn$.pipe(
      map(loggedIn => {
        if (loggedIn) {
          const token = this.sessionStorage.getItem('token');
          return token && token.type === 'ADMIN';
        }
        return false;
      })
    );
  }
}

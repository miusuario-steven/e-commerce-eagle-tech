import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderUserComponent } from '../../header-user/header-user.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderUserComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private sessionStorage: SessionStorageService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  login(): void {
    if (this.loginForm.invalid) {
      this.notificationService.showInfo('Formulario inválido', 'Por favor, ingresa tu usuario y contraseña.');
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authenticationService.login({ username, password }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
        if (error.status === 401) {
          errorMessage = 'Credenciales inválidas. Por favor, verifica tu usuario y contraseña.';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.notificationService.showError('Error de inicio de sesión', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    ).subscribe(token => {
      this.sessionStorage.setItem('token', token);
      this.notificationService.showSuccess('Inicio de sesión exitoso', 'Bienvenido de nuevo!');

      if (token.type === 'ADMIN') {
        this.router.navigate(['/admin/product']);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  get f() { return this.loginForm.controls; }
}


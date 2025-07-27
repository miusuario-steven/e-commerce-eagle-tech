import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderUserComponent } from '../../header-user/header-user.component';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, HeaderUserComponent, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      cellphone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userType: ['USER'] // Default value
    });
  }

  ngOnInit(): void {}

  register(): void {
    if (this.registrationForm.invalid) {
      this.notificationService.showInfo('Formulario inválido', 'Por favor, completa todos los campos requeridos y válidos.');
      return;
    }

    localStorage.removeItem('token'); // Clear token before new registration

    const user = this.registrationForm.value;

    this.authenticationService.register(user).subscribe({
      next: () => {
        this.notificationService.showSuccess('Registro exitoso', 'Usuario registrado correctamente. Ahora puedes iniciar sesión.');
        this.router.navigate(['user/login']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this.notificationService.showWarning('Este correo electrónico ya está registrado.', 'Error de registro');
        } else {
          this.notificationService.showError('Ocurrió un error inesperado al registrar el usuario.', 'Error de registro');
        }
      }
    });
  }

  get f() { return this.registrationForm.controls; }
}


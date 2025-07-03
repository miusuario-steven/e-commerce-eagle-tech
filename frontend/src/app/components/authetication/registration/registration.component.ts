import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderUserComponent } from '../../header-user/header-user.component';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../../../common/user';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service'; // ✅ nuevo

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, HeaderUserComponent, FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit {
  username: string = '';
  name: string = '';
  surname: string = '';
  email: string = '';
  address: string = '';
  cellphone: string = '';
  password: string = '';
  userType: string = 'USER'; // Valor por defecto

  constructor(
    private authentication: AuthenticationService,
    private router: Router,
    private notification: NotificationService // ✅ inyectamos el servicio
  ) {}

  ngOnInit(): void {}

  register() {
    localStorage.removeItem('token');

    const user = new User(
      null,
      this.username,
      this.name,
      this.surname,
      this.email,
      this.address,
      this.cellphone,
      this.password,
      this.userType
    );

    console.log('User JSON:', JSON.stringify(user));

    this.authentication.register(user).subscribe({
      next: res => {
        this.notification.show('Usuario registrado con éxito', 'success'); // ✅ notificación correcta
        this.router.navigate(['user/login']);
      },
      error: err => {
        console.error('Error en registro:', err);
        this.notification.show('Error al registrar el usuario', 'error'); // ✅ notificación de error
      }
    });
  }
}

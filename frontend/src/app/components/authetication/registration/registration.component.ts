import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderUserComponent } from '../../header-user/header-user.component';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../../../common/user';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService
  ) { }

  ngOnInit(): void { }

  register() {
    // Borra el token anterior
    localStorage.removeItem('token');

    // Crear instancia de la clase User (con id en null)
    const user = new User(
      null,                // id generado por el backend
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
        this.toastr.success('Usuario registrado con éxito', 'Usuario');
        console.log(res);
        this.router.navigate(['user/login']);
      },
      error: err => {
        console.error('Error en registro:', err);
        this.toastr.error('Error al registrar el usuario', 'Error');
      }
    });
  }
}

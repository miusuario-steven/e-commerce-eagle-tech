import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderUserComponent } from '../../header-user/header-user.component';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../../../common/user';
import { UserType } from '../../../common/user-type';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule,HeaderUserComponent,FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit{

  username : string = '';
  name : string = '';
  surname : string = '';
  email : string = '';
  address : string = '';
  cellphone : string = '';
  password : string = '';
  userType : string = '';

  ngOnInit(): void {
  }

  constructor(private authentication : AuthenticationService, private router : Router,
    private toastr : ToastrService
  ) { }

  register(){
    this.username  = this.email;
    this.userType = UserType.USER;
    const user =  new User (0, this.username, this.name, this.surname, this.email, this.address, this.cellphone, this.password, this.userType);
    console.log('User JSON:', JSON.stringify(user)); // Agrega este log para verificar el JSON
    this.authentication.register(user).subscribe(
      res => {
        this.toastr.success('Usuario registrado con exito', 'Usuario');
        console.log(res);
      }
    );
    console.log(user); 
    this.router.navigate(['user/login']);

  }
} 
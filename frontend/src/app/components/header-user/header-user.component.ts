import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SessionStorageService } from '../../services/session-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-user',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css']
})
export class HeaderUserComponent implements OnInit {
  isLoggedIn = false;
  
  constructor(private sessionStorage: SessionStorageService) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    const token = this.sessionStorage.getItem('token');
    this.isLoggedIn = !!token;
  }
}
 
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionStorageService } from '../../services/session-storage.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.css'
})
export class HeaderAdminComponent implements OnInit {
  isMenuOpen = false;
  isLoggedIn$!: Observable<boolean>;

  constructor(private sessionStorage: SessionStorageService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.sessionStorage.watchLoggedIn();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}

import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(private sessionStorage: SessionStorageService) {}

  // Headers para JSON (por defecto en GET/DELETE/PUT)
  get headers(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Headers para FormData (NO incluir Content-Type)
  get headersForFormData(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Obtener solo el token
  getToken(): string {
    const tokenObj = this.sessionStorage.getItem('token');
    return tokenObj ? tokenObj.token : '';
  }
}

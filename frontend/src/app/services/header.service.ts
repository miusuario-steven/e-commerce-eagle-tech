import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionStorageService } from './session-storage.service'; // Import SessionStorageService

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(private sessionStorageService: SessionStorageService) {} // Inject SessionStorageService

  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.sessionStorageService.getItem('token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token.token}`); // Assuming token object has a 'token' property
    }
    return headers;
  }

  // Headers para JSON (por defecto en GET/DELETE/PUT)
  get headers(): HttpHeaders {
    return this.getAuthHeaders().set('Content-Type', 'application/json');
  }

  // Headers para FormData (NO incluir Content-Type)
  get headersForFormData(): HttpHeaders {
    // El navegador establecerá automáticamente el Content-Type correcto para FormData
    // junto con el boundary, por lo que es mejor devolver una cabecera vacía o
    // una que no especifique Content-Type.
    return this.getAuthHeaders(); // Include auth headers for FormData as well
  }
}

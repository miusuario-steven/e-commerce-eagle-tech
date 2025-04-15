import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl: string = "http://localhost:8085/api/v1/admin/products";

  constructor(
    private httpClient: HttpClient,
    private headerService: HeaderService
  ) {}

  getProduct(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.apiUrl, {
      headers: this.headerService.headers
    });
  }

  createProduct(formData: FormData): Observable<Product> {
    return this.httpClient.post<Product>(this.apiUrl, formData, {
      headers: this.headerService.headersForFormData
    });
  }

  deleteProductById(id: number): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/${id}`, {
      headers: this.headerService.headers
    });
  }

  getProductById(id: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.apiUrl}/${id}`, {
      headers: this.headerService.headers
    });
  }
}

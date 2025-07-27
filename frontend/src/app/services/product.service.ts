import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { HeaderService } from './header.service';
import { environment } from '../../environments/environment';
import { ProductResponse } from '../common/product-response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl: string = `${environment.apiUrl}/admin/products`;

  constructor(
    private httpClient: HttpClient,
    private headerService: HeaderService
  ) {}

  getProducts(page: number = 0, size: number = 10): Observable<ProductResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.httpClient.get<ProductResponse>(this.apiUrl, {
      headers: this.headerService.headers,
      params: params
    });
  }

  createProduct(formData: FormData): Observable<Product> {
    return this.httpClient.post<Product>(this.apiUrl, formData, {
      headers: this.headerService.headersForFormData
    });
  }

  updateProduct(id: number, formData: FormData): Observable<Product> {
    return this.httpClient.put<Product>(`${this.apiUrl}/${id}`, formData, {
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
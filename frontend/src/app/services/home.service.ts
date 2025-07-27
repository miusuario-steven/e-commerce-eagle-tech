import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { environment } from '../../environments/environment';
import { ProductResponse } from '../common/product-response';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl: string = `${environment.apiUrl}/home`;

  constructor(private httpClient: HttpClient) { }

  getProducts(page: number = 0, size: number = 4): Observable<ProductResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'dateCreated,desc'); // Ordenar por fecha de creación para mostrar los más nuevos

    return this.httpClient.get<ProductResponse>(this.apiUrl, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.apiUrl}/${id}`);
  }
}


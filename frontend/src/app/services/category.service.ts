import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../common/category';
import { Observable } from 'rxjs';
import { HeaderService } from './header.service';
import { environment } from '../../environments/environment';
import { CategoryResponse } from '../common/category-response';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private adminApiUrl: string = `${environment.apiUrl}/admin/categories`;
  private publicApiUrl: string = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient, private headerService: HeaderService) { }

  /**
   * Obtiene todas las categorías de forma pública con paginación y filtro.
   * No requiere autenticación.
   */
  getPublicCategoryList(page: number = 0, size: number = 10, name: string = ''): Observable<CategoryResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (name) {
      params = params.set('name', name);
    }
    return this.http.get<CategoryResponse>(this.publicApiUrl, { params: params });
  }

  /**
   * Obtiene todas las categorías con paginación y filtro.
   * Protegido por ADMIN role.
   */
  getCategoryList(page: number = 0, size: number = 10, name: string = ''): Observable<CategoryResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (name) {
      params = params.set('name', name);
    }
    return this.http.get<CategoryResponse>(this.adminApiUrl, { headers: this.headerService.headers, params: params });
  }

  /**
   * Obtiene una categoría por su ID.
   * Necesario para poblar el formulario de edición.
   * Protegido por ADMIN role.
   */
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.adminApiUrl}/${id}`, { headers: this.headerService.headers });
  }

  /**
   * Crea una nueva categoría.
   * Protegido por ADMIN role.
   */
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.adminApiUrl, category, { headers: this.headerService.headers });
  }

  /**
   * Actualiza una categoría existente.
   * Protegido por ADMIN role.
   */
  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.adminApiUrl}/${id}`, category, { headers: this.headerService.headers });
  }

  /**
   * Elimina una categoría por su ID.
   * Protegido por ADMIN role.
   */
  deleteCategoryById(id: number): Observable<any> {
    return this.http.delete(`${this.adminApiUrl}/${id}`, { headers: this.headerService.headers });
  }
}

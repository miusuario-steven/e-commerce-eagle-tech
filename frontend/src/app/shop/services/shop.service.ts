import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ProductResponse } from '../../common/product-response';
import { environment } from '../../../environments/environment';

export interface SearchCriteria {
  page: number;
  size: number;
  sort?: string;
  categoryId?: number;
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private apiUrl = `${environment.apiUrl}/products`;

  private searchCriteriaSubject = new BehaviorSubject<SearchCriteria>({
    page: 0,
    size: 12,
    sort: 'dateCreated,desc'
  });
  public searchCriteria$ = this.searchCriteriaSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  public isLoading$ = this.isLoadingSubject.asObservable();

  public products$: Observable<ProductResponse> = this.searchCriteria$.pipe(
    tap(() => this.isLoadingSubject.next(true)),
    switchMap(criteria => this.fetchProducts(criteria)),
    tap(() => this.isLoadingSubject.next(false))
  );

  constructor(private httpClient: HttpClient) {}

  private fetchProducts(criteria: SearchCriteria): Observable<ProductResponse> {
    let params = new HttpParams()
      .set('page', criteria.page.toString())
      .set('size', criteria.size.toString());

    if (criteria.sort) {
      params = params.set('sort', criteria.sort);
    }
    if (criteria.categoryId) {
      params = params.set('categoryId', criteria.categoryId.toString());
    }
    if (criteria.searchTerm) {
      params = params.set('searchTerm', criteria.searchTerm);
    }
    if (criteria.minPrice) {
      params = params.set('minPrice', criteria.minPrice.toString());
    }
    if (criteria.maxPrice) {
      params = params.set('maxPrice', criteria.maxPrice.toString());
    }

    return this.httpClient.get<ProductResponse>(`${this.apiUrl}/search`, { params });
  }

  updateFilters(filters: { categoryId?: number | null; minPrice?: number; maxPrice?: number }): void {
    const currentCriteria = this.searchCriteriaSubject.getValue();
    const newFilters: Partial<SearchCriteria> = {};
  
    if (filters.categoryId !== undefined) {
      newFilters.categoryId = filters.categoryId === null ? undefined : filters.categoryId;
    }
    if (filters.minPrice !== undefined) {
      newFilters.minPrice = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      newFilters.maxPrice = filters.maxPrice;
    }
  
    this.searchCriteriaSubject.next({ ...currentCriteria, ...newFilters, page: 0 });
  }
  

  updateSearchTerm(searchTerm: string | null): void {
    const currentCriteria = this.searchCriteriaSubject.getValue();
    this.searchCriteriaSubject.next({ ...currentCriteria, searchTerm: searchTerm || undefined, page: 0 });
  }

  updateSort(sort: string): void {
    const currentCriteria = this.searchCriteriaSubject.getValue();
    this.searchCriteriaSubject.next({ ...currentCriteria, sort, page: 0 });
  }

  updatePage(page: number): void {
    const currentCriteria = this.searchCriteriaSubject.getValue();
    this.searchCriteriaSubject.next({ ...currentCriteria, page });
  }

  initStateFromQueryParams(params: any): void {
    const initialCriteria: SearchCriteria = {
      page: params['page'] ? +params['page'] : 0,
      size: 12,
      sort: params['sort'] || 'dateCreated,desc',
      categoryId: params['categoryId'] ? +params['categoryId'] : undefined,
      searchTerm: params['q'] || undefined,
      minPrice: params['minPrice'] ? +params['minPrice'] : undefined,
      maxPrice: params['maxPrice'] ? +params['maxPrice'] : undefined,
    };
    this.searchCriteriaSubject.next(initialCriteria);
  }
}
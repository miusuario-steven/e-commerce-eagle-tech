import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ProductFiltersComponent } from './components/product-filters/product-filters.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { ShopService } from './services/shop.service';
import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { ProductResponse } from '../common/product-response';
import { Category } from '../common/category';
import { CategoryService } from '../services/category.service';
import { HeaderUserComponent } from '../components/header-user/header-user.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ProductFiltersComponent, ProductGridComponent, HeaderUserComponent],
  templateUrl: './shop.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopComponent implements OnInit, OnDestroy {
  productsResponse$: Observable<ProductResponse>;
  isLoading$: Observable<boolean>;
  categories$: Observable<Category[]>;

  private destroy$ = new Subject<void>();

  constructor(
    public shopService: ShopService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productsResponse$ = this.shopService.products$;
    this.isLoading$ = this.shopService.isLoading$;
    // Cargar todas las categorías para los filtros, asumiendo que no serán un número excesivamente grande
    this.categories$ = this.categoryService.getPublicCategoryList(0, 1000).pipe(
      map(response => response.content)
    );
  }

  ngOnInit(): void {
    // 1. Leer estado desde la URL al iniciar
    this.route.queryParams.pipe(take(1)).subscribe(params => {
      this.shopService.initStateFromQueryParams(params);
    });

    // 2. Sincronizar el estado del servicio a la URL en cada cambio
    this.shopService.searchCriteria$.pipe(takeUntil(this.destroy$)).subscribe(criteria => {
      const queryParams: Params = {
        q: criteria.searchTerm || null,
        categoryId: criteria.categoryId || null,
        minPrice: criteria.minPrice || null,
        maxPrice: criteria.maxPrice || null,
        sort: criteria.sort !== 'dateCreated,desc' ? criteria.sort : null,
        page: (criteria.page && criteria.page > 0) ? criteria.page : null
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: queryParams,
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    });

    // 3. Manejar cambios de categoría desde la ruta
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['categoryId']) {
        this.shopService.updateFilters({ categoryId: +params['categoryId'] });
      }
    });
  }

  onFiltersChanged(filters: { categoryId?: number | null; minPrice?: number; maxPrice?: number }): void {
    this.shopService.updateFilters(filters);
  }

  onPageChanged(page: number): void {
    this.shopService.updatePage(page);
  }

  onSortChanged(sort: string): void {
    this.shopService.updateSort(sort);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

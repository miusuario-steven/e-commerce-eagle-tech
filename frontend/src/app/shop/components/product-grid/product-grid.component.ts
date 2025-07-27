import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../common/product';
import { ProductResponse } from '../../../common/product-response';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="relative">
      <!-- Controles Superiores -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <span class="text-white/80 text-sm">
          Mostrando <span class="font-bold text-white">{{ products.length }}</span> de <span class="font-bold text-white">{{ paginationInfo?.totalElements }}</span> productos
        </span>
        <div class="relative">
          <select (change)="onSortChange($event)" 
                  class="bg-white/10 backdrop-blur-lg border border-white/10 text-white rounded-lg px-4 py-2 appearance-none focus:ring-cyan-500 focus:border-cyan-500 transition cursor-pointer">
            <option value="dateCreated,desc" class="bg-gray-800">Más Nuevos</option>
            <option value="price,asc" class="bg-gray-800">Precio: Menor a Mayor</option>
            <option value="price,desc" class="bg-gray-800">Precio: Mayor a Menor</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/50">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <!-- Indicador de Carga -->
      <div *ngIf="isLoading" class="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10 min-h-[400px]">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
      </div>

      <!-- Mensaje de No Hay Productos -->
      <div *ngIf="!isLoading && products.length === 0" 
           class="flex flex-col items-center justify-center bg-white/5 rounded-2xl min-h-[400px] p-8 text-center">
        <svg class="w-16 h-16 text-cyan-400/50 mb-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <h3 class="text-2xl font-bold text-white">No se encontraron productos</h3>
        <p class="text-white/70 mt-2">Intenta ajustar los filtros o cambiar tu término de búsqueda.</p>
      </div>

      <!-- Grid de Productos -->
      <div *ngIf="!isLoading && products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" [class.blur-sm]="isLoading">
        <div *ngFor="let product of products" 
             class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg shadow-black/40 p-5 flex flex-col text-white transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_5px_rgba(207,93,207,0.8)] border border-white/10">
          <a [routerLink]="['/cart/detailproduct', product.id]" class="w-full block">
            <img [src]="product.urlImage" [alt]="product.name" class="w-full h-56 object-contain rounded-lg mb-4 drop-shadow-md">
          </a>
          <div class="flex-grow flex flex-col">
            <h3 class="text-lg font-semibold text-center flex-grow">{{ product.name }}</h3>
            <div class="text-cyan-300 font-bold text-2xl my-3 text-center">\${{ product.price | number:'1.0-0' }}</div>
            <a [routerLink]="['/cart/detailproduct', product.id]" class="mt-auto block text-center bg-white/20 hover:bg-white/30 px-5 py-2 rounded-lg backdrop-blur-sm text-white font-bold transition">
              Ver Detalles
            </a>
          </div>
        </div>
      </div>

      <!-- Paginación Mejorada -->
      <div *ngIf="!isLoading && paginationInfo && paginationInfo.totalPages > 1" class="flex justify-center items-center p-4 mt-10">
        <nav class="flex items-center space-x-2" aria-label="Pagination">
          <button (click)="changePage(paginationInfo.number - 1)" [disabled]="paginationInfo.first" 
                  class="px-4 py-2 bg-white/10 rounded-md hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition">
            Anterior
          </button>
          
          <ng-container *ngFor="let pageNum of getPageNumbers()">
            <button (click)="changePage(pageNum)"
                    [ngClass]="{
                      'bg-cyan-500 text-white font-bold': paginationInfo.number === pageNum,
                      'bg-white/10 hover:bg-white/20': paginationInfo.number !== pageNum
                    }"
                    class="w-10 h-10 rounded-md transition">
              {{ pageNum + 1 }}
            </button>
          </ng-container>

          <button (click)="changePage(paginationInfo.number + 1)" [disabled]="paginationInfo.last" 
                  class="px-4 py-2 bg-white/10 rounded-md hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition">
            Siguiente
          </button>
        </nav>
      </div>
    </div>
  `,
})
export class ProductGridComponent {
  @Input() products: Product[] = [];
  @Input() paginationInfo: ProductResponse | null = null;
  @Input() isLoading = true;
  @Output() pageChanged = new EventEmitter<number>();
  @Output() sortChanged = new EventEmitter<string>();

  changePage(page: number): void {
    if (page >= 0 && page < (this.paginationInfo?.totalPages || 0)) {
      this.pageChanged.emit(page);
    }
  }

  onSortChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sortChanged.emit(selectElement.value);
  }

  getPageNumbers(): number[] {
    if (!this.paginationInfo) {
      return [];
    }

    const totalPages = this.paginationInfo.totalPages;
    const currentPage = this.paginationInfo.number;
    const maxPagesToShow = 5;
    const pages: number[] = [];

    if (totalPages <= maxPagesToShow) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;

      if (endPage >= totalPages) {
        endPage = totalPages - 1;
        startPage = endPage - maxPagesToShow + 1;
      }
      
      if (startPage > 0) {
        pages.push(0);
        if (startPage > 1) {
          // Representa los puntos suspensivos, usamos un número no válido para identificarlo
          pages.push(-1); 
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        if (endPage < totalPages - 2) {
          pages.push(-1);
        }
        pages.push(totalPages - 1);
      }
    }
    
    // El template necesitará una lógica para manejar el -1 y mostrar '...'
    // Por simplicidad aquí, solo generamos los números directos.
    // Una implementación más avanzada manejaría los '...' en el template.
    // Por ahora, vamos a simplificarlo para mostrar un rango simple.
    
    const simplePages: number[] = [];
    let simpleStart = Math.max(0, currentPage - 2);
    let simpleEnd = Math.min(totalPages - 1, currentPage + 2);

    if (currentPage < 2) {
      simpleEnd = Math.min(totalPages - 1, 4);
    }
    if (currentPage > totalPages - 3) {
      simpleStart = Math.max(0, totalPages - 5);
    }

    for (let i = simpleStart; i <= simpleEnd; i++) {
      simplePages.push(i);
    }
    return simplePages;
  }
}
